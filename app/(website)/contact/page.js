import PageHero from "@/components/common/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import { getSettings } from "@/lib/getSettings";

export const metadata = {
  title: "Contact Us | Huncho Electrical",
  description:
    "Get in touch with Huncho Electrical for installations, maintenance, electrical materials, and consultancy services.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero
        badge="Contact Us"
        title={settings?.contact_title}
        description={settings?.contact_description}
      />

      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}