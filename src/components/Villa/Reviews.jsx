import React, { useEffect, useState } from "react";
import { api } from "../../context/api";

const Reviews = ({ villaId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ bookingId: "", rating: "5", comment: "" });
  const [error, setError] = useState("");

  const load = () => api(`/villas/${villaId}/reviews`).then(setReviews).catch(() => setReviews([]));

  useEffect(() => {
    load();
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    api("/api/bookings")
      .then((items) =>
        setBookings(
          items.filter(
            (item) =>
              item.own &&
              String(item.villaId) === String(villaId) &&
              item.status === "confirmed" &&
              item.endDate <= today
          )
        )
      )
      .catch(() => setBookings([]));
  }, [villaId, user]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      });
      setForm({ bookingId: "", rating: "5", comment: "" });
      await load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-5 shadow-soft dark:bg-surface-900">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Guest reviews</h2>
      {reviews.length === 0 ? <p className="mt-3 text-sm text-slate-500">No reviews yet.</p> : null}
      <ul className="mt-4 space-y-3">
        {reviews.map((review) => (
          <li key={review.id} className="rounded-2xl bg-surface-50 p-3 dark:bg-white/5">
            <p className="text-sm font-semibold">{review.author} · {review.rating}/5</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
          </li>
        ))}
      </ul>
      {user && bookings.length > 0 ? (
        <form className="mt-4 space-y-3" onSubmit={submit}>
          <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-surface-950" value={form.bookingId} onChange={(event) => setForm({ ...form, bookingId: event.target.value })} required>
            <option value="">Choose a completed stay</option>
            {bookings.map((booking) => (
              <option key={booking.id} value={booking.id}>{booking.startDate} to {booking.endDate}</option>
            ))}
          </select>
          <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm dark:border-white/10 dark:bg-surface-950" type="number" min="1" max="5" aria-label="Rating" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} />
          <textarea className="h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-surface-950" placeholder="How was the stay?" value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} required />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="inline-flex h-11 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">Publish review</button>
        </form>
      ) : null}
    </section>
  );
};

export default Reviews;
