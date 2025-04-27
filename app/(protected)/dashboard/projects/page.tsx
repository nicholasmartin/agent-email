import { Metadata } from "next";
import { getCompanyData } from "@/app/actions/company";
import { getPromptTemplates } from "@/app/actions/promptTemplates";
import PromptTemplateList from "@/components/protected/dashboard/projects/PromptTemplateList";
import CreatePromptTemplateButton from "@/components/protected/dashboard/projects/CreatePromptTemplateButton";

export const metadata: Metadata = {
  title: "Projects | Agent Email",
  description: "Manage your prompt templates for personalized email generation",
};

export default async function ProjectsPage() {
  const { company, error } = await getCompanyData();
  const promptTemplates = await getPromptTemplates();

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Prompt Templates
        </h2>
        <CreatePromptTemplateButton />
      </div>

      <div className="flex flex-col gap-5 md:gap-7">
        <PromptTemplateList 
          promptTemplates={promptTemplates} 
          companyId={company?.id} 
        />
      </div>
    </>
  );
}
