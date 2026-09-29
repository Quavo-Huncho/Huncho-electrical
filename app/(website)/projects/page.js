import PageHero from "@/components/common/PageHero";
import SectionHeader from "@/components/common/SectionHeader";
import CTASection from "@/components/common/CTASection";
import ProjectCard from "@/components/projects/ProjectCard";
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

      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Featured Projects"
            description="Examples of our recent work and successful project deliveries."
          />

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button className="rounded-full bg-amber-500 px-5 py-2 text-white">
              All
            </button>

            <button className="rounded-full border px-5 py-2">
              Residential
            </button>

            <button className="rounded-full border px-5 py-2">
              Commercial
            </button>

            <button className="rounded-full border px-5 py-2">
              Industrial
            </button>

            <button className="rounded-full border px-5 py-2">
              Solar
            </button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects?.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
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