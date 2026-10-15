import PageHero from "@/components/common/PageHero";
import SectionHeader from "@/components/common/SectionHeader";
import CTASection from "@/components/common/CTASection";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import { createClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Projects | Huncho Electrical",
  description:
    "Explore some of our completed electrical installation, maintenance, and solar projects.",
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
  }

  return (
    <>
      <PageHero
        badge="Our Projects"
        title="Delivering Quality Electrical Solutions"
        description="A showcase of selected projects completed by Huncho Electrical across residential, commercial, and industrial sectors."
      />

      <section className="bg-white py-24 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Featured Projects"
            description="Examples of our recent work and successful project deliveries."
          />

          <ProjectsGrid projects={projects ?? []} />
        </div>
      </section>

      <CTASection
        title="Have a Project in Mind?"
        description="Let's discuss your electrical project and deliver a solution tailored to your needs."
        buttonText="Request a Quote"
        buttonLink="/contact"
      />
    </>
  );
}
