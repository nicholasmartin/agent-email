import { Hero } from "@/components/public/home/Hero";
import { ProblemSolution } from "@/components/public/home/ProblemSolution";
import { HowItWorks } from "@/components/public/home/HowItWorks";
import { SocialProof } from "@/components/public/home/SocialProof";
import { Testimonials } from "@/components/public/home/Testimonials";
import { Pricing } from "@/components/public/home/Pricing";
import { FAQ } from "@/components/public/home/FAQ";
import { CTASection } from "@/components/public/home/CTASection";
import { HomePageSchema } from "@/components/schema/HomePage";
import { Metadata } from "next";

// Define FAQ items for structured data
const faqItems = [
  {
    question: "What is Agent Email?",
    answer: "Agent Email is an AI-powered service that generates personalized welcome emails for B2B and SaaS companies based on research about your leads' businesses."
  },
  {
    question: "How does Agent Email work?",
    answer: "Agent Email analyzes your leads' business domains, extracts relevant information about their company, and uses AI to generate personalized email content that speaks directly to their business needs."
  },
  {
    question: "How do I integrate Agent Email with my existing systems?",
    answer: "Agent Email offers a simple API that can be integrated with your existing lead capture forms, CRM systems, or marketing automation platforms. We also provide a JavaScript snippet for easy integration with your web forms."
  },
  {
    question: "Is Agent Email GDPR compliant?",
    answer: "Yes, Agent Email is designed with privacy in mind and is fully GDPR compliant. We only process the data you provide to generate emails and do not store personal information longer than necessary."
  },
  {
    question: "Can I customize the email templates?",
    answer: "Yes, you can create and customize your own email templates through our dashboard. You can adjust the tone, style, and content focus to match your brand voice."
  }
];

// Get the site URL from environment variables
const siteUrl = process.env.SITE_URL || 'https://agent-email.magloft.com';

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <HomePageSchema siteUrl={siteUrl} faqItems={faqItems} />
      
      {/* Page Content */}
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <SocialProof />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTASection />
    </>
  );
}
