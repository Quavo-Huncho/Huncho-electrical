import Link from "next/link";

export default function SuccessPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold">
        Request Submitted 🎉
      </h1>

      <p className="mt-4 text-slate-500">
        Thank you for your request.
        Our team will contact you
        shortly with a quotation.
      </p>

      <Link
        href="/materials"
        className="mt-8 inline-block rounded-xl bg-amber-500 px-6 py-3 text-white"
      >
        Back To Materials
      </Link>
    </section>
  );
}