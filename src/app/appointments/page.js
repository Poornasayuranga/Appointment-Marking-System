"use client";

import { useEffect, useState } from "react";
import { getAppointmentsForPatient, cancelAppointment } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";

function AppointmentsList() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadAppointments() {
    setIsLoading(true);
    const data = await getAppointmentsForPatient(user.id);
    setAppointments(data);
    setIsLoading(false);
  }

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCancel(id) {
    await cancelAppointment(id);
    loadAppointments();
  }

  if (isLoading) return <p className="text-gray-500">Loading appointments...</p>;

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = appointments.filter(
    (a) => a.date >= today && a.status !== "CANCELLED" && a.status !== "COMPLETED"
  );
  const previous = appointments.filter(
    (a) => a.date < today || a.status === "CANCELLED" || a.status === "COMPLETED"
  );

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-xl font-semibold mb-3">Upcoming Appointments</h2>
        {upcoming.length === 0 && <p className="text-gray-500 text-sm">No upcoming appointments.</p>}
        <div className="flex flex-col gap-3">
          {upcoming.map((a) => (
            <div key={a.id} className="border rounded-lg p-4 bg-white flex justify-between items-center">
              <div>
                <p className="font-medium">{a.doctorName}</p>
                <p className="text-sm text-gray-600">{a.date} at {a.startTime} - {a.endTime}</p>
                {a.reason && <p className="text-sm text-gray-500">Reason: {a.reason}</p>}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={a.status} />
                <button
                  onClick={() => handleCancel(a.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Previous Appointments</h2>
        {previous.length === 0 && <p className="text-gray-500 text-sm">No previous appointments.</p>}
        <div className="flex flex-col gap-3">
          {previous.map((a) => (
            <div key={a.id} className="border rounded-lg p-4 bg-white flex justify-between items-center">
              <div>
                <p className="font-medium">{a.doctorName}</p>
                <p className="text-sm text-gray-600">{a.date} at {a.startTime} - {a.endTime}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function PatientAppointmentsPage() {
  return (
    <ProtectedRoute role="PATIENT">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
      <AppointmentsList />
    </ProtectedRoute>
  );
}
