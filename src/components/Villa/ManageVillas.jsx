import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../context/api";
import { useAuth } from "../../context/AuthContext";
import HostDesk from "./HostDesk";

const emptyForm = {
  name: "",
  location: "Greece",
  category: "Mountains",
  guests: "4",
  bedrooms: "2",
  bathrooms: "2",
  squareMeter: "120",
  rating: "4.5",
  dailyRent: "180",
  image: "",
  description: "",
  status: "published",
};

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-300 dark:border-slate-700 dark:bg-surface-900 dark:text-slate-100";

const ManageVillas = () => {
  const navigate = useNavigate();
  const { user, ready, becomeHost } = useAuth();
  const [villas, setVillas] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (ready && !user) navigate("/login", { replace: true, state: { from: "/manage" } });
  }, [ready, user, navigate]);

  const load = async (nextQuery = query, nextSort = sort) => {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextSort) params.set("sort", nextSort);
    const suffix = params.toString() ? `?${params}` : "";
    setVillas(await api(`/api/villas${suffix}`));
  };

  useEffect(() => {
    if (!user || user.role !== "host") return undefined;
    let ignore = false;
    setLoading(true);
    const timer = window.setTimeout(() => {
      load(query, sort)
        .catch((requestError) => {
          if (!ignore) setError(requestError.message);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }, 200);
    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [user, query, sort]);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      ...form,
      guests: Number(form.guests),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      rating: Number(form.rating),
    };
    try {
      if (editingId) {
        await api(`/villas/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
        setNotice("Villa updated.");
      } else {
        await api("/villas", { method: "POST", body: JSON.stringify(payload) });
        setNotice("Villa added.");
      }
      resetForm();
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const editVilla = (villa) => {
    setEditingId(villa.id);
    setForm({
      name: villa.name,
      location: villa.location,
      category: villa.category,
      guests: String(villa.guests),
      bedrooms: String(villa.bedrooms),
      bathrooms: String(villa.bathrooms),
      squareMeter: String(villa.squareMeter),
      rating: String(villa.rating),
      dailyRent: String(villa.dailyRent),
      image: villa.image,
      description: villa.description || "",
      status: villa.status || "published",
    });
    setNotice("");
    setError("");
  };

  const removeVilla = async (villa) => {
    if (!window.confirm(`Remove ${villa.name}?`)) return;
    setError("");
    try {
      await api(`/villas/${villa.id}`, { method: "DELETE" });
      if (editingId === villa.id) resetForm();
      setNotice(`${villa.name} was removed.`);
      await load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (!ready || !user) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Checking your session…</p>;
  }

  if (user.role !== "host") {
    return (
      <section className="mx-auto max-w-xl rounded-card border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-surface-900">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Host tools</p>
        <h1 className="mt-2 font-display text-[2.6rem] leading-none">Villa management</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Hosts can add listings, hide them as drafts, and update the details guests see.
        </p>
        <button type="button" onClick={() => becomeHost().catch((requestError) => setError(requestError.message))} className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
          Become a host
        </button>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form className="space-y-3 rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900" onSubmit={onSubmit}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Host tools</p>
        <h1 className="font-display text-[2.4rem] leading-none">{editingId ? "Edit villa" : "Add a villa"}</h1>
        <input className={inputClass} required placeholder="Name" value={form.name} onChange={update("name")} />
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} required placeholder="Location" list="villa-locations" value={form.location} onChange={update("location")} />
          <input className={inputClass} required placeholder="Category" list="villa-categories" value={form.category} onChange={update("category")} />
        </div>
        <datalist id="villa-locations">
          <option value="Greece" />
          <option value="Italy" />
        </datalist>
        <datalist id="villa-categories">
          <option value="Mountains" />
          <option value="Seaside" />
        </datalist>
        <div className="grid grid-cols-3 gap-3">
          <input className={inputClass} required type="number" min="1" placeholder="Guests" value={form.guests} onChange={update("guests")} />
          <input className={inputClass} required type="number" min="1" placeholder="Bedrooms" value={form.bedrooms} onChange={update("bedrooms")} />
          <input className={inputClass} required type="number" min="1" placeholder="Bathrooms" value={form.bathrooms} onChange={update("bathrooms")} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <input className={inputClass} required placeholder="Square meters" value={form.squareMeter} onChange={update("squareMeter")} />
          <input className={inputClass} required placeholder="Rating" value={form.rating} onChange={update("rating")} />
          <input className={inputClass} required placeholder="Daily rent" value={form.dailyRent} onChange={update("dailyRent")} />
        </div>
        <input className={inputClass} required placeholder="Image URL" value={form.image} onChange={update("image")} />
        <input
          className="text-sm"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Upload villa image"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const body = new FormData();
            body.append("image", file);
            setError("");
            try {
              const result = await api("/api/uploads", { method: "POST", body });
              setForm((current) => ({ ...current, image: result.url }));
              setNotice("Image uploaded.");
            } catch (requestError) {
              setError(requestError.message);
            }
          }}
        />
        <textarea className={`${inputClass} h-24 py-2.5`} placeholder="Description" value={form.description} onChange={update("description")} />
        <select className={inputClass} value={form.status} onChange={update("status")}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        {error ? <p className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}
        {notice ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{notice}</p> : null}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white disabled:opacity-70 dark:bg-slate-100 dark:text-slate-900">
            {saving ? "Saving…" : editingId ? "Save changes" : "Add villa"}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 px-5 text-sm font-semibold dark:border-slate-700">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900">
        <div className="flex flex-wrap items-center gap-2">
          <input className={`${inputClass} min-w-[12rem] flex-1`} placeholder="Search listings" value={query} onChange={(event) => setQuery(event.target.value)} />
          <select className={`${inputClass} w-auto`} value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="">Catalog order</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="price">Price</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{loading ? "Loading listings…" : `${villas.length} listings, including drafts`}</p>
        <ul className="mt-4 space-y-3">
          {villas.map((villa) => (
            <li key={villa.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 p-3 dark:border-slate-700">
              <div>
                <p className="font-semibold">{villa.name}</p>
                <p className="text-sm text-slate-500">{villa.location} · {villa.category} · {villa.status}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/villa/${villa.id}`} className="inline-flex h-9 items-center px-3 text-sm font-semibold text-slate-700 dark:text-slate-200">View</Link>
                <button type="button" onClick={() => editVilla(villa)} className="inline-flex h-9 items-center border border-slate-300 px-3 text-sm font-semibold dark:border-slate-700">Edit</button>
                <button type="button" onClick={() => removeVilla(villa)} className="inline-flex h-9 items-center px-3 text-sm font-semibold text-red-700 dark:text-red-300">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:col-span-2">
        <HostDesk villas={villas} />
      </div>
    </section>
  );
};

export default ManageVillas;
