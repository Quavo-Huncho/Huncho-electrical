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
  FaBolt,
} from "react-icons/fa";
import { getSettings } from "@/lib/getSettings";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export default async function Footer() {
  const settings = await getSettings();

  const socials = [
    { href: settings?.facebook, icon: FaFacebookF, label: "Facebook" },
    { href: settings?.x, icon: FaTwitter, label: "X (Twitter)" },
    { href: settings?.instagram, icon: FaInstagram, label: "Instagram" },
    { href: settings?.linkedin, icon: FaLinkedinIn, label: "LinkedIn" },
  ].filter((social) => social.href);

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                <FaBolt className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold text-white">
                {settings?.company_name || "Huncho Electrical"}
              </span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Reliable electrical installations, maintenance and material
              supply for homes, businesses and industries.
            </p>

            {socials.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition hover:border-amber-500 hover:text-amber-500"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
              Quick links
            </h3>

            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
              Get in touch
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              {settings?.email && (
                <li className="flex items-start gap-2.5">
                  <FaEnvelope className="mt-0.5 h-3.5 w-3.5 flex-none text-amber-500" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="break-all hover:text-amber-400"
                  >
                    {settings.email}
                  </a>
                </li>
              )}

              {settings?.phone && (
                <li className="flex items-start gap-2.5">
                  <FaPhoneAlt className="mt-0.5 h-3.5 w-3.5 flex-none text-amber-500" />
                  <a href={`tel:${settings.phone}`} className="hover:text-amber-400">
                    {settings.phone}
                  </a>
                </li>
              )}

              {settings?.address && (
                <li className="flex items-start gap-2.5">
                  <FaMapMarkerAlt className="mt-0.5 h-3.5 w-3.5 flex-none text-amber-500" />
                  <span>{settings.address}</span>
                </li>
              )}

              {settings?.business_hours && (
                <li className="flex items-start gap-2.5">
                  <FaClock className="mt-0.5 h-3.5 w-3.5 flex-none text-amber-500" />
                  <span>{settings.business_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-900 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings?.company_name || "Huncho Electrical"}. All
            rights reserved.
          </p>
          <p>Licensed &amp; insured electrical contractors.</p>
        </div>
      </div>
    </footer>
  );
}