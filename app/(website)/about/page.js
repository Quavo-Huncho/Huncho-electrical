import Link from "next/link";
import {
  FaBolt,
  FaBullseye,
  FaEye,
  FaShieldAlt,
  FaUsers,
  FaAward,
} from "react-icons/fa";
import PageHero from "@/components/common/PageHero";
import CTASection from "@/components/common/CTASection";

export const metadata = {
  title: "About Us | Huncho Electrical",
  description:
    "Learn more about Huncho Electrical, our mission, vision, values, and commitment to delivering reliable electrical solutions.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        badge="About Huncho Electrical"
        title="Delivering Reliable Electrical Solutions With Excellence"
        description="We provide professional electrical installations, maintenance services, and quality electrical materials for residential, commercial, and industrial projects."
      />

      {/* Company Story */}
      <section className="bg-white py-24 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Our Story
            </h2>
            <div className="mt-3 h-1 w-16 rounded-full bg-amber-500" />

            <p className="mt-6 text-slate-600 dark:text-slate-400">
              Huncho Electrical was founded with a commitment to
              providing dependable, safe, and innovative electrical
              solutions. Over the years, we have built a reputation
              for quality workmanship, customer satisfaction, and
              professional service delivery.
            </p>

            <p className="mt-4 text-slate-600 dark:text-slate-400">
              From residential installations to large-scale commercial
              and industrial projects, our team is dedicated to
              ensuring every project meets the highest standards of
              safety, efficiency, and reliability.
            </p>
          </div>

          {/* Richer decorative panel */}
          <div className="relative flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-10">
            {/* Faint grid overlay */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="about-grid"
                  width="32"
                  height="32"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 32 0 L 0 0 0 32"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="0.8"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#about-grid)" />
            </svg>

            {/* Centered bolt icon */}
            <FaBolt className="relative z-10 text-8xl text-amber-400" />

            {/* Stat chips */}
            <span className="absolute left-4 top-4 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow">
              10+ Years
            </span>
            <span className="absolute bottom-4 right-4 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow">
              500+ Projects
            </span>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 py-24 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border-t-4 border-amber-500 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-amber-500/20 dark:bg-slate-900">
              <FaBullseye className="mb-4 text-4xl text-amber-500" />

              <h3 className="mb-4 text-2xl font-bold">Our Mission</h3>

              <p className="text-slate-600 dark:text-slate-400">
                To deliver reliable, innovative, and safe electrical
                solutions that exceed customer expectations while
                maintaining the highest standards of professionalism.
              </p>
            </div>

            <div className="rounded-3xl border-t-4 border-blue-500 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-blue-500/20 dark:bg-slate-900">
              <FaEye className="mb-4 text-4xl text-blue-500" />

              <h3 className="mb-4 text-2xl font-bold">Our Vision</h3>

              <p className="text-slate-600 dark:text-slate-400">
                To become a leading provider of electrical services
                and solutions, recognized for quality, innovation,
                safety, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-24 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold">Our Core Values</h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-amber-500" />
            <p className="mt-5 text-slate-500">
              Principles that guide everything we do.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border p-8 transition hover:-translate-y-1 hover:shadow-lg">
              <FaShieldAlt className="mb-4 text-4xl text-amber-500" />
              <h3 className="mb-3 text-xl font-bold">Safety</h3>
              <p className="text-slate-500">
                We prioritize safety in every project and operation.
              </p>
            </div>

            <div className="rounded-2xl border p-8 transition hover:-translate-y-1 hover:shadow-lg">
              <FaAward className="mb-4 text-4xl text-amber-500" />
              <h3 className="mb-3 text-xl font-bold">Excellence</h3>
              <p className="text-slate-500">
                We strive for the highest quality standards.
              </p>
            </div>

            <div className="rounded-2xl border p-8 transition hover:-translate-y-1 hover:shadow-lg">
              <FaUsers className="mb-4 text-4xl text-amber-500" />
              <h3 className="mb-3 text-xl font-bold">Integrity</h3>
              <p className="text-slate-500">
                Honest communication and trustworthy service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to Work With Us?"
        description="Whether it's an installation, maintenance project, or electrical consultation, we're ready to help."
        buttonText="Contact Us Today"
        buttonLink="/contact"
      />
    </>
  );
}
