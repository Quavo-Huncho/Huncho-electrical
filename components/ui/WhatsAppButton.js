import { FaWhatsapp } from "react-icons/fa";
import { getSettings } from "@/lib/getSettings";

export default async function WhatsAppButton() {
  const settings = await getSettings();

  const whatsappLink = `https://wa.me/${settings?.whatsapp}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg transition hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse ring animation */}
      <span
        className="absolute -inset-1 animate-[pulse-ring_2s_ease-in-out_infinite] rounded-full bg-green-500/40"
        aria-hidden="true"
      />

      <FaWhatsapp className="relative z-10" />

      {/* Tooltip */}
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
