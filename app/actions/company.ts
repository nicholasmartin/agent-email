"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface CompanyData {
  id: string;
  name: string;
  slug: string;
  website?: string;
  description?: string;
  logo_url?: string;
  industry?: string;
  size?: string;
  location?: string;
}

export async function updateCompanyAction(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "You must be logged in to update company information" };
    }
    
    // Get the company data from the form
    const name = formData.get("name")?.toString();
    const slug = formData.get("slug")?.toString();
    const website = formData.get("website")?.toString();
    const description = formData.get("description")?.toString();
    const logoUrl = formData.get("logoUrl")?.toString();
    const industry = formData.get("industry")?.toString();
    const size = formData.get("size")?.toString();
    const location = formData.get("location")?.toString();
    
    // Validate required fields
    if (!name || !slug) {
      return { error: "Company name and slug are required" };
    }
    
    // Check if slug is valid (alphanumeric with hyphens)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return { error: "Slug must contain only lowercase letters, numbers, and hyphens" };
    }
    
    // Check if the slug is already taken (excluding the user's own company)
    const { data: existingCompany } = await supabase
      .from("companies")
      .select("id")
      .eq("slug", slug)
      .neq("user_id", user.id)
      .single();
      
    if (existingCompany) {
      return { error: "This slug is already taken. Please choose another one." };
    }
    
    // Get the user's company
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .single();
      
    if (!company) {
      return { error: "Company not found" };
    }
    
    // Update the company - only saving the fields that exist in the database
    const { error } = await supabase
      .from("companies")
      .update({
        name,
        slug,
        website,
        description,
        updated_at: new Date().toISOString()
        // The following fields are not saved to the database yet:
        // logo_url: logoUrl,
        // industry,
        // size,
        // location,
      })
      .eq("id", company.id);
      
    if (error) {
      console.error("Error updating company:", error);
      return { error: "Failed to update company information" };
    }
    
    // Revalidate the page to show updated data
    revalidatePath("/dashboard/settings/account");
    
    return { success: "Company information updated successfully" };
  } catch (error) {
    console.error("Error in updateCompanyAction:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getCompanyData(): Promise<{ company: CompanyData | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { company: null, error: "You must be logged in to view company information" };
    }
    
    // Get the user's company
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .single();
      
    if (error) {
      console.error("Error fetching company:", error);
      return { company: null, error: "Failed to fetch company information" };
    }
    
    return { 
      company: data as CompanyData,
      error: null
    };
  } catch (error) {
    console.error("Error in getCompanyData:", error);
    return { company: null, error: "An unexpected error occurred" };
  }
}
