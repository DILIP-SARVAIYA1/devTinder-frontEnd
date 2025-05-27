import axios from "axios";
import React from "react";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e) => {
    try {
      const res = await axios.post(
        "http://localhost:7777/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div>
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            class="mx-auto h-10 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form class="space-y-6" action="#" method="POST">
            <div>
              <label for="email" class="block text-sm/6 font-medium text-white">
                Email address
              </label>
              <div class="mt-2">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  name="email"
                  id="email"
                  autocomplete="email"
                  required
                  class="block w-full rounded-md bg-gray-600 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-pink-600 placeholder:text-gray-700 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label
                  for="password"
                  class="block text-sm/6 font-medium text-white"
                >
                  Password
                </label>
                <div class="text-sm">
                  <a
                    href="#"
                    class="font-semibold text-pink-500 hover:text-pink-600"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div class="mt-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  name="password"
                  id="password"
                  autocomplete="current-password"
                  required
                  class="block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-pink-600 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                disabled={!email || !password}
                type="submit"
                class="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p class="mt-10 text-center text-sm/6 text-white">
            Not a member?
            <a
              href="#"
              class="font-semibold underline text-pink-500 hover:text-pink-600"
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
