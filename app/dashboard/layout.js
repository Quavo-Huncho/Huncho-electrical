"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileHeader from "@/components/dashboard/MobileHeader";
import DashboardFooter from "@/components/dashboard/DashboardFooter";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <MobileHeader setSidebarOpen={setSidebarOpen} />

        {/* Desktop top bar */}
        <div className="hidden lg:block">
          <DashboardHeader />
        </div>

        {/* Scrollable content + footer */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1">
            {children}
          </div>
          <DashboardFooter />
        </main>
      </div>
    </div>
  );
}