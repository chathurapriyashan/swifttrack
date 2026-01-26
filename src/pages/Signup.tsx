import React, { useState } from "react";
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
          <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center font-bold text-lg">
            S
          </div>
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

        <p className="text-xs text-center mt-6 opacity-70">
          © 2026 SwiftTrack
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

// ---------------- Signup Page ----------------

export const SignupPage: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Gradient wave background */}
      <div className="absolute -top-40 left-0 w-full h-[500px] bg-gradient-to-r from-black via-gray-800 to-black opacity-10 rounded-b-[100%]" />

      <div className="relative w-full max-w-md bg-white border border-black rounded-2xl p-8 shadow-sm">
        {/* Logo & Company Name */}
        <div className="flex flex-col items-center mb-6">
          {/* <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center font-bold text-lg">
            S
          </div> */}
          <h1 className="mt-3 text-xl font-semibold tracking-wide">SwiftTrack</h1>
          <p className="text-xs opacity-60">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none"
          />

          <input
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none resize-none"
          />

          <button
            type="submit"
            className="w-full py-2 border border-black rounded-lg hover:bg-black hover:text-white transition"
          >
            Sign Up
          </button>
        </form>

        {/* Add login link below the form */}
        <p className="text-xs text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="underline hover:text-black">
            Log in
          </Link>
        </p>

        <p className="text-xs text-center mt-6 opacity-70">© 2026 SwiftTrack</p>
      </div>
    </div>
  );
};
