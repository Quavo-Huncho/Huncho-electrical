import Link from "next/link";
import Image from "next/image";
import { FaBolt, FaArrowRight } from "react-icons/fa";
import { getSettings } from "@/lib/getSettings";

export default async function Hero() {
  const settings = await getSettings();

  return (
    <section className="relative isolate overflow-hidden bg-slate-950">
      {/* Gradient base */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Logo watermark — one element that repositions itself responsively
          (centered/radial-faded on mobile, right-anchored/linear-faded on
          larger screens) instead of two separate hidden/block-toggled divs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 w-full opacity-40 sm:left-auto sm:right-0 sm:w-[60%] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)] sm:[mask-image:linear-gradient(to_left,black_45%,transparent_100%)] sm:[-webkit-mask-image:linear-gradient(to_left,black_45%,transparent_100%)]"
      >
        <Image
          src="/images/huncho_elctrical_logo.png"
          alt=""
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1024px) 55vw, 45vw"
          className="object-contain object-center mix-blend-screen sm:object-right"
        />
      </div>

      {/* Readability overlay — flat and darker on mobile since the mark sits
          centered behind the text; a left-to-right fade once it moves to the
          side on larger screens */}
      <div className="absolute inset-0 -z-10 bg-slate-950/55 sm:hidden" />
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/15 sm:block" />

      <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center px-6 py-24 sm:px-8 md:min-h-[680px] md:py-28 lg:px-12">
        <div className="max-w-2xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400">
            <FaBolt className="h-3.5 w-3.5" />
            Certified electrical contractors
          </span>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            {settings?.hero_title || "Reliable electrical work, done right"}
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            {settings?.hero_description ||
              "From residential wiring to industrial installations, we deliver safe, code-compliant electrical work you can depend on."}
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Get a free quote
              <FaArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-lg border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              View our projects
            </Link>
          </div>

          <p className="mt-8 text-sm text-slate-400">
            Licensed, insured, and available for emergency callouts.
          </p>
        </div>
      </div>
    </section>
  );
}
