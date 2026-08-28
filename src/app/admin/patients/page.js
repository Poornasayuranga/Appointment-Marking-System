"use client";

import { useEffect, useState } from "react";
import { getAllPatients } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllPatients().then((data) => {
      setPatients(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Contact Number</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.email}</td>
              <td className="px-4 py-2">{p.contactNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {patients.length === 0 && <p className="p-4 text-gray-500">No patients yet.</p>}
    </div>
  );
}

export default function AdminPatientsPage() {
  return (
    <ProtectedRoute role="ADMIN">
      <h1 className="text-2xl font-bold mb-6">Patients</h1>
      <PatientsList />
    </ProtectedRoute>
  );
}
