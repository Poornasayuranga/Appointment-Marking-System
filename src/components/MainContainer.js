"use client";

import { usePathname } from "next/navigation";
import Sidebar, { useShowSidebar } from "@/components/Sidebar";

// The homepage renders full-bleed (its hero sits under the fixed navbar);
// every other page gets the standard centered container below the navbar.
// When the left sidebar is shown, content is offset to make room for it.
export default function MainContainer({ children }) {
  const pathname = usePathname();
  const showSidebar = useShowSidebar();

  const offset = showSidebar ? "md:pl-20 lg:pl-72 pb-16 md:pb-0" : "";

  return (
    <>
      {showSidebar && <Sidebar />}
      <div className={`flex-1 flex flex-col ${offset}`}>
        {pathname === "/" ? (
          <main className="flex-1">{children}</main>
        ) : (
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">{children}</main>
        )}
      </div>
    </>
  );
}
