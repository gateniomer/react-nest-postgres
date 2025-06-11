import React from "react";
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const Home: React.FC = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Call Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your call tracking and task management with our
            comprehensive platform. Organize calls, manage tasks, and use custom
            tags to stay on top of everything.
          </p>

          {!isAuthenticated ? (
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/calls"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                View Demo
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto border border-blue-200">
              <p className="text-lg text-gray-700 mb-4">
                Welcome back,{" "}
                <span className="font-semibold text-blue-600">
                  {user?.username}
                </span>
                !
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  to="/calls"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Calls
                </Link>
                {isAdmin && (
                  <Link
                    to="/tags"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Manage Tags
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
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
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Call Tracking
            </h3>
            <p className="text-gray-600">
              Keep track of all your calls in one place. Add titles, tags, and
              organize them efficiently.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Task Management
            </h3>
            <p className="text-gray-600">
              Create and manage tasks for each call. Track progress with status
              updates from Open to Completed.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Custom Tags
            </h3>
            <p className="text-gray-600">
              Organize calls with colorful custom tags. Create categories that
              make sense for your workflow.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="space-y-4">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold text-gray-900">Login</h4>
              <p className="text-sm text-gray-600">
                Sign in with your credentials to access the system
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold text-gray-900">Create Calls</h4>
              <p className="text-sm text-gray-600">
                Add new calls with titles and assign relevant tags
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold text-gray-900">Add Tasks</h4>
              <p className="text-sm text-gray-600">
                Create tasks for each call and track their progress
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                4
              </div>
              <h4 className="font-semibold text-gray-900">Stay Organized</h4>
              <p className="text-sm text-gray-600">
                Use tags to keep everything organized
              </p>
            </div>
          </div>
        </div>

        {/* User Roles Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">
              For Users
            </h3>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Create and manage calls
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Add and track tasks
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Use existing tags
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                View call history
              </li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-8 border border-green-200">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">
              For Admins
            </h3>
            <ul className="space-y-3 text-green-800">
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                All user capabilities
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Create and manage tags
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Customize tag colors
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                System administration
              </li>
            </ul>
          </div>
        </div>

        {/* Demo Credentials */}
        {!isAuthenticated && (
          <div className="mt-12 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">
              Try It Out
            </h3>
            <p className="text-yellow-800 mb-4">
              Use these demo credentials to explore the system:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded p-4 border border-yellow-300">
                <div className="font-medium text-yellow-900">Admin Account</div>
                <div className="text-yellow-700">Username: admin</div>
                <div className="text-yellow-700">Password: 1</div>
              </div>
              <div className="bg-white rounded p-4 border border-yellow-300">
                <div className="font-medium text-yellow-900">User Account</div>
                <div className="text-yellow-700">Username: user</div>
                <div className="text-yellow-700">Password: 1</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
