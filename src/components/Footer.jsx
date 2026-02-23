import React from "react";
import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-400 mt-auto border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Left */}
        <div className="text-center md:text-left">
          <h3 className="text-white font-semibold text-lg tracking-wide">
            JTS MIDDLEEAST
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Smart Advertisement & Digital Signage Platform
          </p>
        </div>

        {/* Center Links */}
        <div className="flex flex-wrap justify-center gap-5 text-sm">
          <span className="hover:text-white transition cursor-pointer">
            Privacy
          </span>
          <span className="hover:text-white transition cursor-pointer">
            Terms
          </span>
          <span className="hover:text-white transition cursor-pointer">
            Support
          </span>
          <span className="hover:text-white transition cursor-pointer">
            Contact
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-lg">
          <FaFacebook className="hover:text-blue-500 cursor-pointer transition" />
          <FaLinkedin className="hover:text-blue-400 cursor-pointer transition" />
          <FaTwitter className="hover:text-sky-400 cursor-pointer transition" />
          <FaYoutube className="hover:text-red-500 cursor-pointer transition" />
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-500 border-t border-gray-700 py-3">
        &copy; {new Date().getFullYear()} JTS MIDDLEEAST. All rights reserved.
      </div>
    </footer>
  );
}