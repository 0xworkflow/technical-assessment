import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-pagex pb-6 text-slate-300 md:px-pagexl">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 rounded-[2rem] bg-slate-950 px-6 py-10 md:grid-cols-[1.5fr_1fr] md:px-10">
        <section aria-labelledby="footer-brand">
          <h2 id="footer-brand" className="font-display text-3xl font-semibold tracking-tight text-white">
            Royal<span className="text-brand-400">City</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Premium stays designed for comfort, privacy, and memorable getaways. Explore curated
            villas with modern amenities and concierge-level support.
          </p>
          <nav className="mt-6" aria-label="Footer links">
            <ul className="flex flex-wrap items-center gap-4 text-sm font-semibold tracking-wide">
              <li>
                <Link className="transition hover:text-white" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-white" to="/termsandconditions">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-white" to="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-white" to="/notes">
                  Notes
                </Link>
              </li>
            </ul>
          </nav>
        </section>

        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact" className="font-display text-3xl font-semibold tracking-tight text-white">
            Connect with us
          </h2>
          <ul className="mt-4 space-y-3 text-base">
            <li>+91 000 000 0000</li>
            <li>ozgur@gmail.com</li>
            <li>All Rights Reserved by Ozgur</li>
          </ul>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
