import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { smoothScrollTo } from "../../utils/smoothScroll";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isNotesRoute = location.pathname === "/notes";

  useEffect(() => {
    smoothScrollTo(0, { immediate: true });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface-50 text-slate-900 transition-colors duration-300 dark:bg-surface-950 dark:text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[150] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-slate-900"
      >
        Skip to main content
      </a>
      <Navbar />
      <main
        id="main-content"
        className={`min-h-[calc(100vh-24rem)] pb-16 ${
          isNotesRoute
            ? "px-0 pt-28 md:pt-32"
            : "px-pagex pt-28 md:px-pagexl md:pt-32"
        }`}
      >
        <div className={isNotesRoute ? "w-full" : "mx-auto w-full max-w-[1280px]"}>{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
