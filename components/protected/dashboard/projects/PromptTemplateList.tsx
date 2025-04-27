"use client";

import React, { useState } from "react";
import { PromptTemplate, deletePromptTemplate, setDefaultPromptTemplate } from "@/app/actions/promptTemplates";
import { toast } from "sonner";
import PromptTemplateForm from "@/components/protected/dashboard/projects/PromptTemplateForm";
import { Trash2, Edit, Star, StarOff } from "lucide-react";

interface PromptTemplateListProps {
  promptTemplates: PromptTemplate[];
  companyId?: string;
}

export default function PromptTemplateList({ promptTemplates, companyId }: PromptTemplateListProps) {
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSettingDefault, setIsSettingDefault] = useState<string | null>(null);

  if (!promptTemplates || promptTemplates.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-60 flex-col items-center justify-center">
          <p className="text-lg font-medium text-black dark:text-white">
            No prompt templates found
          </p>
          <p className="mt-1 text-sm text-body">
            Create your first prompt template to get started
          </p>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const result = await deletePromptTemplate(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Prompt template deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete prompt template");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setIsSettingDefault(id);
    try {
      const result = await setDefaultPromptTemplate(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Default prompt template updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update default prompt template");
    } finally {
      setIsSettingDefault(null);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      {editingTemplate && (
        <div className="mb-8 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Edit Prompt Template
            </h3>
            <button
              type="button"
              onClick={() => setEditingTemplate(null)}
              className="text-sm font-medium text-danger hover:text-opacity-80"
            >
              Cancel
            </button>
          </div>
          <PromptTemplateForm
            initialData={editingTemplate}
            onSuccess={() => setEditingTemplate(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {promptTemplates.map((template) => (
          <div
            key={template.id}
            className="rounded-sm border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {template.name}
                </h3>
                {template.is_default && (
                  <span className="ml-2 rounded bg-success bg-opacity-10 px-2 py-1 text-xs font-medium text-success">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleSetDefault(template.id)}
                  disabled={template.is_default || isSettingDefault !== null}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-meta-4 ${
                    template.is_default ? "text-warning" : "text-body"
                  }`}
                >
                  {template.is_default ? (
                    <Star className="h-5 w-5 fill-warning stroke-warning" />
                  ) : isSettingDefault === template.id ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  ) : (
                    <StarOff className="h-5 w-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTemplate(template)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded text-body hover:bg-gray-100 hover:text-primary dark:hover:bg-meta-4"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(template.id)}
                  disabled={template.is_default || isDeleting !== null}
                  className="inline-flex h-9 w-9 items-center justify-center rounded text-body hover:bg-gray-100 hover:text-danger dark:hover:bg-meta-4"
                >
                  {isDeleting === template.id ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-black dark:text-white">Tone</p>
                <p className="text-sm text-body">{template.tone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-black dark:text-white">Style</p>
                <p className="text-sm text-body">{template.style}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-black dark:text-white">Max Length</p>
                <p className="text-sm text-body">{template.max_length} characters</p>
              </div>
              <div>
                <p className="text-sm font-medium text-black dark:text-white">Created</p>
                <p className="text-sm text-body">
                  {new Date(template.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium text-black dark:text-white">Template</p>
              <div className="mt-1 max-h-40 overflow-y-auto rounded-sm border border-stroke bg-gray-50 p-2 dark:border-strokedark dark:bg-meta-4">
                <pre className="text-sm text-body whitespace-pre-wrap">{template.template}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
