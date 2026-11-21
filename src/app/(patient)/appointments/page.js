"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAppointmentsForPatient, cancelAppointment } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PageHeader, EmptyState, LoadingCards, AppointmentCard } from "@/components/PatientUI";
import { CalendarClockIcon, ClockIcon, CheckCircleIcon, BellIcon } from "@/components/Icons";

function isUpcoming(a, today) {
  return a.date >= today && a.status !== "CANCELLED" && a.status !== "COMPLETED" && a.status !== "REJECTED";
}

export default function UpcomingAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  async function loadAppointments() {
    const data = await getAppointmentsForPatient(user.id);
    setAppointments(data);
    setIsLoading(false);
  }

  useEffect(() => {
    getAppointmentsForPatient(user.id).then((data) => {
      setAppointments(data);
      setIsLoading(false);
    });
  }, [user.id]);

  async function handleCancel(id) {
    if (!window.confirm("Cancel this appointment? The slot will be released.")) return;
    setCancellingId(id);
    await cancelAppointment(id);
    await loadAppointments();
    setCancellingId(null);
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = appointments.filter((a) => isUpcoming(a, today));
  const confirmed = upcoming.filter((a) => a.status === "CONFIRMED").length;
  const pending = upcoming.filter((a) => a.status === "PENDING").length;

  return (
    <div className="animate-fade-up">
      <PageHeader
        icon={CalendarClockIcon}
        title="Upcoming Appointments"
        subtitle="Stay on top of your scheduled visits."
        action={
          <Link
            href="/doctors"
            className="px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark shadow-[var(--shadow-glow)] transition"
          >
            + New appointment
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <StatTile icon={BellIcon} label="Upcoming" value={upcoming.length} />
        <StatTile icon={CheckCircleIcon} label="Confirmed" value={confirmed} />
        <StatTile icon={ClockIcon} label="Awaiting doctor" value={pending} />
      </div>

      {isLoading ? (
        <LoadingCards />
      ) : upcoming.length === 0 ? (
        <EmptyState
          icon={CalendarClockIcon}
          title="No upcoming appointments"
          message="You don't have any visits scheduled. Find a doctor and book a time that suits you."
          ctaHref="/doctors"
          ctaLabel="Find a doctor"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              actions={
                <button
                  onClick={() => handleCancel(a.id)}
                  disabled={cancellingId === a.id}
                  className="px-3.5 py-2 rounded-xl text-sm font-semibold text-primary border border-primary/25 hover:bg-primary hover:text-white transition disabled:opacity-50 cursor-pointer"
                >
                  {cancellingId === a.id ? "Cancelling..." : "Cancel"}
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white border border-primary/10 p-4">
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-blush text-primary">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <p className="text-2xl font-bold text-ink leading-none">{value}</p>
        <p className="text-xs text-ink/60 mt-1">{label}</p>
      </div>
    </div>
  );
}
