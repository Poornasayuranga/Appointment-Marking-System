"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDoctorById, getAvailabilityForDoctor, bookAppointment } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const [doctorData, slotData] = await Promise.all([
        getDoctorById(id),
        getAvailabilityForDoctor(id, { onlyFree: true }),
      ]);
      setDoctor(doctorData);
      setSlots(slotData);
      setIsLoading(false);
    }
    load();
  }, [id]);

  async function handleBook() {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "PATIENT") {
      setMessage("Only patients can book appointments.");
      return;
    }

    setIsBooking(true);
    setMessage("");
    try {
      await bookAppointment({
        patient: user,
        doctor,
        availabilitySlot: selectedSlot,
        reason,
      });
      setMessage("Appointment booked successfully! It is now pending doctor confirmation.");
      setSelectedSlot(null);
      setReason("");
      const freshSlots = await getAvailabilityForDoctor(id, { onlyFree: true });
      setSlots(freshSlots);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsBooking(false);
    }
  }

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (!doctor) return <p className="text-gray-500">Doctor not found.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
        <h1 className="text-2xl font-bold">{doctor.name}</h1>
        <p className="text-blue-600 font-medium">{doctor.specialization}</p>
        <p className="text-gray-600 mt-2">{doctor.qualification}</p>
        <p className="text-gray-600">{doctor.experience} years of experience</p>
        <p className="text-gray-600">Contact: {doctor.contactNumber}</p>
        <p className="text-gray-700 mt-3">{doctor.description}</p>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Available Time Slots</h2>

        {slots.length === 0 && (
          <p className="text-gray-500 text-sm">No available slots right now.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {slots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot)}
              className={`border rounded px-3 py-2 text-sm text-left ${
                selectedSlot?.id === slot.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-blue-50"
              }`}
            >
              <div>{slot.date}</div>
              <div>{slot.startTime} - {slot.endTime}</div>
            </button>
          ))}
        </div>

        {selectedSlot && (
          <div className="flex flex-col gap-3">
            <textarea
              placeholder="Reason for visit (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
            <button
              onClick={handleBook}
              disabled={isBooking}
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isBooking
                ? "Booking..."
                : `Confirm Booking for ${selectedSlot.date} at ${selectedSlot.startTime}`}
            </button>
          </div>
        )}

        {message && <p className="text-sm mt-3">{message}</p>}
      </div>
    </div>
  );
}
