"use client";

import { useEffect, useState } from "react";
import { getDoctors } from "@/lib/api";
import DoctorCard from "@/components/DoctorCard";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getDoctors({ search }).then((data) => {
      setDoctors(data);
      setIsLoading(false);
    });
  }, [search]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Find a Doctor</h1>

      <input
        type="text"
        placeholder="Search by name or specialization (e.g. Cardiologist)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-6"
      />

      {isLoading && <p className="text-gray-500">Loading doctors...</p>}

      {!isLoading && doctors.length === 0 && (
        <p className="text-gray-500">No doctors found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
