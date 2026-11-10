import React from "react";

const TermsAndConditions = () => {
  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 md:p-8">
      <header className="border-b border-slate-200 pb-6 dark:border-slate-700">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">
          Current as of September 2024
        </p>
        <h1 className="mt-2 text-center font-display text-[2.8rem] leading-none md:text-[3.7rem]">
          Terms & Conditions
        </h1>
      </header>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
        <p className="leading-7">
          Welcome to LUXURY RENTAL. Please read these terms and conditions
          carefully before using our services.
        </p>
        <p className="leading-7">
          By accessing or using the Website, you agree to be bound by these
          Terms. If you do not agree with any part of these Terms, you may not
          use the Website.
        </p>
        <ul className="space-y-5">
          <li>
           <h2 className="font-display text-[2rem] leading-none text-slate-900 dark:text-slate-100">Acceptance of Terms</h2>
            <p>
              By using the Website, you acknowledge that you have read,
              understood, and agree to be bound by these Terms and any future
              modifications. We reserve the right to update, change, or replace
              any part of these Terms by posting updates or changes to our
              Website. Your continued use of the Website constitutes acceptance
              of those changes.
            </p>
          </li>
          <li>
            <h2 className="font-display text-[2rem] leading-none text-slate-900 dark:text-slate-100">
            Use of the Website
            </h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li> You must be at least [age] years old to use the Website.</li>
              <li>
                You agree to use the Website for lawful purposes and in
                compliance with all applicable laws and regulations.
              </li>
              <li>
                You are solely responsible for maintaining the security of your
                account and password. We cannot and will not be liable for any
                loss or damage from your failure to comply with this security
                obligation.
              </li>
            </ol>
          </li>
          <li>
            <h2 className="font-display text-[2rem] leading-none text-slate-900 dark:text-slate-100">
            Privacy Policy
            </h2>
            <p>
              Your use of the Website is also governed by our Privacy Policy,
              which is incorporated by reference into these Terms.
            </p>
          </li>
          <li>
            <h2 className="font-display text-[2rem] leading-none text-slate-900 dark:text-slate-100">Intellectual Property</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>
                The content on the Website, including but not limited to text,
                graphics, logos, images, and software, is the property of [Your
                Company] and is protected by copyright, trademark, and other
                intellectual property laws.
              </li>
              <li>
                You may not modify, publish, transmit, participate in the
                transfer or sale of, reproduce, create derivative works of,
                distribute, publicly perform, publicly display, or in any way
                exploit any of the materials or content on the Website.
              </li>
            </ol>
          </li>
          <li>
            <h2 className="font-display text-[2rem] leading-none text-slate-900 dark:text-slate-100">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, [Your Company]
              shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or
              revenues, whether incurred directly or indirectly, or any loss of
              data, use, goodwill, or other intangible losses, resulting from
              (a) your use or inability to use the Website; (b) any unauthorized
              access to or use of our servers and/or any personal information
              stored therein; (c) any interruption or cessation of transmission
              to or from the Website; (d) any bugs, viruses, trojan horses, or
              the like that may be transmitted to or through our Website by any
              third party.
            </p>
          </li>
          <li>
            <h2 className="font-display text-[2rem] leading-none text-slate-900 dark:text-slate-100">Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of Jurisdiction. Contact Information If you have any
              questions about these Terms, please contact us at{" "}
              <span>propertyrental@gmail.com</span>.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default TermsAndConditions;

