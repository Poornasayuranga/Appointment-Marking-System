"use client";

import { usePathname } from "next/navigation";

// The homepage renders full-bleed (its hero sits under the fixed navbar);
// every other page gets the standard centered container below the navbar.
export default function MainContainer({ children }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      {children}
    </main>
  );
}
