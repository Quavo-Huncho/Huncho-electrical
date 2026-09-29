import { getSettings } from "@/lib/getSettings";

export default async function Footer() {
  const settings = await  getSettings();

  return (
    <footer className="bg-slate-950 text-white dark:bg-slate-950/95">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mt-4 text-slate-400 dark:text-slate-500">
          {settings?.company_name}
        </h1>

        <p className="mt-4 text-slate-400 dark:text-slate-500">
          Reliable electrical installations,
          maintenance and material supply.
        </p>
        <p className="mt-4 text-slate-400 dark:text-slate-500">
          {settings?.email}
        </p>
        <p className="mt-4 text-slate-400 dark:text-slate-500">
          {settings?.phone}
        </p>
        <p className="mt-4 text-slate-400 dark:text-slate-500">
          {settings?.address}
        </p>
        <p className="mt-4 text-slate-400 dark:text-slate-500">
          {settings?.business_hours}
        </p>
        <div className="mt-8 border-t border-slate-800 pt-6 text-slate-500 dark:text-slate-400">
          © 2026 Huncho Electrical. All rights reserved.
        </div>
      </div>
    </footer>
  );
}