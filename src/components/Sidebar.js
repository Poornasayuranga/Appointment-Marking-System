"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  CalendarClockIcon,
  HistoryIcon,
  FileIcon,
  SettingsIcon,
  CloseIcon,
  StethoscopeIcon,
  ArrowRightIcon,
} from "@/components/Icons";

export const PATIENT_NAV = [
  {
    href: "/appointments",
    label: "Upcoming Appointments",
    hint: "Your next visits",
    icon: CalendarClockIcon,
  },
  {
    href: "/appointments/history",
    label: "Appointment History",
    hint: "Past & cancelled",
    icon: HistoryIcon,
  },
  { href: "/records", label: "My Records", hint: "Completed visits", icon: FileIcon },
  { href: "/settings", label: "Settings", hint: "Profile & security", icon: SettingsIcon },
];

function SidebarContent({ onNavigate }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Profile card */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary to-primary-dark p-5 text-white">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -right-2 bottom-[-2.5rem] w-20 h-20 rounded-full bg-white/10" />
        <p className="text-xs uppercase tracking-widest text-white/70 font-semibold">Patient Portal</p>
        <p className="mt-1 text-lg font-bold truncate">{user?.name}</p>
        <p className="text-xs text-white/75 truncate">{user?.email}</p>
      </div>

      <nav className="mt-5 flex flex-col gap-1" aria-label="Patient navigation">
        {PATIENT_NAV.map(({ href, label, hint, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                active
                  ? "bg-blush text-primary-dark"
                  : "text-ink/75 hover:bg-blush-soft hover:text-primary"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" />
              )}
              <span
                className={`grid place-items-center w-9 h-9 rounded-lg transition-colors ${
                  active
                    ? "bg-primary text-white shadow-[var(--shadow-glow)]"
                    : "bg-white border border-primary/10 text-primary group-hover:border-primary/30"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-[11px] text-ink/50">{hint}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Booking CTA */}
      <div className="mt-auto pt-6">
        <div className="rounded-2xl border border-dashed border-primary/30 bg-blush-soft p-4">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-white text-primary mb-2">
            <StethoscopeIcon className="w-5 h-5" />
          </span>
          <p className="text-sm font-semibold text-ink">Need to see a doctor?</p>
          <p className="text-xs text-ink/60 mb-3">Browse specialists and book a free slot.</p>
          <Link
            href="/doctors"
            onClick={onNavigate}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark px-3 py-2 rounded-lg transition"
          >
            Book appointment <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Desktop: sticky panel. Mobile: off-canvas drawer that slides in from the left.
export default function Sidebar({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 h-[calc(100vh-7.5rem)] rounded-3xl bg-white border border-primary/10 shadow-[var(--shadow-soft)] p-4">
          <SidebarContent />
        </div>
      </aside>

      <div
        className={`lg:hidden fixed inset-0 z-[60] bg-primary-dark/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-[70] w-[85vw] max-w-xs bg-white p-4 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid place-items-center w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer"
          aria-label="Close menu"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </>
  );
}
