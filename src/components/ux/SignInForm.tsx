"use client";

import { motion } from "framer-motion";
import { FiUser, FiLock, FiArrowRight, FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export function SignInForm({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- Add this

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal container */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={scaleIn}
        className="relative z-10 w-full max-w-md"
      >
        {/* Modal content */}
        <motion.div
          variants={fadeIn}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Modal header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <h2 className="text-2xl font-bold text-center">
              Welcome to <span className="text-cyan-300">PharmaCity</span>
            </h2>
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Modal body */}
          <div className="p-6">
            <form className="space-y-5">
              {/* Username field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 bg-white transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <FiUser className="text-gray-400 mr-3" size={18} />
                  <input
                    type="text"
                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 bg-white transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <FiLock className="text-gray-400 mr-3" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2 text-gray-400 hover:text-blue-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
              
              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign in button */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg py-3 shadow-lg transition-all duration-300"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className="flex items-center justify-center">
                    Sign In
                    <motion.span
                      animate={{ x: isHovered ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      className="ml-2"
                    >
                      <FiArrowRight />
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            </form>
            
            {/* Divider */}
            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div> */}
            
            {/* Social login buttons */}
            {/* <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                </svg>
                LinkedIn
              </button>
              <button className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div> */}
          </div>
          
          {/* Modal footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
            <span className="text-gray-600 text-sm">
              Don`t have an account?{" "}
              <Link href="/signup" className="text-blue-600 font-medium hover:underline">
                Sign up
              </Link>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}