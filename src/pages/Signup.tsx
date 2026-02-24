import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const LoginPage: React.FC = ({user , setUser}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
    // Add your login logic here
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);
        // Exchange access token for user info
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v2/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
            },
          }
        );

        const { email, name, picture } = response.data;
        console.log("Google login successful:", { email, name, picture });

        // You can now send this data to your backend for authentication
        // await loginWithGoogle({ email, picture, accessToken: codeResponse.access_token });

        // Navigate to dashboard
        navigate("/users");
      } catch (error) {
        console.error("Error getting user info:", error);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      console.log("Google login failed");
      setLoading(false);
    },
    flow: "implicit",
  });

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

        {/* <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading}
            className="w-full py-2 border border-black rounded-lg hover:bg-black hover:text-white transition disabled:opacity-50"
          >
            Login
          </button>
        </form>

      
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 border-t border-black"></div>
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 border-t border-black"></div>
        </div> */}

        {/* Google Login Button */}
        <button
          onClick={() => handleGoogleLogin()}
          disabled={loading}
          className="w-full py-2 border border-black rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#1f2937"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#1f2937"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#1f2937"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#1f2937"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? "Logging in..." : "Login with Google"}
        </button>

        <p className="text-xs text-center mt-6 opacity-70">
          © 2026 SwiftTrack
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

// ---------------- Signup Page ----------------

export const SignupPage: React.FC = ({ setUser }: { setUser: any }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    // Add your signup logic here
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);
        // Exchange access token for user info
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v2/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
            },
          }
        );

        const { email, name, picture } = response.data;
        
        // Store access token in localStorage
        localStorage.setItem('access_token', codeResponse.access_token);
        
        // Update user state
        setUser({
          email,
          name,
          image: picture,
        });
        
        console.log("Google signup successful:", { email, name, picture });

        // You can now send this data to your backend
        // await registerWithGoogle({ email, name, picture, accessToken: codeResponse.access_token });

        // Update form with Google data
        setForm({
          ...form,
          name: name || "",
          email: email || "",
        });

        // Navigate to dashboard or complete profile page
        navigate("/users");
      } catch (error) {
        console.error("Error getting user info:", error);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      console.log("Google signup failed");
      setLoading(false);
    },
    flow: "implicit",
  });

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

        {/* <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading}
          >
            Sign Up
          </button>
        </form> */}

        {/* Divider */}
        {/* <div className="flex items-center gap-3 my-4">
          <div className="flex-1 border-t border-black"></div>
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 border-t border-black"></div>
        </div> */}

        {/* Google Sign-Up Button */}
        <button
          onClick={() => handleGoogleSignup()}
          disabled={loading}
          className="w-full py-2 border border-black rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#1f2937"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#1f2937"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#1f2937"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#1f2937"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? "Signing up..." : "Sign up with Google"}
        </button>

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
