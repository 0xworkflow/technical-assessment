export const smoothScrollTo = (target = 0, options = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.05,
      ...options,
    });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({
      top: target,
      behavior: "smooth",
    });
  }
};
