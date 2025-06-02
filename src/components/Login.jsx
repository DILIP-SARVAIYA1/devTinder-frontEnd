import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../appStore/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [email, setEmail] = React.useState("dilip@gmail.com");
  const [password, setPassword] = React.useState("Dilip@123");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );
      console.log(res.data.userData);
      dispatch(setUser(res.data.userData));
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div>
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
                  className="block w-full rounded-md bg-gray-600 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-pink-600 placeholder:text-gray-700 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
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
                  className="block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-pink-600 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
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
              href="#"
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
