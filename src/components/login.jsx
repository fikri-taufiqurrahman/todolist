// src/components/Login.jsx
import React, { useState } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  provider,
} from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/tasks");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/tasks");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side */}
      <div className="flex flex-1 items-center justify-center bg-blue-500 text-white">
        <div className="p-8 max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">To Do List App</h1>
          <p>
            Get exclusive access to our To Do List app. Stay organized and
            manage your tasks efficiently with our user-friendly platform.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-1 items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
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
              className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600"
            >
              Sign in with Google
            </button>
          </div>
          <div className="text-center">
            <p className="mb-4">
              Don't have an account?{" "}
              <a
                onClick={() => navigate("/register")}
                className="text-blue cursor-pointer"
              >
                Create Profile
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
