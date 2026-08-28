import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-3xl font-bold mb-4">Book Doctor Appointments Online</h1>
      <p className="text-gray-600 max-w-xl mx-auto mb-8">
        Search for doctors by specialization, check their available time slots,
        and book your appointment in a few clicks.
      </p>
      <Link
        href="/doctors"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Find a Doctor
      </Link>
    </div>
  );
}
