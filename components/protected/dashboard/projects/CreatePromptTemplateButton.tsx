"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import PromptTemplateForm from "./PromptTemplateForm";

export default function CreatePromptTemplateButton() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div>
      {!isFormOpen ? (
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          <Plus className="h-5 w-5" />
          New Template
        </button>
      ) : (
        <div className="w-full rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Create New Prompt Template
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-sm font-medium text-danger hover:text-opacity-80"
            >
              Cancel
            </button>
          </div>
          <PromptTemplateForm onSuccess={() => setIsFormOpen(false)} />
        </div>
      )}
    </div>
  );
}
