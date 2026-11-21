import Link from "next/link";
import { ArrowRightIcon, ShieldIcon, ClockIcon } from "@/components/Icons";

export function doctorInitials(name = "") {
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function DoctorCard({ doctor }) {
  return (
    <Link
      href={`/doctors/${doctor.id}`}
      className="group flex flex-col rounded-3xl bg-white border border-primary/10 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-center gap-4">
        <span className="shrink-0 grid place-items-center w-14 h-14 rounded-2xl bg-linear-to-br from-primary-light to-primary-dark text-white text-lg font-bold shadow-[var(--shadow-glow)]">
          {doctorInitials(doctor.name)}
        </span>
        <div className="min-w-0">
          <h3 className="font-bold text-ink truncate">{doctor.name}</h3>
          <span className="inline-block mt-1 text-[11px] font-semibold text-primary bg-blush px-2.5 py-0.5 rounded-full">
            {doctor.specialization}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 text-sm text-ink/60">
        {doctor.qualification && (
          <span className="inline-flex items-center gap-2">
            <ShieldIcon className="w-4 h-4 text-primary/70" />
            <span className="truncate">{doctor.qualification}</span>
          </span>
        )}
        <span className="inline-flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-primary/70" />
          {doctor.experience} years of experience
        </span>
      </div>

      <span className="mt-5 pt-4 border-t border-primary/10 flex items-center justify-between text-sm font-semibold text-primary">
        View profile & book
        <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
