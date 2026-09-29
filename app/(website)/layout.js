import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function WebsiteLayout({
  children,
}) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <WhatsAppButton />
      <Footer />
    </>
  );
}