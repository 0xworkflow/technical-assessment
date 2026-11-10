import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../context/api";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300 dark:border-slate-700 dark:bg-surface-900 dark:text-slate-100";

const Profile = () => {
  const navigate = useNavigate();
  const { user, ready, updateProfile, changePassword, becomeHost } = useAuth();
  const [profile, setProfile] = useState({ name: "", phone: "", bio: "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [saved, setSaved] = useState([]);
  const [messages, setMessages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate("/login");
      return;
    }
    setProfile({ name: user.name || "", phone: user.phone || "", bio: user.bio || "" });
  }, [ready, user, navigate]);

  useEffect(() => {
    if (!user) return;
    api("/api/favorites").then(setSaved).catch(() => setSaved([]));
    api("/api/profile/inquiries").then(setMessages).catch(() => setMessages([]));
    api("/api/bookings").then((items) => setBookings(user.role === "host" ? [] : items)).catch(() => setBookings([]));
  }, [user]);

  if (!user) return null;

  const saveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await updateProfile(profile);
      setNotice("Profile saved.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await changePassword(password);
      setPassword({ currentPassword: "", newPassword: "" });
      setNotice("Password updated.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const onBecomeHost = async () => {
    setError("");
    try {
      await becomeHost();
      setNotice("You are now a host.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Account</p>
        <h1 className="mt-2 font-display text-[2.8rem] leading-none">Your profile</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {user.email} · {user.role} · signed in with {user.provider}
        </p>
      </header>

      {notice ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{notice}</p> : null}
      {error ? <p className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="space-y-3 rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900" onSubmit={saveProfile}>
          <h2 className="font-display text-[2rem] leading-none">Profile</h2>
          <input className={inputClass} required value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} placeholder="Name" />
          <input className={inputClass} value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} placeholder="Phone" />
          <textarea className={`${inputClass} h-28 py-2.5`} value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} placeholder="Short bio" />
          <button type="submit" className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">Save profile</button>
          {user.role !== "host" ? (
            <button type="button" onClick={onBecomeHost} className="ml-2 inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-100">
              Become a host
            </button>
          ) : (
            <Link to="/manage" className="ml-2 inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-100">
              Manage villas
            </Link>
          )}
        </form>

        <form className="space-y-3 rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900" onSubmit={savePassword}>
          <h2 className="font-display text-[2rem] leading-none">Password</h2>
          {user.hasPassword ? (
            <input className={inputClass} type="password" required value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} placeholder="Current password" />
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">This Google account has no password yet. Set one below.</p>
          )}
          <input className={inputClass} type="password" required value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} placeholder="New password" />
          <button type="submit" className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">Update password</button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900">
          <h2 className="font-display text-[2rem] leading-none">Your bookings</h2>
          {bookings.length === 0 ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No bookings yet.</p> : null}
          <ul className="mt-3 space-y-3 text-sm">
            {bookings.map((item) => (
              <li key={item.id}>
                <Link className="font-semibold text-slate-800 dark:text-slate-100" to={`/villa/${item.villaId}`}>{item.villaName}</Link>
                <p>{item.startDate} to {item.endDate} · Rs.{item.total} · {item.status}</p>
                {item.status === "confirmed" ? (
                  <button
                    type="button"
                    className="mt-1 font-semibold text-red-700"
                    onClick={async () => {
                      try {
                        await api(`/api/bookings/${item.id}/cancel`, { method: "POST" });
                        setBookings(await api("/api/bookings"));
                      } catch (requestError) {
                        setError(requestError.message);
                      }
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900">
          <h2 className="font-display text-[2rem] leading-none">Saved villas</h2>
          {saved.length === 0 ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No saved villas yet.</p> : null}
          <ul className="mt-3 space-y-2">
            {saved.map((item) => (
              <li key={item.id}>
                <Link className="text-sm font-semibold text-slate-800 underline dark:text-slate-100" to={`/villa/${item.villaId}`}>
                  {item.villa.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900">
          <h2 className="font-display text-[2rem] leading-none">Your messages</h2>
          {messages.length === 0 ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Messages you send while signed in appear here.</p> : null}
          <ul className="mt-3 space-y-3">
            {messages.map((item) => (
              <li key={item.id} className="text-sm text-slate-700 dark:text-slate-200">
                <p className="font-semibold">{item.message}</p>
                {item.reply ? <p className="mt-1 text-slate-500">Reply: {item.reply}</p> : null}
                <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Profile;
