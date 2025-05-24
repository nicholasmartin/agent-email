"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PromptTemplate, createPromptTemplate, updatePromptTemplate } from "@/app/actions/promptTemplates";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  template: z.string().min(1, "Template is required"),
  tone: z.string().min(1, "Tone is required"),
  style: z.string().min(1, "Style is required"),
  max_length: z.coerce.number().min(10, "Minimum length is 10 characters").max(5000, "Maximum length is 5000 characters"),
});

type FormData = z.infer<typeof formSchema>;

// Define the tone and style options
const toneOptions = [
  { value: "conversational", label: "Conversational" },
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "formal", label: "Formal" },
];

const styleOptions = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "persuasive", label: "Persuasive" },
  { value: "informative", label: "Informative" },
  { value: "concise", label: "Concise" },
];

interface PromptTemplateFormProps {
  initialData?: PromptTemplate;
  onSuccess?: () => void;
}

export default function PromptTemplateForm({ initialData, onSuccess }: PromptTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      template: initialData.template,
      tone: initialData.tone,
      style: initialData.style,
      max_length: initialData.max_length,
    } : {
      name: "",
      template: "",
      tone: "conversational",
      style: "formal",
      max_length: 500,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        // Update existing template
        const result = await updatePromptTemplate(initialData.id, data);
        if (result.error) {
          console.error("Error updating template:", result.error);
          toast.error(result.error);
        } else {
          toast.success("Prompt template updated successfully");
          onSuccess?.();
        }
      } else {
        // Create new template
        console.log("Submitting form data:", data);
        try {
          const result = await createPromptTemplate(data);
          console.log("Create template result:", result);
          
          if (result.error) {
            console.error("Error from server:", result.error);
            toast.error(result.error);
          } else {
            toast.success("Prompt template created successfully");
            reset();
            onSuccess?.();
          }
        } catch (submitError) {
          console.error("Error during createPromptTemplate call:", submitError);
          toast.error("Error creating template: " + (submitError instanceof Error ? submitError.message : String(submitError)));
        }
      }
    } catch (error) {
      console.error("Unexpected error in form submission:", error);
      toast.error("Failed to save prompt template: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-2.5 block font-medium text-black dark:text-white">
          Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="Template name"
          {...register("name")}
          className="w-full rounded-sm border border-stroke bg-white px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="tone" className="mb-2.5 block font-medium text-black dark:text-white">
            Tone
          </label>
          <select
            id="tone"
            {...register("tone")}
            className="w-full rounded-sm border border-stroke bg-white px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            {toneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.tone && (
            <p className="mt-1 text-xs text-danger">{errors.tone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="style" className="mb-2.5 block font-medium text-black dark:text-white">
            Style
          </label>
          <select
            id="style"
            {...register("style")}
            className="w-full rounded-sm border border-stroke bg-white px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            {styleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.style && (
            <p className="mt-1 text-xs text-danger">{errors.style.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="max_length" className="mb-2.5 block font-medium text-black dark:text-white">
            Max Length (characters)
          </label>
          <input
            type="number"
            id="max_length"
            placeholder="500"
            {...register("max_length")}
            className="w-full rounded-sm border border-stroke bg-white px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
          />
          {errors.max_length && (
            <p className="mt-1 text-xs text-danger">{errors.max_length.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="template" className="mb-2.5 block font-medium text-black dark:text-white">
          Template
        </label>
        <div className="mb-2 text-xs text-body">
          Use double curly braces for variables: &#123;&#123;variable&#125;&#125;. Available variables: &#123;&#123;firstName&#125;&#125;, &#123;&#123;lastName&#125;&#125;, &#123;&#123;companyName&#125;&#125;, &#123;&#123;companyDescription&#125;&#125;, &#123;&#123;companyValues&#125;&#125;, &#123;&#123;companyProducts&#125;&#125;
        </div>
        <textarea
          id="template"
          rows={8}
          placeholder="Enter your prompt template here..."
          {...register("template")}
          className="w-full rounded-sm border border-stroke bg-white px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
        ></textarea>
        {errors.template && (
          <p className="mt-1 text-xs text-danger">{errors.template.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-sm bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:bg-blue-500 shadow-md border border-blue-700 font-medium"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {initialData ? "Updating..." : "Creating..."}
            </>
          ) : (
            initialData ? "Update Template" : "Create Template"
          )}
        </button>
      </div>
    </form>
  );
}
