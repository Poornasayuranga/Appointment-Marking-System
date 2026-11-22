"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

// Patient pages require a patient login. The left sidebar itself is rendered globally by MainContainer.
export default function PatientLayout({ children }) {
  return <ProtectedRoute role="PATIENT">{children}</ProtectedRoute>;
}
