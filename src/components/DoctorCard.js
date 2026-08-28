import Link from "next/link";

export default function DoctorCard({ doctor }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2">
      <h3 className="text-lg font-semibold">{doctor.name}</h3>
      <p className="text-blue-600 text-sm font-medium">{doctor.specialization}</p>
      <p className="text-sm text-gray-600">{doctor.qualification}</p>
      <p className="text-sm text-gray-600">{doctor.experience} years of experience</p>
      <Link
        href={`/doctors/${doctor.id}`}
        className="mt-2 inline-block text-center bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
      >
        View Profile & Book
      </Link>
    </div>
  );
}
