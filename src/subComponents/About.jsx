import React from "react";

const About = () => {
  return (
    <section aria-labelledby="about-mini-heading" className="grid grid-cols-1 gap-6 rounded-card border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-surface-900 md:grid-cols-2 md:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">About us</p>
        <h2 id="about-mini-heading" className="mt-3 font-display text-[2.5rem] leading-none md:text-[3.2rem]">
          Curating exceptional homes for every season
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
          <p>Each property is hand-verified to ensure design quality, safety, and comfort.</p>
          <p>From weekend retreats to long seasonal stays, we match guests with spaces that fit their rhythm.</p>
          <p>Our operations team supports hosts and guests with rapid responses and local insights.</p>
        </div>
        <p className="mt-5 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-900 dark:border-brand-800/50 dark:bg-brand-900/30 dark:text-brand-100">
          We strive to offer you the best possible homes to stay in.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 [perspective:1400px]">
        <div className="group/hero relative col-span-2 overflow-hidden rounded-xl border border-slate-200 shadow-soft transition-all duration-500 hover:shadow-card dark:border-slate-700">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-indigo-500/0 via-cyan-400/0 to-sky-500/0 opacity-0 transition duration-500 group-hover/hero:opacity-100 group-hover/hero:from-indigo-500/20 group-hover/hero:via-cyan-400/10 group-hover/hero:to-sky-500/20" />
          <div className="aspect-[16/9]">
            <img
              src="https://plus.unsplash.com/premium_photo-1680300960730-53159ead37da?w=1000&q=80"
              alt="Guests enjoying a villa courtyard"
              className="h-full w-full transform-gpu object-cover transition duration-700 ease-out group-hover/hero:scale-[1.08] group-hover/hero:[transform:translateZ(90px)_rotateX(3deg)]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div className="group/card overflow-hidden rounded-xl border border-slate-200 transition-all duration-500 hover:-translate-y-1 hover:shadow-card dark:border-slate-700">
          <div className="aspect-square">
            <img
              src="/people.jpg"
              alt="Host and guests"
              className="h-full w-full transform-gpu object-cover transition duration-700 group-hover/card:scale-110"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div className="group/card overflow-hidden rounded-xl border border-slate-200 transition-all duration-500 hover:-translate-y-1 hover:shadow-card dark:border-slate-700">
          <div className="aspect-square">
            <img
              src="/people2.jpg"
              alt="Property team at work"
              className="h-full w-full transform-gpu object-cover transition duration-700 group-hover/card:scale-110"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

