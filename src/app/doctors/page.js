"use client";

import { useEffect, useState } from "react";
import { getDoctors } from "@/lib/api";
import DoctorCard from "@/components/DoctorCard";
import { PageHeader, EmptyState } from "@/components/PatientUI";
import { StethoscopeIcon, SearchIcon } from "@/components/Icons";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [specializations, setSpecializations] = useState([]);
  // Results remember which query produced them, so loading is derived rather than set in the effect.
  const [results, setResults] = useState({ key: null, doctors: [] });

  const queryKey = `${search}|${specialization}`;
  const isLoading = results.key !== queryKey;

  useEffect(() => {
    getDoctors().then((all) => {
      setSpecializations([...new Set(all.map((d) => d.specialization))].sort());
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    getDoctors({ search, specialization }).then((doctors) => {
      if (!cancelled) setResults({ key: `${search}|${specialization}`, doctors });
    });
    return () => {
      cancelled = true;
    };
  }, [search, specialization]);

  const doctors = results.doctors;

  return (
    <div className="animate-fade-up">
      <PageHeader
        icon={StethoscopeIcon}
        title="Find a Doctor"
        subtitle="Browse specialists and book a time that works for you."
      />

      <div className="rounded-3xl bg-white border border-primary/10 p-4 sm:p-5 mb-6">
        <label className="relative block">
          <span className="sr-only">Search doctors</span>
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60" />
          <input
            type="text"
            placeholder="Search by name or specialization (e.g. Cardiologist)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-primary/15 bg-blush-soft/60 pl-12 pr-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          />
        </label>

        {specializations.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip active={specialization === ""} onClick={() => setSpecialization("")}>
              All
            </Chip>
            {specializations.map((s) => (
              <Chip key={s} active={specialization === s} onClick={() => setSpecialization(s)}>
                {s}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {!isLoading && (
        <p className="text-sm text-ink/60 mb-4">
          {doctors.length} doctor{doctors.length === 1 ? "" : "s"} found
        </p>
      )}

      {isLoading && results.key === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 rounded-3xl bg-white border border-primary/10 animate-pulse" />
          ))}
        </div>
      ) : doctors.length === 0 && !isLoading ? (
        <EmptyState
          icon={SearchIcon}
          title="No doctors match your search"
          message="Try a different name or specialization, or clear the filters."
        />
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${
            isLoading ? "opacity-60" : ""
          }`}
        >
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
        active
          ? "bg-primary text-white border-primary shadow-[var(--shadow-glow)]"
          : "bg-white text-ink/70 border-primary/15 hover:border-primary/40 hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
