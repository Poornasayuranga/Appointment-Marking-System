import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { CalendarIcon, ClockIcon } from "@/components/Icons";

export function PageHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        {Icon && (
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-primary-dark text-white shadow-[var(--shadow-glow)]">
            <Icon className="w-6 h-6" />
          </span>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-ink/60 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message, ctaHref, ctaLabel }) {
  return (
    <div className="rounded-3xl border border-dashed border-primary/25 bg-white px-6 py-14 text-center">
      {Icon && (
        <span className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-blush text-primary mb-4">
          <Icon className="w-7 h-7" />
        </span>
      )}
      <p className="font-semibold text-ink">{title}</p>
      <p className="text-sm text-ink/60 mt-1 max-w-sm mx-auto">{message}</p>
      {ctaHref && (
        <Link
          href={ctaHref}
          className="inline-block mt-5 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark shadow-[var(--shadow-glow)] transition"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

export function LoadingCards({ count = 3 }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-white border border-primary/10 animate-pulse" />
      ))}
    </div>
  );
}

function formatDate(date) {
  const d = new Date(date + "T00:00:00");
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" }),
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
  };
}

export function AppointmentCard({ appointment: a, actions, muted = false }) {
  const { day, month, weekday } = formatDate(a.date);
  return (
    <div
      className={`group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border bg-white p-4 transition-all hover:shadow-[var(--shadow-soft)] ${
        muted ? "border-ink/10" : "border-primary/10 hover:border-primary/25"
      }`}
    >
      <div
        className={`shrink-0 w-16 h-16 rounded-2xl grid place-content-center text-center ${
          muted ? "bg-ink/5 text-ink/60" : "bg-blush text-primary-dark"
        }`}
      >
        <span className="text-xl font-bold leading-none">{day}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider mt-1">{month}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-ink">{a.doctorName}</p>
          <StatusBadge status={a.status} />
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/60">
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4" /> {weekday}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="w-4 h-4" /> {a.startTime} – {a.endTime}
          </span>
        </div>
        {a.reason && <p className="mt-1 text-sm text-ink/50 truncate">Reason: {a.reason}</p>}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
