import Hero from "@/components/hero/Hero";
import TrustSection from "@/components/home/TrustSection";
import ServicesSection from "@/components/services/ServicesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import StatsSection from "@/components/home/StatsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustSection />
      <ServicesSection />
      <WhyChooseUs />
      <StatsSection />
      <ProjectsSection />
      <CTASection />
    </main>
  );
}
