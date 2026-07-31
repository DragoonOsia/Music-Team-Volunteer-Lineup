"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addPerson(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = await createClient();
  await supabase.from("people").insert({ name });
  revalidatePath("/people");
}

export async function deletePerson(id: string) {
  const supabase = await createClient();
  await supabase.from("people").delete().eq("id", id);
  revalidatePath("/people");
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

  const { data: roles } = await supabase.from("roles").select("id");
  if (roles && roles.length > 0) {
    await supabase.from("lineup_assignments").insert(
      roles.map((role) => ({ service_id: service.id, role_id: role.id }))
    );
  }

  revalidatePath("/");
  redirect(`/services/${service.id}`);
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/");
  redirect("/");
}

export async function updateAssignment(
  serviceId: string,
  roleId: string,
  personId: string
) {
  const supabase = await createClient();
  await supabase
    .from("lineup_assignments")
    .update({ person_id: personId || null })
    .eq("service_id", serviceId)
    .eq("role_id", roleId);
  revalidatePath(`/services/${serviceId}`);
}
