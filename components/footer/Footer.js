import Link from "next/link";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaBolt,
  FaArrowRight,
} from "react-icons/fa";
import { getSettings } from "@/lib/getSettings";

const quickLinks = [
  { label: "Home",      href: "/" },
  { label: "About",     href: "/about" },
  { label: "Services",  href: "/services" },
  { label: "Projects",  href: "/projects" },
  { label: "Materials", href: "/materials" },
  { label: "Contact",   href: "/contact" },
];

const services = [
  "Electrical Installations",
  "Electrical Maintenance",
  "Solar Installation",
  "Industrial Wiring",
  "Material Supply",
  "Consultancy",
];

export default async function Footer() {
  const settings = await getSettings();

  const socials = [
    { href: settings?.facebook,  icon: FaFacebookF,  label: "Facebook" },
    { href: settings?.x,         icon: FaTwitter,    label: "X (Twitter)" },
    { href: settings?.instagram, icon: FaInstagram,  label: "Instagram" },
    { href: settings?.linkedin,  icon: FaLinkedinIn, label: "LinkedIn" },
  ].filter((s) => s.href);

  const year = new Date().getFullYear();
  const companyName = settings?.company_name || "Huncho Electrical";

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">

      {/* ── Decorative ambient glow ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-500/8 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-amber-600/6 blur-3xl"
      />

      {/* ══════════════════════════════════════════
          TOP CTA STRIP
      ══════════════════════════════════════════ */}
      <div className="relative border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                Ready to get started?
              </p>
              <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                Need professional electrical services?
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex flex-none items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600 hover:shadow-amber-500/40"
            >
              Get a free quote
              <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN GRID
      ══════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* ── Col 1: Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo mark */}
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 shadow-lg shadow-amber-500/30">
                <FaBolt className="h-5 w-5 text-white" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                {companyName}
              </span>
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-slate-400">
              Reliable electrical installations, maintenance and material
              supply for homes, businesses and industries across Nigeria.
            </p>

            {/* Socials */}
            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 text-slate-400 transition hover:border-amber-500 hover:bg-amber-500 hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}

            {/* WhatsApp shortcut */}
            {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-800/60 bg-emerald-950/40 px-4 py-2.5 text-xs font-semibold text-emerald-400 transition hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
              >
                <FaWhatsapp className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            )}
          </div>

          {/* ── Col 2: Quick Links ── */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-slate-200">
              Quick links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-amber-400"
                  >
                    <span className="h-px w-3 flex-none bg-slate-700 transition group-hover:w-4 group-hover:bg-amber-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Services ── */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-slate-200">
              Our services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-amber-400"
                  >
                    <span className="h-px w-3 flex-none bg-slate-700 transition group-hover:w-4 group-hover:bg-amber-500" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Contact ── */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-slate-200">
              Get in touch
            </h3>
            <ul className="space-y-4 text-sm text-slate-400">
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="group flex items-start gap-3 transition hover:text-amber-400"
                  >
                    <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-slate-800 text-amber-500 transition group-hover:bg-amber-500 group-hover:text-white">
                      <FaEnvelope className="h-3 w-3" />
                    </span>
                    <span className="break-all leading-relaxed">{settings.email}</span>
                  </a>
                </li>
              )}

              {settings?.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    className="group flex items-start gap-3 transition hover:text-amber-400"
                  >
                    <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-slate-800 text-amber-500 transition group-hover:bg-amber-500 group-hover:text-white">
                      <FaPhoneAlt className="h-3 w-3" />
                    </span>
                    <span className="leading-relaxed">{settings.phone}</span>
                  </a>
                </li>
              )}

              {settings?.address && (
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-slate-800 text-amber-500">
                    <FaMapMarkerAlt className="h-3 w-3" />
                  </span>
                  <span className="leading-relaxed">{settings.address}</span>
                </li>
              )}

              {settings?.business_hours && (
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-slate-800 text-amber-500">
                    <FaClock className="h-3 w-3" />
                  </span>
                  <span className="leading-relaxed">{settings.business_hours}</span>
                </li>
              )}
            </ul>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════
          BOTTOM BAR
      ══════════════════════════════════════════ */}
      <div className="relative border-t border-slate-800">
        {/* Amber fade rule */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

        <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year}{" "}
              <span className="text-slate-400">{companyName}</span>.
              {" "}All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <span>Licensed &amp; insured electrical contractors</span>
              <Link href="/contact" className="text-amber-500/80 transition hover:text-amber-400">
                Get a quote →
              </Link>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
