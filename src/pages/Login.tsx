import React, { useState } from "react";
// Add router link for navigation to signup
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Gradient wave background */}
      <div className="absolute -top-40 left-0 w-full h-[500px] bg-gradient-to-r from-black via-gray-800 to-black opacity-10 rounded-b-[100%]" />

      <div className="relative w-full max-w-sm bg-white border border-black rounded-2xl p-8 shadow-sm">
        {/* Logo & Company Name */}
        <div className="flex flex-col items-center mb-6">
          
          <h1 className="mt-3 text-xl font-semibold tracking-wide">SwiftTrack</h1>
          <p className="text-xs opacity-60">Smart Transport Solutions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 border border-black rounded-lg hover:bg-black hover:text-white transition"
          >
            Login
          </button>
        </form>

        {/* Add signup link below the form */}
        <p className="text-xs text-center mt-3">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline hover:text-black">
            Sign up
          </Link>
        </p>

        <p className="text-xs text-center mt-6 opacity-70">
          © 2026 SwiftTrack
        </p>
      </div>
    </div>
  );
};

export default LoginPage;