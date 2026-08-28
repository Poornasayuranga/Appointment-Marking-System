"use client";

import { useEffect, useState } from "react";
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

const EMPTY_FORM = {
  name: "",
  specialization: "",
  qualification: "",
  experience: "",
  contactNumber: "",
  description: "",
};

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadDoctors() {
    setIsLoading(true);
    const data = await getDoctors();
    setDoctors(data);
    setIsLoading(false);
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, experience: Number(form.experience) || 0 };

    if (editingId) {
      await updateDoctor(editingId, data);
    } else {
      await createDoctor(data);
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    loadDoctors();
  }

  function handleEdit(doctor) {
    setEditingId(doctor.id);
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      contactNumber: doctor.contactNumber,
      description: doctor.description,
    });
  }

  async function handleDelete(id) {
    await deleteDoctor(id);
    loadDoctors();
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-3">
        <h2 className="font-semibold">{editingId ? "Edit Doctor" : "Add New Doctor"}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            placeholder="Specialization"
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            placeholder="Qualification"
            value={form.qualification}
            onChange={(e) => setForm({ ...form, qualification: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Years of Experience"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            className="border rounded px-3 py-2"
          />
        </div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded px-3 py-2"
          rows={2}
        />

        <div className="flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingId ? "Save Changes" : "Add Doctor"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="font-semibold mb-3">All Doctors</h2>
        {isLoading && <p className="text-gray-500">Loading...</p>}
        <div className="flex flex-col gap-3">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="border rounded-lg p-4 bg-white flex justify-between items-center">
              <div>
                <p className="font-medium">{doctor.name}</p>
                <p className="text-sm text-gray-600">{doctor.specialization} - {doctor.experience} yrs</p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => handleEdit(doctor)} className="text-blue-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(doctor.id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDoctorsPage() {
  return (
    <ProtectedRoute role="ADMIN">
      <h1 className="text-2xl font-bold mb-6">Manage Doctors</h1>
      <ManageDoctors />
    </ProtectedRoute>
  );
}
