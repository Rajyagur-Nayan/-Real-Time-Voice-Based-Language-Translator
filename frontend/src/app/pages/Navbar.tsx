"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { LoginDialog } from "./auth/Login";
import { RegisterDialog } from "./auth/Register";
import { useAuth } from "./auth/AuthContext";

const Navbar = () => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <nav className="p-4 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Brand Name */}
          <div className="flex items-center space-x-2">
            {/* Simple SVG for logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v18m-3-6h6m-6-2h6m-6-2h6m-6-2h6m-6-2h6m-6-2h6M7 12h10"
              />
            </svg>
            <span className="text-xl font-bold text-purple-400">logo</span>
          </div>

          {/* Desktop Navigation Links & Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Home
            </a>
            <a
              href="/history"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              History
            </a>
            <a
              href="/translator"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Translator
            </a>
            <a
              href="/profile"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Profile
            </a>
            {/* User Avatar Placeholder */}
            {isAuthenticated ? (
              <Button onClick={logout} className="bg-red-600 hover:bg-red-700">
                Logout
              </Button>
            ) : (
              <>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsLoginDialogOpen(true)}
                >
                  Login
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setIsRegisterDialogOpen(true)}
                >
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-purple-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <a
              href="/"
              className="block text-gray-300 hover:text-purple-400 transition-colors py-2"
            >
              Home
            </a>
            <a
              href="/history"
              className="block text-gray-300 hover:text-purple-400 transition-colors py-2"
            >
              History
            </a>
            <a
              href="/translator"
              className="block text-gray-300 hover:text-purple-400 transition-colors py-2"
            >
              Translator
            </a>
            <a
              href="/profile"
              className="block text-gray-300 hover:text-purple-400 transition-colors py-2"
            >
              Profile
            </a>
            <div className="flex flex-col space-y-2 mt-4">
              {isAuthenticated ? (
                <Button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 w-full"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 w-full"
                    onClick={() => {
                      setIsLoginDialogOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 w-full"
                    onClick={() => {
                      setIsRegisterDialogOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Dialogs */}
      {isLoginDialogOpen && (
        <LoginDialog onClose={() => setIsLoginDialogOpen(false)} />
      )}
      {isRegisterDialogOpen && (
        <RegisterDialog onClose={() => setIsRegisterDialogOpen(false)} />
      )}
    </div>
  );
};

export default Navbar;
