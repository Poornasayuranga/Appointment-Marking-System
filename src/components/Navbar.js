"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useShowSidebar } from "@/components/Sidebar";
import {
  HeartPulseIcon,
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
  CalendarClockIcon,
  SettingsIcon,
  LogoutIcon,
  DashboardIcon,
} from "@/components/Icons";

function getNavLinks(user) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/doctors", label: "Find Doctors" },
  ];
  if (user?.role === "PATIENT") links.push({ href: "/appointments", label: "My Appointments" });
  if (user?.role === "DOCTOR") links.push({ href: "/doctor", label: "Doctor Dashboard" });
  if (user?.role === "ADMIN") links.push({ href: "/admin", label: "Admin Dashboard" });
  return links;
}

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function initials(name = "") {
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  const links = getNavLinks(user);
  const onHome = pathname === "/";
  const showSidebar = useShowSidebar();
  // Over the homepage hero the bar starts transparent and turns solid once scrolled.
  // With the sidebar beside it, it stays solid so the two read as one frame.
  const solid = scrolled || !onHome || mobileOpen || showSidebar;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when the route changes (adjust state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setMenuOpen(false);
  }

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  const dashboardHref =
    user?.role === "ADMIN" ? "/admin" : user?.role === "DOCTOR" ? "/doctor" : "/appointments";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-white/85 backdrop-blur-md shadow-[0_4px_24px_-12px_rgb(125_37_37/0.35)] border-b border-primary/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 h-16">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-linear-to-br from-primary to-primary-dark text-white shadow-[var(--shadow-glow)] group-hover:scale-105 transition-transform">
            <HeartPulseIcon className="w-5 h-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-bold text-ink text-[15px] tracking-tight">
              Medi<span className="text-primary">Book</span>
            </span>
            <span className="block text-[11px] text-primary-dark/70 font-medium -mt-0.5">
              Appointment System
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 rounded-full bg-white/60 border border-primary/10 p-1 backdrop-blur">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-white shadow-[var(--shadow-glow)]"
                      : "text-ink/75 hover:text-primary hover:bg-blush"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          {!user && (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-primary-dark hover:text-primary transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-linear-to-r from-primary to-primary-dark shadow-[var(--shadow-glow)] hover:brightness-110 transition"
              >
                Get Started
              </Link>
            </>
          )}

          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-primary/15 bg-white hover:border-primary/40 transition cursor-pointer"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <span className="grid place-items-center w-8 h-8 rounded-full bg-linear-to-br from-primary-light to-primary-dark text-white text-xs font-bold">
                  {initials(user.name)}
                </span>
                <span className="text-sm font-medium text-ink max-w-[9rem] truncate">
                  {user.name}
                </span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-ink/50 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-[var(--shadow-soft)] border border-primary/10 overflow-hidden animate-fade-up"
                  style={{ animationDuration: "0.2s" }}
                >
                  <div className="px-4 py-3 bg-blush-soft border-b border-primary/10">
                    <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
                    <p className="text-xs text-ink/60 truncate">{user.email}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold tracking-wider text-primary bg-blush px-2 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  </div>
                  <div className="p-1.5">
                    <MenuLink href={dashboardHref} icon={user.role === "PATIENT" ? CalendarClockIcon : DashboardIcon}>
                      {user.role === "PATIENT" ? "My Appointments" : "Dashboard"}
                    </MenuLink>
                    {user.role === "PATIENT" && (
                      <MenuLink href="/settings" icon={SettingsIcon}>
                        Settings
                      </MenuLink>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-primary hover:bg-blush transition cursor-pointer"
                    >
                      <LogoutIcon className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden grid place-items-center w-10 h-10 rounded-xl text-primary-dark hover:bg-blush transition cursor-pointer"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
          mobileOpen ? "max-h-[28rem]" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4 pt-1 flex flex-col gap-1 bg-white/95 border-t border-primary/10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive(pathname, link.href) ? "bg-primary text-white" : "text-ink hover:bg-blush"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-primary/10 my-2" />
          {!user ? (
            <div className="grid grid-cols-2 gap-2">
              <Link href="/login" className="text-center py-2.5 rounded-xl text-sm font-semibold text-primary border border-primary/30">
                Log in
              </Link>
              <Link href="/register" className="text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-primary">
                Get Started
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-blush cursor-pointer"
            >
              <LogoutIcon className="w-4 h-4" /> Log out ({user.name})
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuLink({ href, icon: Icon, children }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-ink hover:bg-blush hover:text-primary transition"
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );
}
