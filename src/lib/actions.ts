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

export async function archivePastServices() {
  const supabase = await createClient();
  const today = toDateKey(new Date());
  await supabase
    .from("services")
    .update({ archived: true })
    .lt("service_date", today)
    .eq("archived", false);
}

// Every service needs a (possibly unassigned) slot for every AM Team / PM Team role.
// A role with a team_id only gets a slot on that one team; a role with a
// null team_id (the original design) still gets a slot on every team.
// Assignments are per-service - nothing here is shared with any other service.
export async function ensureServiceLineupSlots(serviceId: string) {
  const supabase = await createClient();
  const [{ data: teams }, { data: roles }, { data: existing }] = await Promise.all([
    supabase.from("teams").select("id"),
    supabase.from("roles").select("id, team_id"),
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
      .filter((role) => role.team_id === null || role.team_id === team.id)
      .filter((role) => !existingKeys.has(`${team.id}_${role.id}`))
      .map((role) => ({ service_id: serviceId, team_id: team.id, role_id: role.id }))
  );

  if (missing.length > 0) {
    await supabase.from("service_lineup_assignments").insert(missing);
  }
}

const INSTRUMENTS_FOR_ROLES = [
  "Musical Director",
  "Vocals",
  "Acoustic Guitar",
  "Electric Guitar",
  "Keyboard",
  "Bass Guitar",
  "Drums",
];

// Adds another role for an instrument, scoped to one team. The first time a
// second role is added for a previously-singular instrument (e.g. "Drums"),
// the original role is renumbered to "Drums 1" so the new one can be
// "Drums 2". Vocals is already numbered from the seed data, so it just gets
// the next number.
export async function addRole(instrument: string, teamId: string) {
  if (!INSTRUMENTS_FOR_ROLES.includes(instrument) || !teamId) return;

  const supabase = await createClient();
  const { data: existingRoles } = await supabase
    .from("roles")
    .select("id, name, sort_order")
    .eq("instrument", instrument)
    .order("sort_order");

  const rows = existingRoles ?? [];
  const numberedPattern = new RegExp(`^${instrument.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} (\\d+)$`);
  const numbers = rows
    .map((r) => {
      const m = r.name.match(numberedPattern);
      return m ? Number(m[1]) : null;
    })
    .filter((n): n is number => n !== null);

  if (rows.length === 1 && numbers.length === 0) {
    await supabase.from("roles").update({ name: `${instrument} 1` }).eq("id", rows[0].id);
    numbers.push(1);
  }

  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  const maxSortOrder = rows.reduce((max, r) => Math.max(max, r.sort_order), -1);

  await supabase.from("roles").insert({
    name: `${instrument} ${nextNumber}`,
    instrument,
    team_id: teamId,
    sort_order: maxSortOrder + 1,
  });

  revalidatePath("/", "layout");
}

const INSTRUMENTS = [
  "Electric Guitar",
  "Acoustic Guitar",
  "Drums",
  "Bass Guitar",
  "Keyboard",
  "Vocals",
  "Musical Director",
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

export async function updateVolunteer(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const nickname = String(formData.get("nickname") ?? "").trim();
  const instruments = formData
    .getAll("instruments")
    .map(String)
    .filter((i) => INSTRUMENTS.includes(i));

  const supabase = await createClient();
  await supabase
    .from("volunteers")
    .update({ name, nickname: nickname || null, instruments })
    .eq("id", id);
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
  revalidatePath("/");
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
  revalidatePath("/services");
  redirect(`/services/${service.id}`);
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/services");
  redirect("/services");
}

export async function archiveService(id: string) {
  const supabase = await createClient();
  await supabase.from("services").update({ archived: true }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/archive");
  revalidatePath(`/services/${id}`);
}

export async function unarchiveService(id: string) {
  const supabase = await createClient();
  await supabase.from("services").update({ archived: false }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/archive");
  revalidatePath(`/services/${id}`);
}

function parseTimeSignature(formData: FormData) {
  const numRaw = String(formData.get("time_signature_numerator") ?? "").trim();
  const denRaw = String(formData.get("time_signature_denominator") ?? "").trim();
  const numerator = numRaw ? Number(numRaw) : 4;
  const denominator = denRaw ? Number(denRaw) : 4;
  return {
    time_signature_numerator: Number.isFinite(numerator) && numerator > 0 ? numerator : 4,
    time_signature_denominator: Number.isFinite(denominator) && denominator > 0 ? denominator : 4,
  };
}

export async function addSong(serviceId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const singerOrBand = String(formData.get("singer_or_band") ?? "").trim();
  const version = String(formData.get("version") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const key = String(formData.get("key") ?? "").trim();
  const altKey = String(formData.get("alt_key") ?? "").trim();
  const anchorId = String(formData.get("anchor_id") ?? "").trim();
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
    alt_key: altKey || null,
    anchor_id: anchorId || null,
    bpm: bpm !== null && !Number.isNaN(bpm) ? bpm : null,
    ...parseTimeSignature(formData),
  });
  revalidatePath(`/services/${serviceId}`);
}

export async function deleteSong(serviceId: string, songId: string) {
  const supabase = await createClient();
  await supabase.from("songs").delete().eq("id", songId);
  revalidatePath(`/services/${serviceId}`);
}

export async function updateSong(serviceId: string, songId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const singerOrBand = String(formData.get("singer_or_band") ?? "").trim();
  const version = String(formData.get("version") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const key = String(formData.get("key") ?? "").trim();
  const altKey = String(formData.get("alt_key") ?? "").trim();
  const anchorId = String(formData.get("anchor_id") ?? "").trim();
  const bpmRaw = String(formData.get("bpm") ?? "").trim();
  const bpm = bpmRaw ? Number(bpmRaw) : null;

  const supabase = await createClient();
  await supabase
    .from("songs")
    .update({
      name,
      singer_or_band: singerOrBand || null,
      version: version || null,
      url: url || null,
      key: key || null,
      alt_key: altKey || null,
      anchor_id: anchorId || null,
      bpm: bpm !== null && !Number.isNaN(bpm) ? bpm : null,
      ...parseTimeSignature(formData),
    })
    .eq("id", songId);
  revalidatePath(`/services/${serviceId}`);
}

export async function reorderSongs(serviceId: string, orderedSongIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedSongIds.map((songId, index) =>
      supabase.from("songs").update({ sort_order: index }).eq("id", songId)
    )
  );
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

export async function updatePlaylist(serviceId: string, playlistId: string, formData: FormData) {
  const url = String(formData.get("url") ?? "").trim();
  if (!url) return;

  const supabase = await createClient();
  await supabase.from("playlists").update({ url }).eq("id", playlistId);
  revalidatePath(`/services/${serviceId}`);
}

export async function deletePlaylist(serviceId: string, playlistId: string) {
  const supabase = await createClient();
  await supabase.from("playlists").delete().eq("id", playlistId);
  revalidatePath(`/services/${serviceId}`);
}
