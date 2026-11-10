import React from "react";
import { useSearchParams } from "react-router-dom";
import VillaCard from "./VillaCard";
import { useVillasData } from "../../hooks/useVillasData";
import { EmptyState, ErrorState, LoadingCards } from "../Feedback/AsyncStates";

const featureFilters = {
  seafront: {
    label: "Seafront",
    fn: (villa) => String(villa.category || "").toLowerCase().includes("sea"),
  },
  "pet-friendly": {
    label: "Pet Friendly",
    fn: (villa) => Number(villa.guests) <= 12,
  },
  "electric-car": {
    label: "Electric Car",
    fn: (villa) => Number(villa.dailyRent) >= 250,
  },
  "fitness-gym": {
    label: "Fitness/Gym",
    fn: (villa) => Number(villa.bedrooms) >= 6,
  },
  "boat-morning": {
    label: "Boat Morning",
    fn: (villa) => String(villa.location || "").toLowerCase() === "greece",
  },
};

const Villas = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { villas, isLoading, error, retry } = useVillasData();
  const places = [...new Set(villas.map((villa) => villa.location).filter(Boolean))].sort();
  const categories = [...new Set(villas.map((villa) => villa.category).filter(Boolean))].sort();
  const featureKey = searchParams.get("feature") || "";
  const place = searchParams.get("place") || "";
  const category = searchParams.get("category") || "";
  const activeFeature = featureFilters[featureKey];
  const filteredVillas = villas.filter((villa) => {
    if (activeFeature && !activeFeature.fn(villa)) return false;
    if (place && villa.location !== place) return false;
    if (category && villa.category !== category) return false;
    return true;
  });

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  return (
    <section className="space-y-6" aria-labelledby="all-villas-heading">
      <header className="rounded-card bg-white p-5 shadow-soft dark:bg-surface-900 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Villa directory</p>
        <h1 id="all-villas-heading" className="mt-2 font-display text-[2.8rem] leading-none md:text-[3.7rem]">
          All Villas
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
          {isLoading ? "Loading properties..." : `${filteredVillas.length} Properties available`}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {[{ key: "place", label: "Anywhere", value: "" }, ...places.map((item) => ({ key: "place", label: item, value: item }))].map((item) => (
            <FilterChip key={`place-${item.label}`} active={place === item.value} onClick={() => setFilter("place", item.value)}>
              {item.label}
            </FilterChip>
          ))}
          {categories.map((item) => (
            <FilterChip key={item} active={category === item} onClick={() => setFilter("category", category === item ? "" : item)}>
              {item}
            </FilterChip>
          ))}
        </div>
        {activeFeature ? (
          <div className="mt-3 inline-flex items-center gap-2 border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-[#2a2a2a] dark:bg-[#111111]">
            <span>Active filter: {activeFeature.label}</span>
            <button
              type="button"
              onClick={() => setFilter("feature", "")}
              className="border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-slate-100 dark:hover:bg-[#222222]"
            >
              Clear
            </button>
          </div>
        ) : null}
      </header>

      {isLoading ? <LoadingCards count={6} /> : null}

      {!isLoading && error ? (
        <ErrorState
          title="Failed to load villas"
          description={error}
          retryLabel="Retry request"
          onRetry={retry}
        />
      ) : null}

      {!isLoading && !error && filteredVillas.length === 0 ? (
        <EmptyState
          title={place || category || activeFeature ? "No villas match these filters" : "No villas available"}
          description={
            place || category || activeFeature
              ? "Try another place, category, or speciality."
              : "No listings found. Please check back shortly."
          }
        />
      ) : null}

      {!isLoading && !error && filteredVillas.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredVillas.map((villa, index) => (
            <VillaCard key={villa.id} villa={villa} index={index} />
          ))}
        </div>
      ) : null}
    </section>
  );
};

const FilterChip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`h-9 rounded-full px-4 text-sm font-medium transition duration-200 ease-smooth ${
      active
        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-surface-900 dark:text-slate-100 dark:hover:bg-slate-800"
    }`}
  >
    {children}
  </button>
);

export default Villas;

