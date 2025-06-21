import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../appStore/userSlice";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    about: "",
    profilePic: "",
    skills: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  console.log("user in signup", user);

  const isLoggedIn = user.isLoggedIn;
  if (isLoggedIn) navigate("/");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await axios.post(BASE_URL + "/signup", payload, {
        withCredentials: true,
      });
      dispatch(setUser(res.data.userData));
      navigate("/");
    } catch (error) {
      let msg = "Signup failed. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        msg = error.response.data.message;
      }
      setError(msg);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-br font-sans">
      {/* Error Popup */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border border-red-400 rounded-xl shadow-lg px-8 py-6 flex flex-col items-center">
            <span className="text-red-600 font-bold text-lg mb-2">Error</span>
            <span className="text-gray-700 mb-4">{error}</span>
            <button
              onClick={() => setError("")}
              className="px-4 py-1 rounded bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
            >
              Close
            </button>
          </div>
          <div className="fixed inset-0 bg-black/30 z-[-1]" />
        </div>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          Create your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-white">
                First Name
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white placeholder:text-gray-400 focus:outline-2 focus:outline-pink-600"
                placeholder="First Name"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-white">
                Last Name
              </label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white placeholder:text-gray-400 focus:outline-2 focus:outline-pink-600"
                placeholder="Last Name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Email address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white placeholder:text-gray-400 focus:outline-2 focus:outline-pink-600"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white placeholder:text-gray-400 focus:outline-2 focus:outline-pink-600"
              placeholder="Password"
            />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-white">
                Age
              </label>
              <input
                name="age"
                type="number"
                min="18"
                value={form.age}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white placeholder:text-gray-400 focus:outline-2 focus:outline-pink-600"
                placeholder="Age"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-white">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white focus:outline-2 focus:outline-pink-600"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              About
            </label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white placeholder:text-gray-400 focus:outline-2 focus:outline-pink-600"
              placeholder="Tell us about yourself"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Profile Picture URL
            </label>
            <input
              name="profilePic"
              value={form.profilePic}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white placeholder:text-gray-400 focus:outline-2 focus:outline-pink-600"
              placeholder="https://example.com/your-photo.jpg"
            />
            {form.profilePic && (
              <img
                src={form.profilePic}
                alt="Preview"
                className="mt-2 w-20 h-20 object-cover rounded-full border-2 border-pink-400 shadow"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Skills (comma separated)
            </label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white placeholder:text-gray-400 focus:outline-2 focus:outline-pink-600"
              placeholder="e.g. React, Node.js, UI/UX"
            />
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Sign up
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm text-white">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold underline text-pink-400 hover:text-pink-300"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
