// This file pretends to be a backend API, but really just reads/writes localStorage.
// Every function name matches something in the SRS (register, login, doctors, availability, appointments).
// Later, when the Spring Boot backend is ready, these functions can be replaced with real Axios calls
// without changing the pages that use them.

import { loadData, saveData } from "./storage";
import { seedUsers, seedDoctors, seedAvailability, seedAppointments } from "./seedData";

const KEYS = {
  users: "abs_users",
  doctors: "abs_doctors",
  availability: "abs_availability",
  appointments: "abs_appointments",
};

function getUsers() {
  return loadData(KEYS.users, seedUsers);
}
function getDoctorsRaw() {
  return loadData(KEYS.doctors, seedDoctors);
}
function getAvailabilityRaw() {
  return loadData(KEYS.availability, seedAvailability);
}
function getAppointmentsRaw() {
  return loadData(KEYS.appointments, seedAppointments);
}

function nextId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// A tiny fake network delay so loading states can be seen/tested.
function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), 300));
}

// ---------- Auth ----------

export async function registerPatient({ name, email, password, contactNumber }) {
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const newUser = {
    id: nextId("u"),
    name,
    email,
    password,
    role: "PATIENT",
    contactNumber,
  };

  saveData(KEYS.users, [...users, newUser]);
  return delay(newUser);
}

export async function login({ email, password }) {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  return delay(user);
}

// ---------- Doctors ----------

export async function getDoctors({ search = "", specialization = "" } = {}) {
  let doctors = getDoctorsRaw();

  if (search) {
    const term = search.toLowerCase();
    doctors = doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        d.specialization.toLowerCase().includes(term)
    );
  }

  if (specialization) {
    doctors = doctors.filter((d) => d.specialization === specialization);
  }

  return delay(doctors);
}

export async function getDoctorById(id) {
  const doctor = getDoctorsRaw().find((d) => d.id === id);
  if (!doctor) throw new Error("Doctor not found.");
  return delay(doctor);
}

export async function createDoctor(data) {
  const doctors = getDoctorsRaw();
  const newDoctor = { id: nextId("d"), ...data };
  saveData(KEYS.doctors, [...doctors, newDoctor]);
  return delay(newDoctor);
}

export async function updateDoctor(id, data) {
  const doctors = getDoctorsRaw().map((d) => (d.id === id ? { ...d, ...data } : d));
  saveData(KEYS.doctors, doctors);
  return delay(true);
}

export async function deleteDoctor(id) {
  const doctors = getDoctorsRaw().filter((d) => d.id !== id);
  saveData(KEYS.doctors, doctors);
  return delay(true);
}

// ---------- Availability ----------

export async function getAvailabilityForDoctor(doctorId, { onlyFree = false } = {}) {
  let slots = getAvailabilityRaw().filter((a) => a.doctorId === doctorId);
  if (onlyFree) slots = slots.filter((a) => !a.booked);
  slots.sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  return delay(slots);
}

export async function addAvailability(doctorId, { date, startTime, endTime }) {
  const slots = getAvailabilityRaw();
  const newSlot = { id: nextId("a"), doctorId, date, startTime, endTime, booked: false };
  saveData(KEYS.availability, [...slots, newSlot]);
  return delay(newSlot);
}

export async function deleteAvailability(id) {
  const slots = getAvailabilityRaw().filter((a) => a.id !== id);
  saveData(KEYS.availability, slots);
  return delay(true);
}

// ---------- Appointments ----------

export async function bookAppointment({ patient, doctor, availabilitySlot, reason }) {
  const slots = getAvailabilityRaw();
  const slot = slots.find((a) => a.id === availabilitySlot.id);

  // Re-check the slot right before booking, so two patients can't book the same slot (FR-07).
  if (!slot || slot.booked) {
    throw new Error("Sorry, this time slot is no longer available.");
  }

  const updatedSlots = slots.map((a) => (a.id === slot.id ? { ...a, booked: true } : a));
  saveData(KEYS.availability, updatedSlots);

  const appointments = getAppointmentsRaw();
  const newAppointment = {
    id: nextId("appt"),
    patientId: patient.id,
    patientName: patient.name,
    doctorId: doctor.id,
    doctorName: doctor.name,
    availabilityId: slot.id,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: "PENDING",
    reason,
    createdAt: new Date().toISOString(),
  };

  saveData(KEYS.appointments, [...appointments, newAppointment]);
  return delay(newAppointment);
}

export async function getAppointmentsForPatient(patientId) {
  const appointments = getAppointmentsRaw().filter((a) => a.patientId === patientId);
  appointments.sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  return delay(appointments);
}

export async function getAppointmentsForDoctor(doctorId) {
  const appointments = getAppointmentsRaw().filter((a) => a.doctorId === doctorId);
  appointments.sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  return delay(appointments);
}

export async function getAllAppointments() {
  const appointments = getAppointmentsRaw();
  appointments.sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime));
  return delay(appointments);
}

export async function updateAppointmentStatus(id, status) {
  const appointments = getAppointmentsRaw();
  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) throw new Error("Appointment not found.");

  const updated = appointments.map((a) => (a.id === id ? { ...a, status } : a));
  saveData(KEYS.appointments, updated);

  // Free up the slot again if the appointment was rejected or cancelled.
  if (status === "REJECTED" || status === "CANCELLED") {
    const slots = getAvailabilityRaw().map((a) =>
      a.id === appointment.availabilityId ? { ...a, booked: false } : a
    );
    saveData(KEYS.availability, slots);
  }

  return delay(true);
}

export async function cancelAppointment(id) {
  return updateAppointmentStatus(id, "CANCELLED");
}

// ---------- Admin / Dashboard ----------

export async function getAdminStats() {
  const doctors = getDoctorsRaw();
  const users = getUsers();
  const appointments = getAppointmentsRaw();
  const patients = users.filter((u) => u.role === "PATIENT");

  const statusCounts = {
    PENDING: 0,
    CONFIRMED: 0,
    REJECTED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };
  appointments.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  const monthCounts = {};
  appointments.forEach((a) => {
    const month = a.date.slice(0, 7); // "YYYY-MM"
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });
  const appointmentsByMonth = Object.entries(monthCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  const appointmentsByDoctor = doctors.map((d) => ({
    doctor: d.name,
    count: appointments.filter((a) => a.doctorId === d.id).length,
  }));

  return delay({
    totalDoctors: doctors.length,
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    statusCounts,
    appointmentsByMonth,
    appointmentsByDoctor,
  });
}

export async function getAllPatients() {
  const patients = getUsers().filter((u) => u.role === "PATIENT");
  return delay(patients);
}
