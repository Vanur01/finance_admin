'use client';

import "../globals.css"
import Sidebar from "@/app/components/Sidebar";
import { MenuIcon } from "lucide-react"
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <Sidebar 
        onCollapseChange={setIsSidebarCollapsed} 
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={() => setIsMobileMenuOpen(false)}
      />
      
      <main 
        className={`transition-all duration-300 bg-gray-50  ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="sticky top-0 z-30 bg-white lg:hidden">
          <div className="flex items-center px-4 py-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Open mobile menu"
            >
              <MenuIcon className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="ml-3 text-lg font-semibold text-gray-800">SuperAdmin</h1>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
