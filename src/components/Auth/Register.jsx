import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { API_ORIGIN } from "../../context/api";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300 dark:border-slate-700 dark:bg-surface-900 dark:text-slate-100";

const rules = [
  { id: "length", label: "At least 8 characters", test: (value) => value.length >= 8 },
  { id: "letter", label: "Includes a letter", test: (value) => /[A-Za-z]/.test(value) },
  { id: "number", label: "Includes a number", test: (value) => /[0-9]/.test(value) },
];

function safeNext(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/profile";
  if (value.startsWith("/login") || value.startsWith("/register")) return "/profile";
  return value;
}

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const checks = useMemo(() => rules.map((rule) => ({ ...rule, ok: rule.test(form.password) })), [form.password]);
  const passwordReady = checks.every((rule) => rule.ok);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!passwordReady) {
      setError("Choose a password that meets every requirement.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await register(form);
      navigate(safeNext(location.state?.from), { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-4xl overflow-hidden rounded-card border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-surface-900 md:grid-cols-[0.85fr_1.15fr]">
      <aside className="bg-slate-900 p-6 text-slate-100 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">Account</p>
        <h1 className="mt-3 font-display text-[2.6rem] leading-none">Create account</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          A guest account lets you save villas and keep the messages you send from the home page.
        </p>
      </aside>
      <div className="p-6 md:p-8">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="name" className="text-sm font-semibold">Name</label>
            <input id="name" className={`${inputClass} mt-1.5`} required minLength={2} placeholder="Your name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </div>
          <div>
            <label htmlFor="register-email" className="text-sm font-semibold">Email</label>
            <input id="register-email" className={`${inputClass} mt-1.5`} type="email" required autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <div>
            <label htmlFor="register-password" className="text-sm font-semibold">Password</label>
            <div className="relative mt-1.5">
              <input id="register-password" className={`${inputClass} pr-11`} type={showPassword ? "text" : "password"} required autoComplete="new-password" placeholder="Create a password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
              <button type="button" className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-slate-500" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)}>
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            <ul className="mt-2 space-y-1" aria-live="polite">
              {checks.map((rule) => (
                <li key={rule.id} className={`text-sm transition-colors duration-200 ${rule.ok ? "text-emerald-700 dark:text-emerald-300" : "text-slate-500"}`}>
                  {rule.ok ? "Ready" : "Needed"} · {rule.label}
                </li>
              ))}
            </ul>
          </div>
          {error ? <p role="alert" className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}
          <button type="submit" disabled={submitting || !passwordReady} className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900">
            {submitting ? "Creating…" : "Create account"}
          </button>
        </form>
        <a href={`${API_ORIGIN}/api/auth/google`} className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
          Continue with Google
        </a>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Already registered? <Link className="font-semibold text-slate-900 dark:text-white" to="/login" state={{ from: location.state?.from }}>Sign in</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
