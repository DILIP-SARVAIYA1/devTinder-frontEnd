import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom"; // Import Link for better navigation
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setUser } from "../appStore/userSlice";

const Login = () => {
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for UI feedback
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Auto-fill for development (consider removing in production)
  useEffect(() => {
    setEmail("dilip@gmail.com");
    setPassword("Dilip@123");
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]); // Dependencies: isLoggedIn and navigate

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(""); // Clear previous errors
      setIsLoading(true); // Set loading state

      try {
        const res = await axios.post(
          `${BASE_URL}/login`, // Use template literal for cleaner URL
          { email, password },
          { withCredentials: true }
        );
        dispatch(setUser(res.data.userData));
        // Navigation is handled by the useEffect hook due to `isLoggedIn` change
      } catch (err) {
        let errorMessage = "Login failed. Please try again.";
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message; // Catch network errors, etc.
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false); // Reset loading state
      }
    },
    [email, password, dispatch] // Dependencies for useCallback
  );

  // Close error popup
  const closeErrorPopup = useCallback(() => {
    setError("");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      {/* Error Popup */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          {" "}
          {/* Added bg-opacity */}
          <div className="bg-white border border-red-400 rounded-xl shadow-lg px-8 py-6 flex flex-col items-center max-w-sm w-full">
            <span className="text-red-600 font-bold text-lg mb-2">Error</span>
            <span className="text-gray-700 mb-4 text-center">{error}</span>
            <button
              onClick={closeErrorPopup}
              className="px-4 py-2 rounded bg-pink-500 text-white font-semibold hover:bg-pink-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto" // Increased height slightly
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 bg-gray-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password" // Use Link for internal navigation
                    className="font-semibold text-pink-500 hover:text-pink-400 transition duration-150 ease-in-out"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 bg-gray-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!email || !password || isLoading} // Disable when loading
                className="flex w-full justify-center rounded-md bg-pink-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Not a member?{" "}
            <Link
              to="/signup" // Use Link for internal navigation
              className="font-semibold underline text-pink-500 hover:text-pink-400 transition duration-150 ease-in-out"
            >
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
