import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { API_ORIGIN } from "../../context/api";
import { useAuth } from "../../context/AuthContext";

const EMAIL_KEY = "royalcity.rememberedEmail";
const DEMO_EMAIL = "demo@royalcity.test";
const DEMO_PASSWORD = "VillaGuest1";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300 aria-[invalid=true]:border-red-400 dark:border-slate-700 dark:bg-surface-900 dark:text-slate-100";

const googleErrors = {
  google_not_configured: "Google sign-in needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the server environment.",
  google_denied: "Google sign-in was cancelled.",
  google_state: "Google sign-in could not be verified. Please try again.",
  google_failed: "Google sign-in failed. Check the OAuth client and callback URL.",
};

function safeNext(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/profile";
  if (value.startsWith("/login") || value.startsWith("/register")) return "/profile";
  return value;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { user, ready, login } = useAuth();
  const next = safeNext(location.state?.from);
  const rememberedEmail = window.localStorage.getItem(EMAIL_KEY) || "";
  const [email, setEmail] = useState(rememberedEmail);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(Boolean(rememberedEmail));
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(googleErrors[params.get("error")] || "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) navigate(next, { replace: true });
  }, [ready, user, next, navigate]);

  const googleHint = /@(gmail|googlemail)\.com$/i.test(email.trim());
  const returning = Boolean(rememberedEmail) && email.trim() === rememberedEmail;

  const updateCapsLock = (event) => {
    setCapsLock(event.getModifierState?.("CapsLock") || false);
  };

  const validate = () => {
    const errors = {};
    const trimmed = email.trim();
    if (!trimmed) errors.email = "Enter the email on your account.";
    else if (!emailPattern.test(trimmed)) errors.email = "That email does not look complete.";
    if (!password) errors.password = "Enter your password.";
    return errors;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    setFormError("");
    try {
      await login({ email: email.trim(), password });
      if (remember) window.localStorage.setItem(EMAIL_KEY, email.trim());
      else window.localStorage.removeItem(EMAIL_KEY);
      navigate(next, { replace: true });
    } catch (requestError) {
      if (!requestError.status) {
        setFormError("The sign-in service is not reachable. Check that the API is running.");
      } else {
        setFormError(requestError.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const useDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setRemember(true);
    setFieldErrors({});
    setFormError("");
  };

  if (!ready || user) {
    return (
      <section className="mx-auto max-w-md rounded-card border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-surface-900">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {user ? "You are already signed in. Continuing…" : "Checking your session…"}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-4xl overflow-hidden rounded-card border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-surface-900 md:grid-cols-[0.85fr_1.15fr]">
      <aside className="bg-slate-900 p-6 text-slate-100 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">Account</p>
        <h1 className="mt-3 font-display text-[2.6rem] leading-none">{returning ? "Welcome back" : "Sign in"}</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          {next === "/profile"
            ? "Save villas, keep the messages you send, and manage your profile from one account."
            : "Sign in to continue where you left off."}
        </p>
        <ul className="mt-6 space-y-2 text-sm text-slate-300">
          <li>Saved villas stay on your profile</li>
          <li>Contact messages are kept while you are signed in</li>
          <li>You can become a host from your profile</li>
        </ul>
      </aside>

      <div className="p-6 md:p-8">
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-slate-800 dark:text-slate-100">Email</label>
            <input
              id="email"
              className={`${inputClass} mt-1.5`}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }}
            />
            {fieldErrors.email ? <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-300">{fieldErrors.email}</p> : null}
            {googleHint ? (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">This looks like a Google account. Continue with Google if that is how you registered.</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold text-slate-800 dark:text-slate-100">Password</label>
            <div className="relative mt-1.5">
              <input
                id="password"
                className={`${inputClass} pr-11`}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={password}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password || capsLock ? "password-hint" : undefined}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFieldErrors((current) => ({ ...current, password: undefined }));
                }}
                onKeyUp={updateCapsLock}
                onKeyDown={updateCapsLock}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-slate-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            {fieldErrors.password || capsLock ? (
              <p id="password-hint" className="mt-1 text-sm text-red-600 dark:text-red-300">
                {fieldErrors.password || "Caps Lock is on."}
              </p>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            Remember this email on this device
          </label>

          {formError ? <p role="alert" className="text-sm text-red-600 dark:text-red-300">{formError}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70 dark:bg-slate-100 dark:text-slate-900"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          or
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <a href={`${API_ORIGIN}/api/auth/google`} className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
          Continue with Google
        </a>
        <button type="button" onClick={useDemo} className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold text-slate-700 underline-offset-2 hover:underline dark:text-slate-200">
          Use the demo guest account
        </button>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          New here? <Link className="font-semibold text-slate-900 dark:text-white" to="/register" state={{ from: next }}>Create an account</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
