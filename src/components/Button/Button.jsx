import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  type = "button",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`relative inline-flex items-center justify-center ${className}`.trim()}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      <span className={loading ? "inline-flex w-full items-center justify-center invisible" : "inline-flex w-full items-center justify-center"}>
        {children}
      </span>
      {loading ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <Loader2 className="h-[18px] w-[18px] animate-spin" />
        </span>
      ) : null}
    </button>
  );
};

export default Button;
