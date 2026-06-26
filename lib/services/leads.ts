import { supabase } from "@/lib/supabase"

export async function getLead(email: string) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("email", email.toLowerCase())
    .single()

  if (error) return null

  return data
}

export async function createLead(email: string) {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      email: email.toLowerCase(),
      access: "lead",
      estimate_count: 0,
      free_estimate_used: false,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function consumeFreeEstimate(
  email: string
) {
  const { data, error } = await supabase
    .from("leads")
    .update({
      estimate_count: 1,
      free_estimate_used: true,
      updated_at: new Date().toISOString(),
    })
    .eq("email", email.toLowerCase())
    .select()
    .single()

  if (error) throw error

  return data
}
import { supabase } from "@/lib/supabase"

export async function getLead(email: string) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("email", email.toLowerCase())
    .single()

  if (error) return null

  return data
}

export async function createLead(email: string) {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      email: email.toLowerCase(),
      access: "lead",
      estimate_count: 0,
      free_estimate_used: false,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function consumeFreeEstimate(
  email: string
) {
  const { data, error } = await supabase
    .from("leads")
    .update({
      estimate_count: 1,
      free_estimate_used: true,
      updated_at: new Date().toISOString(),
    })
    .eq("email", email.toLowerCase())
    .select()
    .single()

  if (error) throw error

  return data
}
