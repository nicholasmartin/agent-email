"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Define the schema for prompt template validation
const promptTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  template: z.string().min(1, "Template is required"),
  tone: z.string().min(1, "Tone is required"),
  style: z.string().min(1, "Style is required"),
  max_length: z.number().min(10, "Minimum length is 10 characters").max(5000, "Maximum length is 5000 characters"),
});

// Define the types for prompt templates
export type PromptTemplate = {
  id: string;
  company_id: string;
  name: string;
  template: string;
  tone: string;
  style: string;
  max_length: number;
  created_at: string;
  updated_at: string;
  active: boolean;
  is_default: boolean;
};

export type PromptTemplateFormData = {
  name: string;
  template: string;
  tone: string;
  style: string;
  max_length: number;
};

// Get all prompt templates for the current user's company
export async function getPromptTemplates() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get the user's company directly from the companies table
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  if (companyError) {
    console.error("Error fetching company:", companyError);
    return [];
  }

  if (!company?.id) return [];

  // Get the company's prompt templates
  const { data: promptTemplates, error } = await supabase
    .from("prompt_templates")
    .select("*")
    .eq("company_id", company.id)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching prompt templates:", error);
    return [];
  }

  return promptTemplates as PromptTemplate[];
}

// Create a new prompt template
export async function createPromptTemplate(formData: PromptTemplateFormData) {
  console.log("Starting createPromptTemplate with formData:", formData);
  
  try {
    const supabase = await createClient();
    console.log("Supabase client created");
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Current user:", user?.id);
    
    if (!user) {
      console.log("No authenticated user found");
      return { error: "Not authenticated" };
    }

    // Get the user's company directly from the companies table
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .eq("active", true)
      .single();
      
    if (companyError) {
      console.error("Error fetching company:", companyError);
      return { error: "Failed to fetch user company" };
    }
    
    console.log("User company:", company);

    if (!company?.id) {
      console.log("No company found for user");
      return { error: "Company not found" };
    }

    // Validate the form data
    try {
      promptTemplateSchema.parse(formData);
      console.log("Form data validated successfully");
    } catch (error) {
      console.error("Form validation error:", error);
      return { error: "Invalid form data" };
    }

    // Check if this is the first prompt template for the company
    const { count, error: countError } = await supabase
      .from("prompt_templates")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company.id)
      .eq("active", true);
      
    if (countError) {
      console.error("Error counting templates:", countError);
      return { error: "Failed to check existing templates" };
    }
    
    console.log("Current template count:", count);
    const isDefault = count === 0;

    // Create the prompt template
    console.log("Inserting new template with data:", {
      company_id: company.id,
      name: formData.name,
      template: formData.template,
      tone: formData.tone,
      style: formData.style,
      max_length: formData.max_length,
      is_default: isDefault,
    });
    
    const { data, error } = await supabase
      .from("prompt_templates")
      .insert({
        company_id: company.id,
        name: formData.name,
        template: formData.template,
        tone: formData.tone,
        style: formData.style,
        max_length: formData.max_length,
        is_default: isDefault,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating prompt template:", error);
      return { error: "Failed to create prompt template: " + error.message };
    }

    console.log("Template created successfully:", data);
    revalidatePath("/dashboard/projects");
    return { data };
  } catch (unexpectedError) {
    console.error("Unexpected error in createPromptTemplate:", unexpectedError);
    return { error: "An unexpected error occurred: " + (unexpectedError instanceof Error ? unexpectedError.message : String(unexpectedError)) };
  }
}

// Update an existing prompt template
export async function updatePromptTemplate(id: string, formData: PromptTemplateFormData) {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Validate the form data
  try {
    promptTemplateSchema.parse(formData);
  } catch (error) {
    return { error: "Invalid form data" };
  }

  // Update the prompt template
  const { data, error } = await supabase
    .from("prompt_templates")
    .update({
      name: formData.name,
      template: formData.template,
      tone: formData.tone,
      style: formData.style,
      max_length: formData.max_length,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating prompt template:", error);
    return { error: "Failed to update prompt template" };
  }

  revalidatePath("/dashboard/projects");
  return { data };
}

// Delete a prompt template
export async function deletePromptTemplate(id: string) {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check if this is the default template
  const { data: template } = await supabase
    .from("prompt_templates")
    .select("is_default")
    .eq("id", id)
    .single();

  if (template?.is_default) {
    return { error: "Cannot delete the default template" };
  }

  // Soft delete the prompt template by setting active to false
  const { error } = await supabase
    .from("prompt_templates")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error deleting prompt template:", error);
    return { error: "Failed to delete prompt template" };
  }

  revalidatePath("/dashboard/projects");
  return { success: true };
}

// Set a prompt template as the default
export async function setDefaultPromptTemplate(id: string) {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get the user's company directly from the companies table
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  if (companyError) {
    console.error("Error fetching company:", companyError);
    return { error: "Failed to fetch user company" };
  }

  if (!company?.id) {
    return { error: "Company not found" };
  }

  // First, set all templates to non-default
  const { error: updateError } = await supabase
    .from("prompt_templates")
    .update({ is_default: false, updated_at: new Date().toISOString() })
    .eq("company_id", company.id);

  if (updateError) {
    console.error("Error updating prompt templates:", updateError);
    return { error: "Failed to update prompt templates" };
  }

  // Then, set the selected template as default
  const { error } = await supabase
    .from("prompt_templates")
    .update({ is_default: true, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error setting default prompt template:", error);
    return { error: "Failed to set default prompt template" };
  }

  revalidatePath("/dashboard/projects");
  return { success: true };
}
