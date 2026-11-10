import React from "react";
import { Globe, Mail, MapPin, Phone, Share2 } from "lucide-react";

const Contact = () => {
  return (
    <section className="space-y-6" aria-labelledby="contact-page-heading">
      <header className="rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Contact us</p>
        <h1 id="contact-page-heading" className="mt-2 font-display text-[2.8rem] leading-none md:text-[3.7rem]">
          Planning your next stay?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300">
          Reach out for booking support, custom recommendations, and host partnership inquiries.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-5 rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 md:grid-cols-[1.1fr_1fr] md:p-8">
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="aspect-[4/3]">
            <img
              src="https://plus.unsplash.com/premium_photo-1661749309788-0bba60b81222?w=1200&q=80"
              alt="Team workspace"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div className="rounded-xl bg-slate-900 p-5 text-slate-100">
          <h2 className="font-display text-[2.2rem] leading-none">Let&apos;s connect</h2>

          <ul className="mt-4 space-y-3 text-sm">
            <li className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" aria-hidden="true" />
              +91 000 000 0000
            </li>
            <li className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" aria-hidden="true" />
              ozgur@gmail.com
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              House No.123 Sector A-1
            </li>
          </ul>

          <div className="mt-5 flex items-center gap-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition hover:bg-white/10"
              aria-label="Facebook"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition hover:bg-white/10"
              aria-label="Instagram"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Contact;

