import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import Button from "../Button/Button";

const surfaceClass =
  "rounded-card border border-slate-200 bg-white p-6 text-slate-800 shadow-soft dark:border-slate-800 dark:bg-surface-900 dark:text-slate-100";

export const LoadingCards = ({ count = 3, className = "" }) => (
  <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 ${className}`.trim()}>
    {Array.from({ length: count }).map((_, index) => (
      <article className={surfaceClass} key={`loading-card-${index}`} aria-hidden="true">
        <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 h-3.5 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-3 h-3.5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </article>
    ))}
  </div>
);

export const EmptyState = ({
  title = "Nothing here yet",
  description = "No records were returned.",
  className = "",
}) => (
  <div className={`${surfaceClass} ${className}`.trim()} role="status" aria-live="polite">
    <h3 className="font-display text-3xl leading-none">{title}</h3>
    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
  </div>
);

export const ErrorState = ({
  title = "Could not load data",
  description = "Please try again.",
  retryLabel = "Retry",
  onRetry,
  className = "",
}) => (
  <div className={`${surfaceClass} ${className}`.trim()} role="alert" aria-live="assertive">
    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
      <AlertTriangle className="h-5 w-5" aria-hidden="true" />
    </div>
    <h3 className="font-display text-3xl leading-none">{title}</h3>
    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
    {onRetry ? (
      <Button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        <RefreshCcw className="h-4 w-4" aria-hidden="true" />
        {retryLabel}
      </Button>
    ) : null}
  </div>
);

