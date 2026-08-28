"use client";

import { useEffect, useState } from "react";
import { getAllAppointments } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";

function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllAppointments().then((data) => {
      setAppointments(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Patient</th>
            <th className="px-4 py-2">Doctor</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="px-4 py-2">{a.patientName}</td>
              <td className="px-4 py-2">{a.doctorName}</td>
              <td className="px-4 py-2">{a.date}</td>
              <td className="px-4 py-2">{a.startTime} - {a.endTime}</td>
              <td className="px-4 py-2"><StatusBadge status={a.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {appointments.length === 0 && <p className="p-4 text-gray-500">No appointments yet.</p>}
    </div>
  );
}

export default function AdminAppointmentsPage() {
  return (
    <ProtectedRoute role="ADMIN">
      <h1 className="text-2xl font-bold mb-6">All Appointments</h1>
      <AllAppointments />
    </ProtectedRoute>
  );
}
