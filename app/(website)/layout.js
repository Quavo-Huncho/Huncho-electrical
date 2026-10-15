import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { MaterialProvider } from "@/context/MaterialRequestContext";

export default function WebsiteLayout({
  children,
}) {
  return (
    <MaterialProvider>
      <Navbar />

      <main>
        {children}
      </main>

      <WhatsAppButton />
      <Footer />
    </MaterialProvider>
  );
}