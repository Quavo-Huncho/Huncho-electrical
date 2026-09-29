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
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg hover:scale-110 transition"
    >
      <FaWhatsapp />
    </a>
  );
}