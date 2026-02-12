import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Video Advertisements System. All
          rights reserved.
        </p>
        <p className="mt-2 text-xs">Designed with ❤️ by Ashish yadav</p>
      </div>
    </footer>
  );
}
