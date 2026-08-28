// Starting mock data. This only gets used the very first time the app runs
// (when localStorage is empty), so the app has something to show.

export const seedUsers = [
  {
    id: "u-admin",
    name: "System Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "ADMIN",
    contactNumber: "0110000000",
  },
  {
    id: "u-doctor-1",
    name: "Dr. Nimal Silva",
    email: "silva@example.com",
    password: "doctor123",
    role: "DOCTOR",
    contactNumber: "0771111111",
    doctorId: "d-1",
  },
  {
    id: "u-doctor-2",
    name: "Dr. Kumari Perera",
    email: "perera@example.com",
    password: "doctor123",
    role: "DOCTOR",
    contactNumber: "0772222222",
    doctorId: "d-2",
  },
  {
    id: "u-patient-1",
    name: "Sahan Fernando",
    email: "patient@example.com",
    password: "patient123",
    role: "PATIENT",
    contactNumber: "0773333333",
  },
];

export const seedDoctors = [
  {
    id: "d-1",
    name: "Dr. Nimal Silva",
    specialization: "Cardiologist",
    qualification: "MBBS, MD (Cardiology)",
    experience: 12,
    contactNumber: "0771111111",
    description: "Specialist in heart-related conditions with 12 years of experience.",
  },
  {
    id: "d-2",
    name: "Dr. Kumari Perera",
    specialization: "Dermatologist",
    qualification: "MBBS, Dip. Dermatology",
    experience: 8,
    contactNumber: "0772222222",
    description: "Experienced dermatologist focusing on skin and hair care.",
  },
  {
    id: "d-3",
    name: "Dr. Ashan Fernando",
    specialization: "Pediatrician",
    qualification: "MBBS, DCH",
    experience: 15,
    contactNumber: "0774444444",
    description: "Caring for children's health for over 15 years.",
  },
];

export const seedAvailability = [
  { id: "a-1", doctorId: "d-1", date: "2026-09-02", startTime: "09:00", endTime: "09:30", booked: false },
  { id: "a-2", doctorId: "d-1", date: "2026-09-02", startTime: "09:30", endTime: "10:00", booked: false },
  { id: "a-3", doctorId: "d-1", date: "2026-09-03", startTime: "14:00", endTime: "14:30", booked: false },
  { id: "a-4", doctorId: "d-2", date: "2026-09-02", startTime: "10:00", endTime: "10:30", booked: false },
  { id: "a-5", doctorId: "d-2", date: "2026-09-04", startTime: "15:00", endTime: "15:30", booked: false },
  { id: "a-6", doctorId: "d-3", date: "2026-09-05", startTime: "11:00", endTime: "11:30", booked: false },
];

export const seedAppointments = [];
