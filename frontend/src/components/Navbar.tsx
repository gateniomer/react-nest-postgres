import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActivePath = (path: string): boolean => {
    return location.pathname === path;
  };

  const toggleSidebar = (): void => {
    setIsCollapsed((prev) => !prev);
  };

  const NavigationLink: React.FC<{
    to: string;
    icon: React.ReactNode;
    label: string;
    isVisible?: boolean;
    isCollapsed: boolean;
  }> = ({ to, icon, label, isVisible = true, isCollapsed }) => {
    if (!isVisible) return null;

    const isActive = isActivePath(to);

    return (
      <Link
        to={to}
        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
          isActive
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
        title={isCollapsed ? label : ""}
      >
        <div
          className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${
            isActive
              ? "text-blue-700"
              : "text-gray-400 group-hover:text-gray-600"
          }`}
        >
          {icon}
        </div>
        <div
          className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
            isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"
          }`}
        >
          <span>{label}</span>
        </div>
        {isActive && isCollapsed && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-700 rounded-r-full"></div>
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`flex-shrink-0 bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
          <div className="overflow-hidden flex-1 mr-2">
            <div
              className={`transition-all duration-300 whitespace-nowrap ${
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              <Link
                to="/"
                className="text-lg font-bold text-gray-800 hover:text-gray-900"
              >
                Call Management
              </Link>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
          <NavigationLink
            to="/"
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            }
            label="Home"
            isCollapsed={isCollapsed}
          />

          <NavigationLink
            to="/calls"
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            }
            label="Calls"
            isVisible={isAuthenticated}
            isCollapsed={isCollapsed}
          />

          <NavigationLink
            to="/tags"
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            }
            label="Tags"
            isVisible={isAuthenticated && isAdmin}
            isCollapsed={isCollapsed}
          />
        </nav>

        {/* User Area */}
        <div className="border-t border-gray-200 p-2">
          {isAuthenticated ? (
            <div className="space-y-2">
              {/* User Info */}
              <div
                className={`flex items-center p-3 bg-gray-50 rounded-lg overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div
                  className={`min-w-0 overflow-hidden transition-all duration-300 ${
                    isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ml-3"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 truncate whitespace-nowrap">
                    {user?.username}
                  </p>
                  {isAdmin && (
                    <p className="text-xs text-red-600 font-medium whitespace-nowrap">
                      Administrator
                    </p>
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group ${
                  isCollapsed ? "justify-center" : ""
                }`}
                title={isCollapsed ? "Logout" : ""}
              >
                <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <div
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ml-2"
                  }`}
                >
                  <span>Logout</span>
                </div>
              </button>
            </div>
          ) : (
            /* Login Button */
            <Link
              to="/login"
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors group ${
                isCollapsed ? "justify-center" : ""
              }`}
              title={isCollapsed ? "Login" : ""}
            >
              <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-2"
                }`}
              >
                <span>Login</span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default Navbar;
