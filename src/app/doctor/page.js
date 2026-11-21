"use client";

import { useEffect, useState } from "react";
import {
  getAppointmentsForDoctor,
  updateAppointmentStatus,
  getAvailabilityForDoctor,
  addAvailability,
  deleteAvailability,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";

function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSlot, setNewSlot] = useState({ date: "", startTime: "", endTime: "" });

  async function loadData() {
    setIsLoading(true);
    const [appointmentData, slotData] = await Promise.all([
      getAppointmentsForDoctor(user.doctorId),
      getAvailabilityForDoctor(user.doctorId),
    ]);
    setAppointments(appointmentData);
    setSlots(slotData);
    setIsLoading(false);
  }

  useEffect(() => {
    Promise.all([
      getAppointmentsForDoctor(user.doctorId),
      getAvailabilityForDoctor(user.doctorId),
    ]).then(([appointmentData, slotData]) => {
      setAppointments(appointmentData);
      setSlots(slotData);
      setIsLoading(false);
    });
  }, [user.doctorId]);

  async function handleStatusChange(id, status) {
    await updateAppointmentStatus(id, status);
    loadData();
  }

  async function handleAddSlot(e) {
    e.preventDefault();
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) return;
    await addAvailability(user.doctorId, newSlot);
    setNewSlot({ date: "", startTime: "", endTime: "" });
    loadData();
  }

  async function handleDeleteSlot(id) {
    await deleteAvailability(id);
    loadData();
  }

  if (isLoading) return <p className="text-gray-500">Loading...</p>;

  const pending = appointments.filter((a) => a.status === "PENDING");
  const others = appointments.filter((a) => a.status !== "PENDING");

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-xl font-semibold mb-3">Pending Appointments</h2>
        {pending.length === 0 && <p className="text-gray-500 text-sm">No pending appointments.</p>}
        <div className="flex flex-col gap-3">
          {pending.map((a) => (
            <div key={a.id} className="border rounded-lg p-4 bg-white flex justify-between items-center">
              <div>
                <p className="font-medium">{a.patientName}</p>
                <p className="text-sm text-gray-600">{a.date} at {a.startTime} - {a.endTime}</p>
                {a.reason && <p className="text-sm text-gray-500">Reason: {a.reason}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(a.id, "CONFIRMED")}
                  className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusChange(a.id, "REJECTED")}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Other Appointments</h2>
        {others.length === 0 && <p className="text-gray-500 text-sm">No other appointments.</p>}
        <div className="flex flex-col gap-3">
          {others.map((a) => (
            <div key={a.id} className="border rounded-lg p-4 bg-white flex justify-between items-center">
              <div>
                <p className="font-medium">{a.patientName}</p>
                <p className="text-sm text-gray-600">{a.date} at {a.startTime} - {a.endTime}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={a.status} />
                {a.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleStatusChange(a.id, "COMPLETED")}
                    className="bg-primary text-white text-sm px-3 py-1 rounded hover:bg-primary-dark"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Manage Availability</h2>

        <form onSubmit={handleAddSlot} className="flex flex-wrap gap-3 items-end mb-4 bg-white border rounded-lg p-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={newSlot.date}
              onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              value={newSlot.startTime}
              onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              value={newSlot.endTime}
              onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
          </div>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
            Add Slot
          </button>
        </form>

        <div className="flex flex-col gap-2">
          {slots.map((slot) => (
            <div key={slot.id} className="border rounded-lg p-3 bg-white flex justify-between items-center text-sm">
              <span>
                {slot.date} | {slot.startTime} - {slot.endTime}{" "}
                {slot.booked ? (
                  <span className="text-gray-500">(booked)</span>
                ) : (
                  <span className="text-green-600">(free)</span>
                )}
              </span>
              {!slot.booked && (
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function DoctorPage() {
  return (
    <ProtectedRoute role="DOCTOR">
      <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
      <DoctorDashboard />
    </ProtectedRoute>
  );
}
