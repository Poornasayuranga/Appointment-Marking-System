"use client";

import { useEffect, useState } from "react";
import { getAppointmentsForPatient } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PageHeader, EmptyState, LoadingCards, AppointmentCard } from "@/components/PatientUI";
import { HistoryIcon } from "@/components/Icons";

const FILTERS = ["ALL", "COMPLETED", "CANCELLED", "REJECTED", "MISSED"];

function isPast(a, today) {
  return a.date < today || a.status === "CANCELLED" || a.status === "COMPLETED" || a.status === "REJECTED";
}

// A past-dated appointment that never reached COMPLETED/CANCELLED/REJECTED.
function isMissed(a, today) {
  return a.date < today && (a.status === "PENDING" || a.status === "CONFIRMED");
}

export default function AppointmentHistoryPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    getAppointmentsForPatient(user.id).then((data) => {
      setAppointments(data);
      setIsLoading(false);
    });
  }, [user.id]);

  const today = new Date().toISOString().slice(0, 10);
  const history = appointments.filter((a) => isPast(a, today)).reverse(); // newest first
  const visible = history.filter((a) => {
    if (filter === "ALL") return true;
    if (filter === "MISSED") return isMissed(a, today);
    return a.status === filter;
  });

  return (
    <div className="animate-fade-up">
      <PageHeader
        icon={HistoryIcon}
        title="Appointment History"
        subtitle="Every visit you've had or cancelled."
      />

      <div className="flex flex-wrap gap-2 mb-5" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer ${
              filter === f
                ? "bg-primary text-white shadow-[var(--shadow-glow)]"
                : "bg-white border border-primary/15 text-ink/70 hover:text-primary hover:border-primary/40"
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingCards />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title={filter === "ALL" ? "No history yet" : `No ${filter.toLowerCase()} appointments`}
          message="Past appointments will appear here once their date has passed or they are closed."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((a) => (
            <AppointmentCard key={a.id} appointment={a} muted={a.status !== "COMPLETED"} />
          ))}
        </div>
      )}
    </div>
  );
}
