import React, { useState } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  provider,
} from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/todolist/tasks");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/todolist/tasks");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side */}
      <div className="flex flex-1 items-center justify-center bg-blue-500 text-white p-8">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">To Do List App</h1>
          <p>
            Get exclusive access to our To Do List app. Stay organized and
            manage your tasks efficiently with our user-friendly platform.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 p-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <div className="mb-4 flex items-center">
            <FaEnvelope className="mr-4  text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4 flex items-center">
            <FaLock className="mr-4 border border-gray-100 rounded md text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-6">
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
          </div>
          <div className="text-center mb-4">
            <button
              onClick={signInWithGoogle}
              className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 flex items-center justify-center"
            >
              <FaGoogle className="mr-2" /> Sign in with Google
            </button>
          </div>
          <div className="text-center">
            <p className="mb-4">
              Don't have an account?{" "}
              <a
                onClick={() => navigate("/todolist/register")}
                className="text-blue-500 cursor-pointer"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
