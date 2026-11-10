import React from "react";
import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Ruler, Users, Dot } from "lucide-react";

const VillaCard = ({ villa, compact = false, index = 0 }) => {
  const cardPadding = compact ? "p-4" : "p-5";

  return (
    <Link
      to={`/villa/${villa.id}`}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className="group relative block overflow-hidden rounded-[1.75rem] border border-white/80 bg-white text-slate-900 shadow-soft transition duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card motion-safe:animate-rise dark:border-white/10 dark:bg-surface-900 dark:text-slate-100"
      aria-label={`Open ${villa.name} details`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={villa.image}
          alt={villa.name}
          className="h-full w-full object-cover transition duration-700 ease-smooth group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
        <span className="absolute bottom-4 right-4 translate-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-white opacity-0 transition duration-300 ease-smooth group-hover:translate-y-0 group-hover:opacity-100">
          View stay
        </span>
        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-900 shadow-soft">
          Rs.{villa.dailyRent} / night
        </div>
      </div>

      <div className={`${cardPadding}`}>
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {villa.location}
          <Dot className="h-4 w-4" aria-hidden="true" />
          {villa.category}
        </p>

        <h3 className="font-display text-2xl font-semibold tracking-tight">{villa.name}</h3>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="inline-flex items-center gap-2">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>{villa.guests} Guests</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <BedDouble className="h-4 w-4" aria-hidden="true" />
            <span>{villa.bedrooms} Bedrooms</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Ruler className="h-4 w-4" aria-hidden="true" />
            <span>{villa.squareMeter} m2</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Bath className="h-4 w-4" aria-hidden="true" />
            <span>{villa.bathrooms} Bathrooms</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VillaCard;

