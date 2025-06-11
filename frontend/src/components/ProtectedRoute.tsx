import React from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user" | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = null,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login with current location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Required role: {requiredRole} | Your role: {user?.role}
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Authenticated and authorized - show content
  return <>{children}</>;
};

export default ProtectedRoute;
