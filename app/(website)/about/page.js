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

          <div className="flex items-center justify-center rounded-3xl bg-slate-100 p-10 dark:bg-slate-800">
            <FaBolt className="text-8xl text-amber-500" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 py-24 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900">
              <FaBullseye className="mb-4 text-4xl text-amber-500" />

              <h3 className="mb-4 text-2xl font-bold">
                Our Mission
              </h3>

              <p className="text-slate-600 dark:text-slate-400">
                To deliver reliable, innovative, and safe electrical
                solutions that exceed customer expectations while
                maintaining the highest standards of professionalism.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900">
              <FaEye className="mb-4 text-4xl text-amber-500" />

              <h3 className="mb-4 text-2xl font-bold">
                Our Vision
              </h3>

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
            <h2 className="text-4xl font-bold">
              Our Core Values
            </h2>

            <p className="mt-4 text-slate-500">
              Principles that guide everything we do.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border p-8">
              <FaShieldAlt className="mb-4 text-4xl text-amber-500" />
              <h3 className="mb-3 text-xl font-bold">Safety</h3>
              <p className="text-slate-500">
                We prioritize safety in every project and operation.
              </p>
            </div>

            <div className="rounded-2xl border p-8">
              <FaAward className="mb-4 text-4xl text-amber-500" />
              <h3 className="mb-3 text-xl font-bold">Excellence</h3>
              <p className="text-slate-500">
                We strive for the highest quality standards.
              </p>
            </div>

            <div className="rounded-2xl border p-8">
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
      <section className="bg-amber-500 py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold">
            Ready to Work With Us?
          </h2>

          <p className="mt-6 text-lg">
            Whether it's an installation, maintenance project,
            or electrical consultation, we're ready to help.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-4 font-semibold text-amber-500"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </>
  );
}