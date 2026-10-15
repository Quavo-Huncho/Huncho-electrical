import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaBolt,
} from "react-icons/fa";
import { getSettings } from "@/lib/getSettings";

export default async function ContactInfo() {
  const settings = await getSettings();

  return (
    <div>
      <h2 className="text-3xl font-bold">Get In Touch</h2>
      <div className="mt-2 h-1 w-16 rounded-full bg-amber-500" />

      <p className="mt-4 text-slate-600 dark:text-slate-400">
        We&apos;d love to hear about your project. Reach out through any of the channels below.
      </p>

      <div className="mt-10 space-y-4">
        {/* Phone */}
        <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            <FaPhoneAlt className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Phone</h3>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{settings?.phone}</p>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
            <FaWhatsapp className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">WhatsApp</h3>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{settings?.whatsapp}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <FaEnvelope className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Email</h3>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{settings?.email}</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
            <FaMapMarkerAlt className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Address</h3>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{settings?.address}</p>
          </div>
        </div>

        {/* Business Hours */}
        <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
            <FaClock className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Business Hours</h3>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{settings?.business_hours}</p>
          </div>
        </div>
      </div>

      {/* Emergency Support card */}
      <div className="mt-8 rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-6 dark:bg-amber-500/10">
        <div className="flex items-center gap-2">
          <FaBolt className="animate-pulse text-amber-500" />
          <h3 className="font-bold text-xl text-slate-900 dark:text-white">
            Emergency Support
          </h3>
        </div>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Need urgent electrical assistance? Contact our support team for immediate help.
        </p>

        {settings?.phone && (
          <a
            href={`tel:${settings.phone}`}
            className="mt-4 inline-block rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Call Now
          </a>
        )}
      </div>
    </div>
  );
}
