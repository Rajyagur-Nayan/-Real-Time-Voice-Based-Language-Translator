import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { LoginDialog } from "./auth/Login";
import { RegisterDialog } from "./auth/Register";
import { useAuth } from "./auth/AuthContext";

const Navbar = () => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  return (
    <div>
      {/* Navbar */}
      <nav className="p-4 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
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
                d="M9.663 17h4.673M12 3v18m-3-6h6m-6-2h6m-6-2h6m-6-2h6m-6-2h6m-6-2h6m-6-2h6M7 12h10"
              />
            </svg>
            <span className="text-xl font-bold text-purple-400">logo</span>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              History
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Settings
            </a>
            {/* User Avatar Placeholder */}
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">
              <img
                src="https://placehold.co/32x32/6b7280/ffffff?text=U"
                alt="User Avatar"
                className="rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "https://placehold.co/32x32/6b7280/ffffff?text=U";
                }}
              />
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          {isAuthenticated ? (
            <Button onClick={logout} className="bg-red-600">
              Logout
            </Button>
          ) : (
            <>
              <Button
                className="bg-blue-600"
                onClick={() => setIsLoginDialogOpen(true)}
              >
                Login
              </Button>
              <Button
                className="bg-green-600"
                onClick={() => setIsRegisterDialogOpen(true)}
              >
                Register
              </Button>
            </>
          )}
        </div>
        <div>
          {/* Dialogs */}
          {isLoginDialogOpen && (
            <LoginDialog onClose={() => setIsLoginDialogOpen(false)} />
          )}
          {isRegisterDialogOpen && (
            <RegisterDialog onClose={() => setIsRegisterDialogOpen(false)} />
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
