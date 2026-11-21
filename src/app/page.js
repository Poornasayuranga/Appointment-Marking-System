import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarClockIcon,
  CheckCircleIcon,
  ClockIcon,
  FileIcon,
  HeartPulseIcon,
  SearchIcon,
  ShieldIcon,
  StethoscopeIcon,
  BellIcon,
} from "@/components/Icons";

const STATS = [
  { value: "50+", label: "Specialist doctors" },
  { value: "10k+", label: "Appointments booked" },
  { value: "24/7", label: "Online booking" },
  { value: "4.9★", label: "Patient rating" },
];

const FEATURES = [
  {
    icon: SearchIcon,
    title: "Find the right specialist",
    text: "Search by name or specialty and compare qualifications and experience at a glance.",
  },
  {
    icon: CalendarClockIcon,
    title: "Real-time availability",
    text: "See open slots instantly and lock in a time. No phone calls, no waiting on hold.",
  },
  {
    icon: BellIcon,
    title: "Track every status",
    text: "Follow each booking from pending to confirmed to completed, all in one dashboard.",
  },
  {
    icon: FileIcon,
    title: "Your records, organised",
    text: "Completed visits are kept as a timeline you can revisit whenever you need.",
  },
];

const STEPS = [
  { title: "Create your account", text: "Sign up in under a minute with your name, email and phone." },
  { title: "Choose a doctor & slot", text: "Browse specialists and pick a time that fits your day." },
  { title: "Get confirmed", text: "Your doctor confirms the visit and it shows up in your dashboard." },
];

const SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "General Medicine",
  "ENT",
  "Gynecology",
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ---------- Hero ---------- */}
      <section
        className="relative min-h-[100svh] flex items-center bg-cover bg-[position:72%_center] md:bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        {/* Wash so the copy stays readable over the photo */}
        <div className="absolute inset-0 bg-linear-to-r from-[#fcf4f3] via-[#fcf4f3]/85 to-transparent md:via-[#fcf4f3]/60" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-primary-dark/25 to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-36">
          <div className="max-w-xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-primary/15 px-3 py-1.5 text-xs font-semibold text-primary-dark shadow-sm backdrop-blur">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
              </span>
              Doctors available today
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.08]">
              Book your doctor <br className="hidden sm:block" />
              appointment{" "}
              <span className="relative inline-block text-primary">
                easily
                <svg
                  className="absolute -bottom-2 left-0 w-full text-primary/35"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 9C50 3 150 3 198 9" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-semibold text-primary-dark">
              Your health, our priority.
            </p>
            <p className="mt-3 text-base sm:text-lg text-ink/70 max-w-lg">
              Find trusted doctors, check live availability and secure your visit in a few clicks.
              The first step to better health starts here.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/doctors"
                className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-primary to-primary-dark px-7 py-3.5 text-white font-semibold shadow-[var(--shadow-glow)] hover:brightness-110 transition"
              >
                Book Appointment
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-primary/20 px-7 py-3.5 text-primary-dark font-semibold hover:bg-white hover:border-primary/40 transition backdrop-blur"
              >
                Create free account
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink/70">
              {["No booking fees", "Instant confirmation", "Secure & private"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-primary" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Floating confirmation card */}
        <div className="hidden lg:block absolute right-[30%] xl:right-[33%] bottom-48 animate-float">
          <div className="flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white px-4 py-3 shadow-[var(--shadow-soft)]">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-green-100 text-green-600">
              <CheckCircleIcon className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Appointment confirmed</p>
              <p className="text-xs text-ink/60">Cardiology · Tomorrow, 9:30 AM</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Stats strip (overlaps hero) ---------- */}
      <section className="relative z-10 -mt-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 rounded-3xl bg-white shadow-[var(--shadow-soft)] border border-primary/10 divide-x divide-y md:divide-y-0 divide-primary/10 overflow-hidden">
          {STATS.map((s) => (
            <div key={s.label} className="px-6 py-7 text-center">
              <p className="text-3xl font-extrabold bg-linear-to-br from-primary to-primary-dark bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-sm text-ink/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Why MediBook</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            Healthcare that fits around your life
          </h2>
          <p className="mt-3 text-ink/60">
            Everything you need to manage appointments, from first search to follow-up.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group relative rounded-3xl bg-white border border-primary/10 p-6 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] hover:border-primary/25 transition-all duration-300"
            >
              <span className="grid place-items-center w-12 h-12 rounded-2xl bg-blush text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon className="w-6 h-6" />
              </span>
              <h3 className="mt-5 font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-ink/60 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="bg-blush/60 border-y border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">How it works</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              From search to consultation in three steps
            </h2>
            <ol className="mt-10 flex flex-col gap-6">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="shrink-0 grid place-items-center w-11 h-11 rounded-full bg-primary text-white font-bold shadow-[var(--shadow-glow)]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-ink">{step.title}</h3>
                    <p className="text-sm text-ink/60 mt-1">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Illustrative dashboard preview */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-linear-to-br from-primary/20 to-transparent blur-2xl" />
            <div className="relative rounded-3xl bg-white border border-primary/10 shadow-[var(--shadow-soft)] p-6">
              <div className="flex items-center justify-between">
                <p className="font-bold text-ink">Upcoming appointments</p>
                <span className="text-xs font-semibold text-primary bg-blush px-2.5 py-1 rounded-full">This week</span>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                {[
                  { day: "02", mon: "Sep", doc: "Cardiology consultation", time: "09:00 – 09:30", status: "Confirmed", ok: true },
                  { day: "04", mon: "Sep", doc: "Dermatology check-up", time: "15:00 – 15:30", status: "Pending", ok: false },
                  { day: "05", mon: "Sep", doc: "Pediatric visit", time: "11:00 – 11:30", status: "Confirmed", ok: true },
                ].map((row) => (
                  <div key={row.day} className="flex items-center gap-4 rounded-2xl border border-primary/10 p-3">
                    <div className="w-12 h-12 rounded-xl bg-blush text-primary-dark grid place-content-center text-center">
                      <span className="font-bold leading-none">{row.day}</span>
                      <span className="text-[10px] font-semibold uppercase">{row.mon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{row.doc}</p>
                      <p className="text-xs text-ink/55 inline-flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" /> {row.time}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        row.ok ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Specialties ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Specialties</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Care across every department
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {SPECIALTIES.map((s) => (
            <Link
              key={s}
              href="/doctors"
              className="inline-flex items-center gap-2 rounded-full bg-white border border-primary/15 px-5 py-2.5 text-sm font-medium text-ink/80 hover:bg-primary hover:text-white hover:border-primary hover:shadow-[var(--shadow-glow)] transition"
            >
              <StethoscopeIcon className="w-4 h-4" /> {s}
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- CTA banner ---------- */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="relative max-w-6xl mx-auto overflow-hidden rounded-[2rem] bg-linear-to-br from-primary via-[#a02020] to-primary-dark px-8 py-14 sm:px-14 text-white">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute right-24 -bottom-24 w-56 h-56 rounded-full bg-white/5" />
          <HeartPulseIcon className="absolute right-10 top-10 w-24 h-24 text-white/10 hidden sm:block" />
          <div className="relative max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to take care of your health?</h2>
            <p className="mt-3 text-white/80">
              Join thousands of patients who book smarter. It&apos;s free and takes less than a minute.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-full bg-white px-7 py-3.5 font-semibold text-primary-dark hover:bg-blush transition"
              >
                Get started now
              </Link>
              <Link
                href="/doctors"
                className="rounded-full border border-white/40 px-7 py-3.5 font-semibold text-white hover:bg-white/10 transition"
              >
                Browse doctors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="bg-[#2a1414] text-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-white">
                <HeartPulseIcon className="w-5 h-5" />
              </span>
              <span className="font-bold text-white">
                Medi<span className="text-primary-light">Book</span>
              </span>
            </div>
            <p className="mt-4 text-sm max-w-sm">
              A simple, secure way to connect patients with trusted doctors and manage appointments online.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs">
              <ShieldIcon className="w-4 h-4 text-primary-light" /> Your data stays private and secure.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Patients</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/doctors" className="hover:text-white">Find doctors</Link></li>
              <li><Link href="/appointments" className="hover:text-white">My appointments</Link></li>
              <li><Link href="/records" className="hover:text-white">My records</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Account</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white">Log in</Link></li>
              <li><Link href="/register" className="hover:text-white">Register</Link></li>
              <li><Link href="/settings" className="hover:text-white">Settings</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs">
          © {new Date().getFullYear()} MediBook Appointment System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
