import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setUser } from "../appStore/userSlice";

const Login = () => {
  const [email, setEmail] = React.useState("dilip@gmail.com");
  const [password, setPassword] = React.useState("Dilip@123");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isLoggedIn = user.isLoggedIn;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
      return;
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUser(res.data.userData));
      // Navigation handled by useEffect
    } catch (error) {
      let msg = "Login failed. Please try again.";
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
    <div>
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
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-white"
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
                  className="block w-full rounded-md bg-gray-600 px-3 py-1.5 text-base  -outline-offset-1  placeholder:text-gray-700 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-white"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-pink-500 hover:text-pink-600"
                  >
                    Forgot password?
                  </a>
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
                  className="block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white   placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                disabled={!email || !password}
                type="submit"
                className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-white">
            Not a member?
            <a
              href="signup"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
              className="font-semibold underline text-pink-500 hover:text-pink-600"
            >
              Create a free account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
