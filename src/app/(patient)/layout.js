"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar, { PATIENT_NAV } from "@/components/Sidebar";
import { MenuIcon } from "@/components/Icons";

// Shared shell for patient pages: sidebar + content area.
export default function PatientLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const current = PATIENT_NAV.find((item) => item.href === pathname);

  return (
    <ProtectedRoute role="PATIENT">
      <div className="flex gap-8">
        <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <section className="flex-1 min-w-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden mb-5 inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm font-semibold text-primary-dark shadow-sm cursor-pointer"
          >
            <MenuIcon className="w-4 h-4" />
            {current ? current.label : "Menu"}
          </button>
          {children}
        </section>
      </div>
    </ProtectedRoute>
  );
}
