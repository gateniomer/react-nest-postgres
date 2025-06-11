import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router";

interface FormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    setError("");

    const result = await login(formData.username, formData.password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(
        (Array.isArray(result.message)
          ? result.message.join("\n")
          : result.message) || "Login failed"
      );
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600">Enter your credentials</p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600 text-center">
              <strong>Admin:</strong> admin / 1
              <br />
              <strong>User:</strong> user / 1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
