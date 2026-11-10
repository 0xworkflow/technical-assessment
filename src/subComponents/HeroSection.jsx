import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[70vh] items-end overflow-hidden rounded-hero bg-slate-950 px-5 py-12 text-white shadow-card md:min-h-[78vh] md:px-12 md:py-16"
    >
      <img
        src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=2000&q=80"
        alt="Luxury skyline at night"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-65"
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.26),transparent_38%),radial-gradient(circle_at_18%_78%,rgba(245,158,11,0.16),transparent_36%),radial-gradient(circle_at_88%_72%,rgba(244,63,94,0.14),transparent_35%),linear-gradient(125deg,rgba(8,8,8,0.88),rgba(12,12,12,0.72))]" />

      <div className="pointer-events-none absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl motion-safe:animate-pulse" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-rose-300/20 blur-3xl motion-safe:animate-pulse" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] items-end gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-4 inline-flex rounded-pill border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 backdrop-blur">
            Bespoke stays
          </p>
          <h1 id="hero-heading" className="max-w-3xl font-display text-[2.7rem] leading-[0.95] text-slate-50 md:text-[5.4rem]">
            Be Our Guest
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85 md:text-lg">
            Live like royalty in our handpicked villas. Discover peaceful escapes, premium amenities,
            and stays crafted for unforgettable moments.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/villas"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-slate-900 hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Explore Villas
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Talk to us
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: "240+", label: "Elite Villas" },
              { value: "4.9/5", label: "Guest Rating" },
              { value: "38", label: "Destinations" },
              { value: "24/7", label: "Concierge" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur"
              >
                <p className="font-display text-2xl leading-none text-white">{item.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-200">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-200">Trending now</p>
            <h2 className="mt-2 font-display text-[2rem] leading-none">Nightline Penthouse</h2>
            <p className="mt-3 text-sm leading-6 text-slate-100/90">
              Skyline views, private rooftop pool, smart-home controls, and a dedicated butler for premium stays.
            </p>
            <Link
              to="/villas"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-semibold text-slate-900 hover:bg-slate-100"
            >
              View Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
