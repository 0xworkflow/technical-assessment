import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const baseNavItems = [
  { to: "/aboutus", label: "About Us" },
  { to: "/villas", label: "Villas" },
  { to: "/contact", label: "Contact" },
  { to: "/notes", label: "Notes" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, ready, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  const onLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(enabled);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    setIsOpen(false);
    setHidden(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 8);
      if (isOpen || y < 64) setHidden(false);
      else if (delta > 10) setHidden(true);
      else if (delta < -10) setHidden(false);
      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
    return undefined;
  }, [isOpen]);

  const navItems = user?.role === "host" ? [...baseNavItems, { to: "/manage", label: "Manage" }] : baseNavItems;

  const navLinkClass = useMemo(
    () =>
      ({ isActive }) =>
        [
          "rounded-full px-3 py-2 text-sm font-medium transition",
          "focus-visible:ring-2 focus-visible:ring-brand-400",
          isActive
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
        ].join(" "),
    []
  );

  return (
    <header className={`fixed inset-x-0 top-0 z-[120] px-3 pt-3 transition-transform duration-300 ease-smooth md:px-6 ${hidden ? "-translate-y-[120%]" : "translate-y-0"}`}>
      <nav
        className={`mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between rounded-full border border-white/80 bg-white/75 px-3 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-black/55 ${scrolled ? "shadow-card" : ""}`}
        aria-label="Primary"
      >
        <Link
          to="/"
          className="pl-3 font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
        >
          Royal<span className="text-brand-600">City</span>
        </Link>

        <ul className="m-0 hidden list-none items-center gap-2 p-0 md:flex">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink className={navLinkClass} to={item.to}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {ready && user ? (
            <>
              <Link to="/profile" className="hidden max-w-[8rem] truncate text-sm font-medium text-slate-700 md:inline dark:text-slate-200">
                {user.name}
              </Link>
              <button type="button" onClick={onLogout} className="hidden h-10 items-center rounded-full px-3 text-sm font-medium text-slate-600 md:inline-flex hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10">
                Log out
              </button>
            </>
          ) : null}
          {ready && !user ? (
            <Link to="/login" state={{ from: location.pathname }} className="hidden h-10 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white md:inline-flex dark:bg-white dark:text-slate-900">
              Sign in
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <Sun className="h-5 w-5 transition-transform duration-300" aria-hidden="true" /> : <Moon className="h-5 w-5 transition-transform duration-300" aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 md:hidden dark:text-slate-100 dark:hover:bg-white/10"
            aria-controls="mobile-nav"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 top-nav z-[110] bg-slate-950/40 transition duration-300 ease-smooth md:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-nav"
        className={`fixed inset-x-4 top-24 z-[115] rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-card backdrop-blur-xl transition duration-300 ease-smooth md:hidden dark:border-white/10 dark:bg-[#141311]/95 ${
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <ul className="m-0 list-none space-y-1 p-0">
          {navItems.map((item) => (
            <li key={`mobile-${item.to}`}>
              <NavLink
                className={navLinkClass}
                to={item.to}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          {ready && user ? (
            <>
              <li>
                <NavLink className={navLinkClass} to="/profile" onClick={() => setIsOpen(false)}>
                  {user.name}
                </NavLink>
              </li>
              <li>
                <button type="button" className="w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-700 dark:text-slate-200" onClick={onLogout}>
                  Log out
                </button>
              </li>
            </>
          ) : null}
          {ready && !user ? (
            <li>
              <NavLink className={navLinkClass} to="/login" state={{ from: location.pathname }} onClick={() => setIsOpen(false)}>
                Sign in
              </NavLink>
            </li>
          ) : null}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;

