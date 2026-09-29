import Link from "next/link";
import { FaArrowRight, FaPhoneAlt } from "react-icons/fa";
import { getSettings } from "@/lib/getSettings";

export default async function CTASection() {
  const settings = await getSettings();

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-24">
      <svg
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden h-full w-1/2 opacity-[0.12] md:block"
        viewBox="0 0 400 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M40 400V280h120v-90H60V90h160V0"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />
        <circle cx="40" cy="280" r="4" fill="#F59E0B" />
        <circle cx="160" cy="190" r="4" fill="#F59E0B" />
        <circle cx="220" cy="90" r="4" fill="#F59E0B" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Need professional electrical services?
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
            Tell us about your project and we&apos;ll put together the right
            electrical solution for it.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Request a quote
              <FaArrowRight className="h-3.5 w-3.5" />
            </Link>

            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <FaPhoneAlt className="h-3.5 w-3.5" />
                Call {settings.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
