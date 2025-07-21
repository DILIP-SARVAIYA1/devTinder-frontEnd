import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../appStore/userSlice";
import { useNavigate, Link } from "react-router-dom"; // Import Link for better navigation

const Signup = () => {
  // State for form inputs
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    about: "",
    profilePic:
      "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg", // Default placeholder image
    skills: "", // Comma-separated string
  });

  // State for UI feedback
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]); // Dependencies: isLoggedIn and navigate

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []); // No dependencies needed as it only uses `setForm`

  // Close error popup
  const closeErrorPopup = useCallback(() => {
    setError("");
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(""); // Clear previous errors
      setIsLoading(true); // Set loading state

      try {
        // Prepare payload: split skills string into an array
        const payload = {
          ...form,
          skills: form.skills
            .split(",")
            .map((s) => s.trim()) // Trim whitespace from each skill
            .filter(Boolean), // Remove empty strings from the array
        };

        const res = await axios.post(`${BASE_URL}/signup`, payload, {
          withCredentials: true,
        });

        dispatch(setUser(res.data.userData));
        // Navigation is handled by the useEffect hook due to `isLoggedIn` change
      } catch (err) {
        let errorMessage = "Signup failed. Please try again.";
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          // Catch network errors, etc.
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false); // Reset loading state regardless of success or failure
      }
    },
    [form, dispatch] // Dependencies for useCallback: `form` state and `dispatch`
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      {/* Error Popup */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
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
            className="mx-auto h-12 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-white">
            Create your account
          </h2>
        </div>

        <div className="mt-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              {" "}
              {/* Increased gap for better spacing */}
              <div className="w-1/2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-300"
                >
                  First Name
                </label>
                <input
                  name="firstName"
                  id="firstName" // Added ID for accessibility
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-0 bg-gray-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="First Name"
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Last Name
                </label>
                <input
                  name="lastName"
                  id="lastName" // Added ID for accessibility
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-0 bg-gray-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <input
                name="email"
                id="email" // Added ID for accessibility
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-0 bg-gray-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                name="password"
                id="password" // Added ID for accessibility
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-0 bg-gray-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                placeholder="••••••••"
              />
            </div>
            <div className="flex gap-4">
              {" "}
              {/* Increased gap */}
              <div className="w-1/2">
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-300"
                >
                  Age
                </label>
                <input
                  name="age"
                  id="age" // Added ID for accessibility
                  type="number"
                  min="18"
                  value={form.age}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-0 bg-gray-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="18+"
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-300"
                >
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender" // Added ID for accessibility
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-0 bg-gray-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-300"
              >
                About
              </label>
              <textarea
                name="about"
                id="about" // Added ID for accessibility
                value={form.about}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-0 bg-gray-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                placeholder="Tell us about yourself (e.g., interests, hobbies)"
              />
            </div>
            <div>
              <label
                htmlFor="profilePic"
                className="block text-sm font-medium text-gray-300"
              >
                Profile Picture URL
              </label>
              <input
                name="profilePic"
                id="profilePic" // Added ID for accessibility
                type="url" // Use type="url" for better validation
                value={form.profilePic}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 bg-gray-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                placeholder="https://example.com/your-photo.jpg"
              />
              {form.profilePic && (
                <img
                  src={form.profilePic}
                  alt="Profile Preview" // More descriptive alt text
                  className="mt-3 w-24 h-24 object-cover rounded-full border-2 border-pink-400 shadow-lg mx-auto" // Centered and larger preview
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop if image fails again
                    e.target.src =
                      "https://placehold.co/96x96/6b7280/ffffff?text=No+Image"; // Placeholder for broken images
                    e.target.classList.add("opacity-50"); // Indicate it's a fallback
                  }}
                />
              )}
            </div>
            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-300"
              >
                Skills (comma separated)
              </label>
              <input
                name="skills"
                id="skills" // Added ID for accessibility
                value={form.skills}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 bg-gray-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                placeholder="e.g. React, Node.js, UI/UX"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !form.email ||
                  !form.password ||
                  !form.firstName ||
                  !form.lastName ||
                  !form.age ||
                  !form.gender
                } // Disable when loading or required fields are empty
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
                    Signing Up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold underline text-pink-500 hover:text-pink-400 transition duration-150 ease-in-out"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
