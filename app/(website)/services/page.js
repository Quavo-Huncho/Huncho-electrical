import Link from "next/link";
import {
  FaBolt,
  FaTools,
  FaSolarPanel,
  FaBuilding,
  FaClipboardCheck,
  FaLightbulb,
} from "react-icons/fa";
import PageHero from "@/components/common/PageHero";

export const metadata = {
  title: "Services | Huncho Electrical",
  description:
    "Professional electrical installations, maintenance, material supply, industrial wiring, solar solutions, and consultancy services.",
};

export default function ServicesPage() {
  const services = [
    {
      icon: <FaBolt />,
      title: "Electrical Installations",
      description:
        "Complete residential, commercial, and industrial electrical installation services.",
    },
    {
      icon: <FaTools />,
      title: "Electrical Maintenance",
      description:
        "Preventive and corrective maintenance to ensure reliability and safety.",
    },
    {
      icon: <FaLightbulb />,
      title: "Electrical Material Supply",
      description:
        "Supply of quality cables, switches, panels, lighting, and accessories.",
    },
    {
      icon: <FaSolarPanel />,
      title: "Solar Installation",
      description:
        "Design and installation of efficient solar energy systems.",
    },
    {
      icon: <FaBuilding />,
      title: "Industrial Wiring",
      description:
        "Professional industrial wiring and power distribution systems.",
    },
    {
      icon: <FaClipboardCheck />,
      title: "Electrical Consultancy",
      description:
        "Technical inspections, audits, planning, and project advisory services.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <PageHero
        badge="Our Services"
        title="Comprehensive Electrical Solutions"
        description="We deliver reliable electrical services for homes, businesses, commercial facilities, and industrial operations."
      />

      {/* Services Grid */}
      <section className="bg-white py-24 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-3xl border p-8 transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-5 text-4xl text-amber-500">
                  {service.icon}
                </div>

                <h3 className="mb-4 text-2xl font-bold">
                  {service.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-50 py-24 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold">
              How We Work
            </h2>

            <p className="mt-4 text-slate-500">
              A simple process designed for efficiency and transparency.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Consultation",
              "Site Assessment",
              "Project Execution",
              "Quality Assurance",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-slate-900"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white font-bold">
                  {index + 1}
                </div>

                <h3 className="font-bold text-xl">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Clients Choose Us */}
      <section className="bg-white py-24 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold">
            Why Clients Choose Us
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border p-15 sm:p-10 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="mb-3 text-2xl font-bold">
                Experienced Professionals
              </h3>

              <p className="text-slate-500">
                Skilled technicians with practical industry experience.
              </p>
            </div>

            <div className="rounded-2xl border p-15 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="mb-3 text-2xl font-bold">
                Quality Materials
              </h3>

              <p className="text-slate-500">
                We use trusted and durable electrical products.
              </p>
            </div>

            <div className="rounded-2xl border p-15 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="mb-3 text-2xl font-bold">
                Safety Compliance
              </h3>

              <p className="text-slate-500">
                Strict adherence to electrical safety standards.
              </p>
            </div>

            <div className="rounded-2xl border p-15 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="mb-3 text-2xl font-bold">
                Reliable Support
              </h3>

              <p className="text-slate-500">
                Responsive communication and ongoing support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500 py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-bold">
            Need Electrical Services?
          </h2>

          <p className="mt-6 text-lg">
            Let's discuss your project and provide the right solution.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-4 font-semibold text-amber-500 hover:bg-white/70"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}