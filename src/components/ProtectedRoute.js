"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Wrap any page's content with this to require login (and optionally a specific role).
// Example: <ProtectedRoute role="ADMIN">...page content...</ProtectedRoute>
export default function ProtectedRoute({ children, role }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
    } else if (role && user.role !== role) {
      router.push("/");
    }
  }, [user, isLoading, role, router]);

  if (isLoading || !user || (role && user.role !== role)) {
    return <p className="text-center text-gray-500 py-10">Loading...</p>;
  }

  return children;
}
