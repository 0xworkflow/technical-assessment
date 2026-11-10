import React from "react";
import { Link } from "react-router-dom";
import VillaCard from "../components/Villa/VillaCard";
import { EmptyState, ErrorState, LoadingCards } from "../components/Feedback/AsyncStates";

const TopVillas = ({ villas, isLoading, error, onRetry }) => {
  const featuredVillas = villas.slice(0, 3);

  return (
    <section aria-labelledby="top-villas-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">
            Signature stays
          </p>
          <h2 id="top-villas-heading" className="font-display text-[2.5rem] leading-none md:text-[3.3rem]">
            Top Pick Villas
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Curated properties with standout ratings, flexible living spaces, and premium amenities.
          </p>
        </div>
        <Link
          to="/villas"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          See all villas
        </Link>
      </div>

      {isLoading ? <LoadingCards count={3} /> : null}

      {!isLoading && error ? (
        <ErrorState
          title="Featured villas failed to load"
          description={error}
          retryLabel="Retry loading villas"
          onRetry={onRetry}
        />
      ) : null}

      {!isLoading && !error && featuredVillas.length === 0 ? (
        <EmptyState
          title="No featured villas available"
          description="Try again in a moment or adjust your data source."
        />
      ) : null}

      {!isLoading && !error && featuredVillas.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredVillas.map((villa, index) => (
            <VillaCard key={villa.id} villa={villa} index={index} />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default TopVillas;
