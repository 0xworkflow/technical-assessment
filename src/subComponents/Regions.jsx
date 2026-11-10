import React from "react";
import { Link } from "react-router-dom";

const regionBase = [
  {
    key: "mountains",
    title: "Mountains",
    image: "https://plus.unsplash.com/premium_photo-1679857224535-85d45adae907?w=1200&q=80",
    category: "Mountains",
  },
  {
    key: "seaside",
    title: "Coastline",
    image: "https://images.unsplash.com/photo-1486607303850-bc051a4ffad4?w=1200&q=80",
    category: "Seaside",
  },
];

const Regions = ({ villas, isLoading }) => {
  const counts = villas.reduce(
    (acc, villa) => {
      const category = (villa.category || "").toLowerCase();
      if (category.includes("mount")) {
        acc.mountains += 1;
      } else {
        acc.seaside += 1;
      }
      return acc;
    },
    { mountains: 0, seaside: 0 }
  );

  return (
    <section
      aria-labelledby="regions-heading"
      className="rounded-hero bg-white p-6 shadow-soft dark:bg-surface-900 md:p-8"
    >
      <h2 id="regions-heading" className="font-display text-[2.4rem] leading-none md:text-[3.2rem]">
        Our Regions
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-200">
        Choose your preferred backdrop. From dramatic mountain retreats to calming coastal escapes,
        each listing is selected for quality and comfort.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {regionBase.map((region) => (
          <Link
            key={region.key}
            to={`/villas?category=${region.category}`}
            className="group relative block overflow-hidden rounded-[1.5rem] shadow-soft transition duration-300 ease-smooth hover:-translate-y-1"
          >
            <div className="aspect-[5/4]">
              <img
                src={region.image}
                alt={`${region.title} villas`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <h3 className="font-display text-[2.1rem] leading-none">{region.title}</h3>
              <p className="mt-2 inline-flex rounded-pill border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {isLoading
                  ? "Loading..."
                  : `${region.key === "mountains" ? counts.mountains : counts.seaside} Properties`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Regions;
