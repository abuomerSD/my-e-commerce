import axios from "axios";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const url = "http://localhost:5000/api/users/login";

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      if (!username) {
        alert("username is required");
        return;
      }

      if (!password) {
        alert("password is required");
        return;
      }

      await axios
        .post(
          url,
          {
            username,
            password,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login h-screen  flex justify-center items-center">
      <div className="flex h-9/12 w-9/12 bg-blue-600 rounded-xl shadow-2x test">
        <div className="login-form flex justify-center w-full md:w-1/2">
          <form
            action=""
            className="flex flex-col  justify-center align-center gap-3"
          >
            <img src="/images/logo.svg" alt="logo image" />
            <label htmlFor="username" className="text-white">
              Username:
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              className="border-1 border-gray-100 rounded p-2 text-white focus:border-gray-200"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <label htmlFor="password" className="text-white">
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="border-1 border-gray-100 rounded p-2 text-white"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              className="bg-purple-600 border-none cursor-pointer duration-300 hover:bg-purple-600 text-stone-100 rounded-md px-3 py-2"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        </div>
        <div className="rounded-r-2xl hidden w-0 md:block md:w-1/2">
          <img
            src="/images/lock1.jpg"
            alt="lock-image"
            className="w-full h-full rounded-r-2xl object-fit-cover opacity-70"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
