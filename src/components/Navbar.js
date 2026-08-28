"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-lg">
          Appointment Booking System
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/doctors" className="hover:underline">
            Doctors
          </Link>

          {user?.role === "PATIENT" && (
            <Link href="/appointments" className="hover:underline">
              My Appointments
            </Link>
          )}

          {user?.role === "DOCTOR" && (
            <Link href="/doctor" className="hover:underline">
              Doctor Dashboard
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:underline">
              Admin Dashboard
            </Link>
          )}

          {!user && (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <span className="opacity-80">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
