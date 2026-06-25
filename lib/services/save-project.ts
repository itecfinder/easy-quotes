import { supabase } from "@/lib/supabase"

export async function saveProject(project: any, email: string, access = "lead") {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      member_email: email,
      access_level: access,

      customer_name: project.customer?.name || "",
      customer_email: project.customer?.email || "",
      customer_phone: project.customer?.phone || "",
      customer_address: project.customer?.address || "",
      customer_zip: project.customer?.zip || "",

      project_type: project.type || null,
      notes: project.notes || "",

      status: project.status || "draft",

      estimate: project.estimate || {},
      line_items: project.lineItems || [],

      total: project.total || 0,
    })
    .select()
    .single()

  if (error) throw error

  return data
}
