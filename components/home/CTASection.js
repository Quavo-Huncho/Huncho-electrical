import Link from "next/link";
import { FaArrowRight, FaPhoneAlt, FaBolt } from "react-icons/fa";
import { getSettings } from "@/lib/getSettings";

export default async function CTASection() {
  const settings = await getSettings();

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-24">
      {/* Left SVG circuit decoration */}
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
        <path
          d="M0 200h80v-60h100v60h80"
          stroke="#F59E0B"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          d="M20 340h60v-40h140v-80"
          stroke="#F59E0B"
          strokeWidth="0.8"
          strokeDasharray="3 5"
        />
        <circle cx="40" cy="280" r="4" fill="#F59E0B" />
        <circle cx="160" cy="190" r="4" fill="#F59E0B" />
        <circle cx="220" cy="90" r="4" fill="#F59E0B" />
        <circle cx="80" cy="200" r="3" fill="#F59E0B" />
        <circle cx="180" cy="200" r="3" fill="#F59E0B" />
        <circle cx="80" cy="340" r="3" fill="#F59E0B" />
      </svg>

      {/* Right SVG circuit decoration (mirrored) */}
      <svg
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden h-full w-1/3 opacity-[0.06] md:block"
        viewBox="0 0 300 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M260 0v120H140v90h100v80H60v110"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />
        <path
          d="M300 150h-80v60H100v-60H20"
          stroke="#F59E0B"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle cx="260" cy="120" r="4" fill="#F59E0B" />
        <circle cx="140" cy="210" r="4" fill="#F59E0B" />
        <circle cx="240" cy="300" r="4" fill="#F59E0B" />
        <circle cx="220" cy="150" r="3" fill="#F59E0B" />
        <circle cx="120" cy="210" r="3" fill="#F59E0B" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
              Ready to get started?
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Need professional electrical services?
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
              Tell us about your project and we&apos;ll put together the right
              electrical solution for it.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Request a quote
                <FaArrowRight className="h-3.5 w-3.5" />
              </Link>

              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  <FaPhoneAlt className="h-3.5 w-3.5" />
                  Call {settings.phone}
                </a>
              )}
            </div>
          </div>

          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-amber-500/10 ring-4 ring-amber-500/20 shadow-[0_0_40px_0_rgb(245_158_11_/0.25)]">
              <FaBolt className="h-14 w-14 text-amber-400 drop-shadow-[0_0_12px_rgb(245_158_11_/0.6)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
