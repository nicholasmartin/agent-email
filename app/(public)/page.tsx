import { Hero } from "@/components/public/home/Hero";
import { ProblemSolution } from "@/components/public/home/ProblemSolution";
import { HowItWorks } from "@/components/public/home/HowItWorks";
import { SocialProof } from "@/components/public/home/SocialProof";
import { Testimonials } from "@/components/public/home/Testimonials";
import { Pricing } from "@/components/public/home/Pricing";
import { FAQ } from "@/components/public/home/FAQ";
import { CTASection } from "@/components/public/home/CTASection";

export default function HomePage() {
  return (
    <>
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
