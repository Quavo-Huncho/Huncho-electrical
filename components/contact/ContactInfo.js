import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
} from "react-icons/fa";
import { getSettings } from "@/lib/getSettings";

export default async function ContactInfo() {
  const settings = await getSettings();

  return (
    <div>
      <h2 className="text-3xl font-bold">
        Get In Touch
      </h2>

      <p className="mt-4 text-slate-600 dark:text-slate-400">
        We'd love to hear about your project. Reach out through any of the channels below.
      </p>

      <div className="mt-10 space-y-6">
        <div className="flex gap-4">
          <FaPhoneAlt className="mt-1 text-amber-500" />
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p>{settings?.phone}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <FaWhatsapp className="mt-1 text-green-500" />
          <div>
            <h3 className="font-semibold">WhatsApp</h3>
            <p>{settings?.whatsapp}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <FaEnvelope className="mt-1 text-amber-500" />
          <div>
            <h3 className="font-semibold">Email</h3>
            <p>{settings?.email}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <FaMapMarkerAlt className="mt-1 text-amber-500" />
          <div>
            <h3 className="font-semibold">Address</h3>
            <p>{settings?.address}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <FaClock className="mt-1 text-amber-500" />
          <div>
            <h3 className="font-semibold">Business Hours</h3>
            <p>{settings?.business_hours}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-2xl bg-slate-100 p-8 dark:bg-slate-800">
        <h3 className="font-bold text-xl">
          Emergency Support
        </h3>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Need urgent electrical assistance? Contact our support team for immediate help.
        </p>
      </div>
    </div>
  );
}