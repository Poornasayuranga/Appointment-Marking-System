"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { getAdminStats } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

const STATUS_COLORS = {
  PENDING: "#facc15",
  CONFIRMED: "#22c55e",
  REJECTED: "#ef4444",
  COMPLETED: "#3b82f6",
  CANCELLED: "#9ca3af",
};

function StatCard({ label, value }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm text-center">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  if (!stats) return <p className="text-gray-500">Loading dashboard...</p>;

  const statusData = Object.entries(stats.statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
          <StatCard label="Total Doctors" value={stats.totalDoctors} />
          <StatCard label="Total Patients" value={stats.totalPatients} />
          <StatCard label="Total Appointments" value={stats.totalAppointments} />
          <StatCard label="Pending" value={stats.statusCounts.PENDING} />
          <StatCard label="Confirmed" value={stats.statusCounts.CONFIRMED} />
          <StatCard label="Completed" value={stats.statusCounts.COMPLETED} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link href="/admin/doctors" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
          Manage Doctors
        </Link>
        <Link href="/admin/patients" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
          View Patients
        </Link>
        <Link href="/admin/appointments" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
          View All Appointments
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Appointments by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="count" nameKey="status" outerRadius={80} label>
                {statusData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Appointments by Month</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.appointmentsByMonth}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm md:col-span-2">
          <h2 className="font-semibold mb-3">Appointments by Doctor</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.appointmentsByDoctor}>
              <XAxis dataKey="doctor" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute role="ADMIN">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
