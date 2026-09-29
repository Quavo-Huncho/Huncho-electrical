import Link from "next/link";

export default function CTASection({
  title,
  description,
  buttonText = "Contact Us",
  buttonLink = "/contact",
}) {
  return (
    <section className="bg-amber-500 py-24 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-4xl font-bold">
          {title}
        </h2>

        <p className="mt-6 text-lg">
          {description}
        </p>

        <Link
          href={buttonLink}
          className="mt-8 inline-block rounded-lg bg-white px-8 py-4 font-semibold text-amber-500 transition hover:scale-105"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}