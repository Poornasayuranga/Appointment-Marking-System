"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAppointmentsForPatient } from "@/lib/api";
import {
  CalendarClockIcon,
  HistoryIcon,
  FileIcon,
  SettingsIcon,
  StethoscopeIcon,
  ArrowRightIcon,
} from "@/components/Icons";

// Fired by pages after booking or cancelling so the sidebar badge refreshes.
export const APPOINTMENTS_CHANGED = "appointments-changed";

export function isUpcomingAppointment(a, today = new Date().toISOString().slice(0, 10)) {
  return a.date >= today && !["CANCELLED", "COMPLETED", "REJECTED"].includes(a.status);
}

export const PATIENT_NAV = [
  {
    href: "/appointments",
    label: "Upcoming Appointments",
    short: "Upcoming",
    hint: "View my next visits",
    icon: CalendarClockIcon,
    badge: "upcoming",
  },
  {
    href: "/appointments/history",
    label: "Appointment History",
    short: "History",
    hint: "View my past visits",
    icon: HistoryIcon,
  },
  {
    href: "/records",
    label: "Medical Records",
    short: "Records",
    hint: "View my health records",
    icon: FileIcon,
  },
  {
    href: "/settings",
    label: "Settings",
    short: "Settings",
    hint: "Profile & security",
    icon: SettingsIcon,
  },
];

const HIDDEN_ON = ["/login", "/register"];

// The sidebar is shown to visitors and patients; doctors and admins have their own dashboards.
export function useShowSidebar() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  if (isLoading || HIDDEN_ON.includes(pathname)) return false;
  return !user || user.role === "PATIENT";
}

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

// Live count of upcoming appointments for the nav badge (patients only).
function useUpcomingCount(userId) {
  const pathname = usePathname();
  const [count, setCount] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener(APPOINTMENTS_CHANGED, bump);
    return () => window.removeEventListener(APPOINTMENTS_CHANGED, bump);
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getAppointmentsForPatient(userId).then((list) => {
      if (!cancelled) setCount(list.filter((a) => isUpcomingAppointment(a)).length);
    });
    return () => {
      cancelled = true;
    };
  }, [userId, pathname, tick]);

  return userId ? count : null;
}

// Guests are sent to log in; patients go straight to the page.
function itemHref(user, href) {
  return user ? href : "/login";
}

/* ---------- Desktop: full sidebar ---------- */

function FullSidebar({ user, counts }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-full">
      {user ? (
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary to-primary-dark p-4 text-white">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-10 w-20 h-20 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-3">
            <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-white/20 ring-1 ring-white/30 text-sm font-bold">
              {initials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-white/70 font-semibold">Patient Portal</p>
              <p className="font-bold truncate">{user.name}</p>
              <p className="text-xs text-white/75 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary to-primary-dark p-4 text-white">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
          <p className="relative text-[10px] uppercase tracking-widest text-white/70 font-semibold">Patient Portal</p>
          <p className="relative mt-1 font-bold">Welcome to MediBook</p>
          <p className="relative text-xs text-white/80 mt-0.5">Log in to manage your appointments and records.</p>
          <div className="relative mt-3 grid grid-cols-2 gap-2">
            <Link href="/login" className="text-center rounded-lg bg-white text-primary-dark text-xs font-bold py-2 hover:bg-blush transition">
              Log in
            </Link>
            <Link href="/register" className="text-center rounded-lg bg-white/15 ring-1 ring-white/40 text-white text-xs font-bold py-2 hover:bg-white/25 transition">
              Sign up
            </Link>
          </div>
        </div>
      )}

      <p className="mt-6 mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-ink/40">My Health</p>
      <nav className="flex flex-col gap-1" aria-label="Patient navigation">
        {PATIENT_NAV.map(({ href, label, hint, icon: Icon, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={itemHref(user, href)}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                active ? "bg-blush text-primary-dark" : "text-ink/75 hover:bg-blush-soft hover:text-primary"
              }`}
            >
              {active && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" />}
              <span
                className={`grid place-items-center w-9 h-9 shrink-0 rounded-lg transition-colors ${
                  active
                    ? "bg-primary text-white shadow-[var(--shadow-glow)]"
                    : "bg-white border border-primary/10 text-primary group-hover:border-primary/30"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </span>
              <span className="flex-1 min-w-0 leading-tight">
                <span className="block text-sm font-semibold truncate">{label}</span>
                <span className="block text-[11px] text-ink/50 truncate">{hint}</span>
              </span>
              {badge && counts[badge] > 0 && (
                <span
                  className={`grid place-items-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold ${
                    active ? "bg-primary text-white" : "bg-blush text-primary"
                  }`}
                >
                  {counts[badge]}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <div className="rounded-2xl border border-dashed border-primary/30 bg-blush-soft p-4">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-white text-primary mb-2">
            <StethoscopeIcon className="w-5 h-5" />
          </span>
          <p className="text-sm font-semibold text-ink">Need to see a doctor?</p>
          <p className="text-xs text-ink/60 mb-3">Browse specialists and book a free slot.</p>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark px-3 py-2 rounded-lg transition"
          >
            Book appointment <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Tablet: icon rail ---------- */

function IconRail({ user, counts }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center gap-2 h-full">
      <Link
        href={user ? "/settings" : "/login"}
        title={user ? user.name : "Log in"}
        className="grid place-items-center w-11 h-11 rounded-xl bg-linear-to-br from-primary to-primary-dark text-white text-sm font-bold shadow-[var(--shadow-glow)]"
      >
        {user ? initials(user.name) : <ArrowRightIcon className="w-5 h-5" />}
      </Link>
      <span className="w-8 h-px bg-primary/10 my-2" />
      <nav className="flex flex-col gap-2" aria-label="Patient navigation">
        {PATIENT_NAV.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={itemHref(user, href)}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`group relative grid place-items-center w-11 h-11 rounded-xl transition ${
                active ? "bg-primary text-white shadow-[var(--shadow-glow)]" : "text-primary bg-blush-soft hover:bg-blush"
              }`}
            >
              <Icon className="w-5 h-5" />
              {badge && counts[badge] > 0 && (
                <span className="absolute -top-1 -right-1 grid place-items-center min-w-4 h-4 px-1 rounded-full bg-primary-dark text-white text-[9px] font-bold ring-2 ring-white">
                  {counts[badge]}
                </span>
              )}
              <span className="pointer-events-none absolute left-full ml-3 z-10 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-white opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
      <Link
        href="/doctors"
        aria-label="Book appointment"
        title="Book appointment"
        className="mt-auto grid place-items-center w-11 h-11 rounded-xl border border-dashed border-primary/40 text-primary hover:bg-blush transition"
      >
        <StethoscopeIcon className="w-5 h-5" />
      </Link>
    </div>
  );
}

/* ---------- Mobile: bottom tab bar ---------- */

function BottomTabs({ user, counts }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Patient navigation"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-primary/10 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgb(125_37_37/0.3)]"
    >
      <ul className="grid grid-cols-4">
        {PATIENT_NAV.map(({ href, short, icon: Icon, badge }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={itemHref(user, href)}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                  active ? "text-primary" : "text-ink/55 hover:text-primary"
                }`}
              >
                {active && <span className="absolute top-0 h-0.5 w-10 rounded-b-full bg-primary" />}
                <span className={`relative grid place-items-center w-10 h-7 rounded-full ${active ? "bg-blush" : ""}`}>
                  <Icon className="w-5 h-5" />
                  {badge && counts[badge] > 0 && (
                    <span className="absolute -top-1 right-0 grid place-items-center min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[9px] font-bold ring-2 ring-white">
                      {counts[badge]}
                    </span>
                  )}
                </span>
                {short}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/*
  Global left sidebar (below the fixed 4rem navbar).
  - lg and up : full sidebar, 18rem wide
  - md to lg  : icon rail, 5rem wide
  - below md  : bottom tab bar
  MainContainer adds matching left/bottom padding to the page.
*/
export default function Sidebar() {
  const { user } = useAuth();
  const upcoming = useUpcomingCount(user?.id);
  const counts = { upcoming };

  return (
    <>
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 z-30 w-72 overflow-y-auto bg-white/95 backdrop-blur border-r border-primary/10 p-4">
        <FullSidebar user={user} counts={counts} />
      </aside>

      <aside className="hidden md:block lg:hidden fixed left-0 top-16 bottom-0 z-30 w-20 bg-white/95 backdrop-blur border-r border-primary/10 py-4">
        <IconRail user={user} counts={counts} />
      </aside>

      <BottomTabs user={user} counts={counts} />
    </>
  );
}
