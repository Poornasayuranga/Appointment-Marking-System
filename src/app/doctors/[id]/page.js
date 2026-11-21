"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getDoctorById, getAvailabilityForDoctor, bookAppointment } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { doctorInitials } from "@/components/DoctorCard";
import { EmptyState } from "@/components/PatientUI";
import {
  CalendarIcon,
  CalendarClockIcon,
  ClockIcon,
  ShieldIcon,
  UserIcon,
  CheckCircleIcon,
  StethoscopeIcon,
} from "@/components/Icons";

function formatDay(date) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function groupByDate(slots) {
  const groups = {};
  for (const slot of slots) (groups[slot.date] ||= []).push(slot);
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => [date, items.sort((x, y) => x.startTime.localeCompare(y.startTime))]);
}

export default function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    Promise.all([getDoctorById(id), getAvailabilityForDoctor(id, { onlyFree: true })])
      .then(([doctorData, slotData]) => {
        setDoctor(doctorData);
        setSlots(slotData);
      })
      .catch(() => setDoctor(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleBook() {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "PATIENT") {
      setStatus({ ok: false, message: "Only patients can book appointments." });
      return;
    }

    setIsBooking(true);
    setStatus(null);
    try {
      await bookAppointment({ patient: user, doctor, availabilitySlot: selectedSlot, reason });
      setStatus({
        ok: true,
        message: "Appointment booked! It is now pending the doctor's confirmation.",
      });
      setSelectedSlot(null);
      setReason("");
      setSlots(await getAvailabilityForDoctor(id, { onlyFree: true }));
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    } finally {
      setIsBooking(false);
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 rounded-3xl bg-white border border-primary/10 animate-pulse" />
        <div className="lg:col-span-2 h-80 rounded-3xl bg-white border border-primary/10 animate-pulse" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <EmptyState
        icon={StethoscopeIcon}
        title="Doctor not found"
        message="This profile may have been removed. Browse other specialists instead."
        ctaHref="/doctors"
        ctaLabel="Back to doctors"
      />
    );
  }

  const groups = groupByDate(slots);

  return (
    <div className="animate-fade-up">
      <Link href="/doctors" className="inline-block mb-5 text-sm font-semibold text-primary-dark hover:text-primary">
        ← All doctors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile */}
        <aside className="rounded-3xl bg-white border border-primary/10 overflow-hidden lg:sticky lg:top-24">
          <div className="h-20 bg-linear-to-br from-primary to-primary-dark" />
          <div className="px-6 pb-6 -mt-10">
            <span className="grid place-items-center w-20 h-20 rounded-3xl bg-white p-1.5 shadow-[var(--shadow-soft)]">
              <span className="grid place-items-center w-full h-full rounded-2xl bg-linear-to-br from-primary-light to-primary-dark text-white text-2xl font-bold">
                {doctorInitials(doctor.name)}
              </span>
            </span>
            <h1 className="mt-4 text-2xl font-bold text-ink tracking-tight">{doctor.name}</h1>
            <span className="inline-block mt-1.5 text-xs font-semibold text-primary bg-blush px-2.5 py-1 rounded-full">
              {doctor.specialization}
            </span>

            <dl className="mt-5 flex flex-col gap-3 text-sm">
              {doctor.qualification && (
                <InfoRow icon={ShieldIcon} label="Qualification" value={doctor.qualification} />
              )}
              <InfoRow icon={ClockIcon} label="Experience" value={`${doctor.experience} years`} />
              {doctor.contactNumber && (
                <InfoRow icon={UserIcon} label="Contact" value={doctor.contactNumber} />
              )}
            </dl>

            {doctor.description && (
              <p className="mt-5 pt-5 border-t border-primary/10 text-sm text-ink/70 leading-relaxed">
                {doctor.description}
              </p>
            )}
          </div>
        </aside>

        {/* Booking */}
        <section className="lg:col-span-2 rounded-3xl bg-white border border-primary/10 p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-blush text-primary">
              <CalendarClockIcon className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-bold text-ink">Book an appointment</h2>
              <p className="text-xs text-ink/60">Pick an available time slot below.</p>
            </div>
          </div>

          {status && (
            <div
              className={`mb-5 flex items-start gap-2 text-sm rounded-2xl px-4 py-3 ${
                status.ok ? "bg-green-50 text-green-700" : "bg-blush text-primary-dark"
              }`}
            >
              {status.ok && <CheckCircleIcon className="w-5 h-5 shrink-0" />}
              <span>
                {status.message}
                {status.ok && (
                  <>
                    {" "}
                    <Link href="/appointments" className="font-semibold underline">
                      View my appointments
                    </Link>
                  </>
                )}
              </span>
            </div>
          )}

          {groups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-primary/25 px-6 py-10 text-center">
              <CalendarIcon className="w-8 h-8 mx-auto text-primary/60" />
              <p className="mt-3 font-semibold text-ink">No open slots right now</p>
              <p className="text-sm text-ink/60 mt-1">Check back later. New times are added regularly.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {groups.map(([date, daySlots]) => (
                <div key={date}>
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    {formatDay(date)}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {daySlots.map((slot) => {
                      const active = selectedSlot?.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(active ? null : slot)}
                          aria-pressed={active}
                          className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition cursor-pointer ${
                            active
                              ? "bg-primary text-white border-primary shadow-[var(--shadow-glow)]"
                              : "bg-blush-soft/60 text-ink border-primary/15 hover:border-primary/40 hover:bg-white"
                          }`}
                        >
                          {slot.startTime} – {slot.endTime}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSlot && (
            <div className="mt-6 pt-6 border-t border-primary/10 flex flex-col gap-4 animate-fade-up" style={{ animationDuration: "0.3s" }}>
              <div className="rounded-2xl bg-blush-soft border border-primary/10 px-4 py-3 text-sm">
                <p className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Your selection</p>
                <p className="mt-1 font-semibold text-ink">
                  {formatDay(selectedSlot.date)} · {selectedSlot.startTime} – {selectedSlot.endTime}
                </p>
                <p className="text-ink/60">with {doctor.name}</p>
              </div>
              <div>
                <label htmlFor="reason" className="block text-xs font-semibold text-ink/70 mb-1.5">
                  Reason for visit <span className="font-normal text-ink/50">(optional)</span>
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Briefly describe your symptoms or the purpose of the visit"
                  className="w-full rounded-xl border border-primary/15 bg-blush-soft/60 px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <button
                type="button"
                onClick={handleBook}
                disabled={isBooking}
                className="self-start px-6 py-3 rounded-full bg-linear-to-r from-primary to-primary-dark text-white text-sm font-semibold shadow-[var(--shadow-glow)] hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
              >
                {isBooking ? "Booking..." : user ? "Confirm booking" : "Log in to book"}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid place-items-center w-9 h-9 rounded-xl bg-blush text-primary shrink-0">
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink/50">{label}</dt>
        <dd className="text-ink font-medium truncate">{value}</dd>
      </div>
    </div>
  );
}
