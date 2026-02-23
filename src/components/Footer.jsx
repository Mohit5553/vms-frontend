import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2">

        {/* Left */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} JTS MIDDLEEAST. All rights reserved.
        </p>

        {/* Center */}
        <div className="flex gap-4 text-sm">
          <span className="hover:text-white cursor-pointer">Privacy</span>
          <span className="hover:text-white cursor-pointer">Terms</span>
          <span className="hover:text-white cursor-pointer">Support</span>
        </div>

        {/* Right */}
        <p className="text-xs">
          Advertisement Management System
        </p>
      </div>
    </footer>
  );
}