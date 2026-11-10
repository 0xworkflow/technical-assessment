import React from "react";
import { Link } from "react-router-dom";

const Host = () => {
  return (
    <section
      aria-labelledby="host-heading"
      className="relative overflow-hidden rounded-hero border border-slate-200 px-pagex py-16 shadow-card dark:border-slate-800 md:px-pagexl md:py-24"
    >
      <img
        src="https://images.unsplash.com/photo-1731068305209-168e99ed4722?w=1400&q=80"
        alt="Luxury villa interior"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-slate-950/45" />
      <div className="relative mx-auto max-w-[1200px]">
        <div className="max-w-xl rounded-card border border-white/25 bg-white/95 p-6 text-slate-900 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Become a host</p>
          <h2 id="host-heading" className="mt-3 font-display text-[2.6rem] leading-none">
            Share your villa with premium guests
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            List your home in minutes and access verified travelers, dynamic pricing guidance, and
            dedicated support from our team.
          </p>
          <Link
            to="/register"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Join Today
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Host;
