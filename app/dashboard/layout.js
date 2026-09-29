"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileHeader from "@/components/dashboard/MobileHeader";

export default function DashboardLayout({
  children,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (

   
    <div className="flex h-screen overflow-hidden">

      {
        sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() =>
              setSidebarOpen(false)
            }
          />
        )
      }
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader
          setSidebarOpen={setSidebarOpen}
        />

        <div className="hidden lg:block">
          <DashboardHeader />
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}