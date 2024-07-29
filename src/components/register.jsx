// src/components/Register.jsx
import React, { useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "../firebase"; // Import updateProfile
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); // State untuk displayName
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update profil pengguna dengan displayName
      await updateProfile(user, {
        displayName: displayName,
      });

      navigate("/todolist");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Profile</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-3 border border-gray-300  rounded-md"
          />
        </div>
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
            onClick={handleRegister}
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600"
          >
            Register
          </button>
        </div>
        <div className="text-center">
          <p className="mb-4">Already have an account?</p>
          <button
            onClick={() => navigate("/todolist")}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
