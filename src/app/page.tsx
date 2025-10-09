"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import usePushNotifications from "@/app/hooks/usePushNotification";
import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";

export default function CaishenLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const loginUser = useAuthStore((state) => state.loginUser);
  const { fcmToken, generateFCMToken } = usePushNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!email || !password) {
        setError("Please enter both email and password");
        return;
      }

      let deviceToken = fcmToken;
      if (!deviceToken) {
        const generated = await generateFCMToken();
        deviceToken = generated || "5cffxbwtfqr4qr511tbf7";
      }

      await loginUser(email, password, deviceToken);
      
      // If we get here, login was successful
      router.push("/home"); // Using replace instead of push to prevent going back to login
    } catch (err: any) {
      console.error('Login error:', err);
      // Only show error message if it's actually an error
      if (!err.message?.includes('successfully')) {
        const errorMessage = err?.response?.data?.message || err?.message || "Invalid email or password. Please try again.";
        setError(errorMessage);
      } else {
        // If the message contains "successfully", redirect to home
        router.replace("/home");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row p-3 gap-3 bg-white/80 rounded-xl">
      {/* Left Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-[60%] bg-white flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 rounded-xl relative"
      >
         {/* Header */}
         <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
          <div className="flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-600 rounded-sm"></div>
              </div>
            </div>
            <span className="text-lg sm:text-xl font-semibold text-gray-900">
              Caishen
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-md mx-auto w-full mt-16 sm:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Get Started Now
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              Please enter your information to access your account.
            </p>
          </motion.div>

          {/* Email and Password Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-4 sm:space-y-6"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </motion.form>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 sm:mt-12 text-center text-gray-500 text-xs sm:text-sm"
        >
          © 2024. All Rights Reserved.
        </motion.div>
      </motion.div>

      {/* Right Side - Tilted Dashboard Preview */}
      <div className="lg:flex flex-col lg:w-[40%] bg-gradient-to-br from-blue-600 to-blue-700 items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden rounded-xl">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Welcome to Caishen CRM
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-md mx-auto">
            Access the Superadmin panel to manage your CRM system, users, and configurations.
          </p>
        </div>
        <div className="perspective-[1500px] w-full">
          <motion.div
            initial={{
              opacity: 0,
              translateX: 40,
              translateY: 20,
              rotateX: 15,
              rotateY: -10,
              rotateZ: 6,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              translateX: 60,
              translateY: 150,
              rotateX: 15,
              rotateY: -10,
              rotateZ: 6,
              scale: 1,
            }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative transform-style-preserve-3d"
          >
            <div className="relative border-[12px] border-blue-300/50 rounded-3xl overflow-hidden shadow-2xl scale-125">
              <img
                src="/Main_Dashboard.jpg"
                alt="Dashboard Preview"
                className="rounded-xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 to-transparent rounded-xl pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
