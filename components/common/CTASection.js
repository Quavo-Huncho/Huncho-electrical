import Link from "next/link";

export default function CTASection({
  title,
  description,
  buttonText = "Contact Us",
  buttonLink = "/contact",
  secondaryText,
  secondaryLink,
}) {
  return (
    <section className="relative overflow-hidden bg-amber-500 py-24 text-white">
      {/* Decorative circuit-lines overlay */}
      <svg
        className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/3 opacity-[0.12] md:block"
        viewBox="0 0 300 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M260 0V80H140v90h100v80H60v150"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="M300 60H200v60H100v80h120v60H80"
          stroke="white"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle cx="140" cy="80" r="4" fill="white" />
        <circle cx="240" cy="170" r="4" fill="white" />
        <circle cx="60" cy="250" r="4" fill="white" />
        <circle cx="180" cy="330" r="3" fill="white" />
      </svg>

      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 30% 50%, rgb(255 255 255 / 0.1) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-4xl font-bold">
          {title}
        </h2>

        <p className="mt-6 text-lg">
          {description}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={buttonLink}
            className="inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-amber-500 transition hover:scale-[1.02] hover:shadow-lg"
          >
            {buttonText}
          </Link>

          {secondaryText && secondaryLink && (
            <Link
              href={secondaryLink}
              className="inline-block rounded-lg border-2 border-white bg-transparent px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              {secondaryText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
