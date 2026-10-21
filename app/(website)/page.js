import Hero from "@/components/hero/Hero";
import TrustSection from "@/components/home/TrustSection";
import ServicesSection from "@/components/services/ServicesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import MaterialsSection from "@/components/home/MaterialsSection";
import StatsSection from "@/components/home/StatsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import CTASection from "@/components/home/CTASection";

// Re-fetch materials at most once a minute so new items show up
// without needing a redeploy
export const revalidate = 60;

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustSection />
      <ServicesSection />
      <WhyChooseUs />
      <MaterialsSection />
      <StatsSection />
      <ProjectsSection />
      <CTASection />
    </main>
  );
}