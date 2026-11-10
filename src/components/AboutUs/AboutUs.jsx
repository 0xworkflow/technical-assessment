import React from "react";
import AboutComponentMini from "../../subComponents/About";
const AboutUs = () => {
  return (
    <section className="space-y-8" aria-labelledby="about-page-heading">
      <div className="grid grid-cols-1 gap-5 rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 md:grid-cols-[1.1fr_1fr] md:p-8">
        <div className="group/cover [perspective:1400px]">
          <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-soft transition-all duration-500 hover:shadow-card dark:border-slate-700">
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-indigo-500/0 via-sky-400/0 to-cyan-400/0 opacity-0 transition duration-500 group-hover/cover:opacity-100 group-hover/cover:from-indigo-500/20 group-hover/cover:via-sky-400/10 group-hover/cover:to-cyan-400/20" />
          <div className="aspect-[4/3]">
            <img
              src="https://plus.unsplash.com/premium_photo-1661749309788-0bba60b81222?w=1200&q=80"
              alt="Modern living room in a villa"
              className="h-full w-full transform-gpu object-cover transition duration-700 ease-out group-hover/cover:[transform:translateZ(95px)_rotateX(3deg)_scale(1.08)]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Our promise</p>
          <h1 id="about-page-heading" className="font-display text-[2.8rem] leading-none md:text-[3.7rem]">
            Your peace of mind, our priority
          </h1>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            We combine verified properties, responsive support, and transparent pricing so every stay
            feels effortless from booking to checkout.
          </p>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            Our team curates homes with strong design identity, practical amenities, and dependable host
            quality across every destination.
          </p>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            Whether you are traveling for family, work, or celebration, we help you find the right villa
            with confidence.
          </p>
        </div>
      </div>
      <AboutComponentMini />
    </section>
  );
};

export default AboutUs;

