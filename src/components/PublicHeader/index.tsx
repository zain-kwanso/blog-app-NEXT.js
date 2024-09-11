"use client";

import React, { useState } from "react";
import Link from "next/link";

const PublicHeader: React.FC = (): React.JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 text-white shadow-md z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            MyBlogApp
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-gray-200">
              Home
            </Link>
            <Link href="/about-us" className="hover:text-gray-200">
              About
            </Link>
            <Link href="/login" className="hover:text-gray-200">
              Login
            </Link>
            <Link href="/signup" className="hover:text-gray-200">
              Sign Up
            </Link>
          </nav>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 text-white">
            <ul className="space-y-4 px-4 py-2">
              <li>
                <Link
                  href="/"
                  className="block py-2 hover:bg-gray-700 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="block py-2 hover:bg-gray-700 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="block py-2 hover:bg-gray-700 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="block py-2 hover:bg-gray-700 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Signup
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
};

export default React.memo(PublicHeader);
