"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function toDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function nextSundays(count: number): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntilSunday = (7 - today.getDay()) % 7;
  const firstSunday = new Date(today);
  firstSunday.setDate(today.getDate() + daysUntilSunday);

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(firstSunday);
    d.setDate(firstSunday.getDate() + i * 7);
    return toDateKey(d);
  });
}

export async function ensureUpcomingSundays(count = 3) {
  const supabase = await createClient();
  const dates = nextSundays(count);

  const { data: existing } = await supabase
    .from("services")
    .select("service_date")
    .in("service_date", dates);

  const existingDates = new Set((existing ?? []).map((s) => s.service_date));
  const missing = dates.filter((d) => !existingDates.has(d));

  if (missing.length > 0) {
    await supabase.from("services").insert(missing.map((service_date) => ({ service_date })));
  }
}

// Every service needs a (possibly unassigned) slot for every AM Team / PM Team role.
// Assignments are per-service - nothing here is shared with any other service.
export async function ensureServiceLineupSlots(serviceId: string) {
  const supabase = await createClient();
  const [{ data: teams }, { data: roles }, { data: existing }] = await Promise.all([
    supabase.from("teams").select("id"),
    supabase.from("roles").select("id"),
    supabase
      .from("service_lineup_assignments")
      .select("team_id, role_id")
      .eq("service_id", serviceId),
  ]);
  if (!teams || !roles) return;

  const existingKeys = new Set(
    (existing ?? []).map((a) => `${a.team_id}_${a.role_id}`)
  );

  const missing = teams.flatMap((team) =>
    roles
      .filter((role) => !existingKeys.has(`${team.id}_${role.id}`))
      .map((role) => ({ service_id: serviceId, team_id: team.id, role_id: role.id }))
  );

  if (missing.length > 0) {
    await supabase.from("service_lineup_assignments").insert(missing);
  }
}

const INSTRUMENTS = [
  "Electric Guitar",
  "Acoustic Guitar",
  "Drums",
  "Bass Guitar",
  "Keyboard",
  "Vocals",
];

export async function addVolunteer(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const nickname = String(formData.get("nickname") ?? "").trim();
  const instruments = formData
    .getAll("instruments")
    .map(String)
    .filter((i) => INSTRUMENTS.includes(i));

  const supabase = await createClient();
  await supabase.from("volunteers").insert({
    name,
    nickname: nickname || null,
    instruments,
  });
  revalidatePath("/volunteers");
}

export async function deleteVolunteer(id: string) {
  const supabase = await createClient();
  await supabase.from("volunteers").delete().eq("id", id);
  revalidatePath("/volunteers");
}

export async function updateServiceLineupAssignment(
  serviceId: string,
  teamId: string,
  roleId: string,
  personId: string
) {
  const supabase = await createClient();
  await supabase
    .from("service_lineup_assignments")
    .update({ person_id: personId || null })
    .eq("service_id", serviceId)
    .eq("team_id", teamId)
    .eq("role_id", roleId);
  revalidatePath(`/services/${serviceId}`);
}

export async function addService(formData: FormData) {
  const serviceDate = String(formData.get("service_date") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!serviceDate) return;

  const supabase = await createClient();
  const { data: service, error } = await supabase
    .from("services")
    .insert({ service_date: serviceDate, title: title || null })
    .select("id")
    .single();

  if (error || !service) return;

  revalidatePath("/");
  redirect(`/services/${service.id}`);
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/");
  redirect("/");
}

export async function addSong(serviceId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const singerOrBand = String(formData.get("singer_or_band") ?? "").trim();
  const version = String(formData.get("version") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const key = String(formData.get("key") ?? "").trim();
  const bpmRaw = String(formData.get("bpm") ?? "").trim();
  const bpm = bpmRaw ? Number(bpmRaw) : null;

  const supabase = await createClient();
  await supabase.from("songs").insert({
    service_id: serviceId,
    name,
    singer_or_band: singerOrBand || null,
    version: version || null,
    url: url || null,
    key: key || null,
    bpm: bpm !== null && !Number.isNaN(bpm) ? bpm : null,
  });
  revalidatePath(`/services/${serviceId}`);
}

export async function deleteSong(serviceId: string, songId: string) {
  const supabase = await createClient();
  await supabase.from("songs").delete().eq("id", songId);
  revalidatePath(`/services/${serviceId}`);
}

export async function updateSongKey(serviceId: string, songId: string, key: string) {
  const supabase = await createClient();
  await supabase.from("songs").update({ key }).eq("id", songId);
  revalidatePath(`/services/${serviceId}`);
}

// "Reset Lineup" on a service clears its setlist back to empty.
export async function resetServiceSongs(serviceId: string) {
  const supabase = await createClient();
  await supabase.from("songs").delete().eq("service_id", serviceId);
  revalidatePath(`/services/${serviceId}`);
}

export async function addPlaylist(serviceId: string, formData: FormData) {
  const url = String(formData.get("url") ?? "").trim();
  if (!url) return;

  const supabase = await createClient();
  await supabase.from("playlists").insert({ service_id: serviceId, url });
  revalidatePath(`/services/${serviceId}`);
}

export async function deletePlaylist(serviceId: string, playlistId: string) {
  const supabase = await createClient();
  await supabase.from("playlists").delete().eq("id", playlistId);
  revalidatePath(`/services/${serviceId}`);
}
