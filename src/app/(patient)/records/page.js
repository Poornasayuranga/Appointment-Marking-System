"use client";

import { useEffect, useState } from "react";
import { getPatientRecords } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PageHeader, EmptyState, LoadingCards } from "@/components/PatientUI";
import { FileIcon, UserIcon, StethoscopeIcon, CalendarIcon, ClockIcon } from "@/components/Icons";

export default function RecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPatientRecords(user.id).then((data) => {
      setRecords(data);
      setIsLoading(false);
    });
  }, [user.id]);

  const doctorsSeen = new Set(records.map((r) => r.doctorId)).size;
  const lastVisit = records[0]?.date;

  return (
    <div className="animate-fade-up">
      <PageHeader icon={FileIcon} title="Medical Records" subtitle="Your profile and completed visit records." />

      {/* Patient summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 rounded-3xl bg-white border border-primary/10 p-6 flex items-start gap-4">
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-blush text-primary shrink-0">
            <UserIcon className="w-7 h-7" />
          </span>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm flex-1">
            <Field label="Full name" value={user.name} />
            <Field label="Email" value={user.email} />
            <Field label="Contact number" value={user.contactNumber || "—"} />
            <Field label="Patient ID" value={user.id} />
          </dl>
        </div>
        <div className="rounded-3xl bg-linear-to-br from-primary to-primary-dark text-white p-6 flex flex-col justify-between">
          <p className="text-xs uppercase tracking-widest text-white/70 font-semibold">Summary</p>
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-3xl font-bold">{records.length}</p>
              <p className="text-xs text-white/75">Visits</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{doctorsSeen}</p>
              <p className="text-xs text-white/75">Doctors</p>
            </div>
          </div>
          <p className="text-xs text-white/75 mt-4">Last visit: {lastVisit || "none yet"}</p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-ink mb-4">Visit records</h2>

      {isLoading ? (
        <LoadingCards count={2} />
      ) : records.length === 0 ? (
        <EmptyState
          icon={FileIcon}
          title="No records yet"
          message="A record is added here each time a doctor marks one of your appointments as completed."
          ctaHref="/doctors"
          ctaLabel="Book a visit"
        />
      ) : (
        <ol className="relative border-l-2 border-blush ml-3 flex flex-col gap-5">
          {records.map((r) => (
            <li key={r.id} className="pl-6 relative">
              <span className="absolute -left-[9px] top-5 w-4 h-4 rounded-full bg-primary ring-4 ring-blush" />
              <div className="rounded-2xl bg-white border border-primary/10 p-5 hover:shadow-[var(--shadow-soft)] transition">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-ink">{r.doctorName}</p>
                  <span className="text-xs font-semibold text-primary bg-blush px-2.5 py-1 rounded-full">
                    {r.specialization}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/60">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" /> {r.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4" /> {r.startTime} – {r.endTime}
                  </span>
                  {r.qualification && (
                    <span className="inline-flex items-center gap-1.5">
                      <StethoscopeIcon className="w-4 h-4" /> {r.qualification}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-ink/70">
                  <span className="font-medium text-ink">Reason for visit:</span> {r.reason || "Not specified"}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-ink/50">{label}</dt>
      <dd className="font-medium text-ink truncate">{value}</dd>
    </div>
  );
}
