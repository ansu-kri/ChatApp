import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useLoginMutation } from "../app/auth/authApi";
import { setCredentials } from "../app/auth/authSlice";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const res = await login({
        email,
        password,
      }).unwrap();

      dispatch(
        setCredentials({
          token: res.access_token,
          user: {
            userId: "",
            email,
          },
        })
      );

      toast.success("Login success 🚀");
      navigate("/chat");
    } catch (err: any) {
      const message = err?.data?.detail;

      if (message === "Invalid email") {
        toast.error("User not found. Redirecting...");
        setTimeout(() => navigate("/signup"), 1000);
        return;
      }

      if (message === "Invalid password") {
        toast.error("Incorrect password");
        return;
      }

      toast.error("Login failed");
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-[#09090f]">
      {/* ================= BACKGROUND ANIMATION ================= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* glowing circles */}
        <div className="absolute left-[-100px] top-[-100px] h-[350px] w-[350px] animate-pulse rounded-full bg-purple-600/30 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-100px] h-[350px] w-[350px] animate-pulse rounded-full bg-indigo-500/30 blur-3xl" />

        <div className="absolute left-[40%] top-[30%] h-[250px] w-[250px] animate-bounce rounded-full bg-pink-500/20 blur-3xl" />

        {/* grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      {/* ================= LOGIN CARD ================= */}

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-[92%] max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl"
      >
        {/* glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-2xl" />

        <div className="relative z-10">
          <h2 className="mb-2 text-center text-3xl font-bold text-white">
            Welcome Back 👋
          </h2>

          <p className="mb-8 text-center text-sm text-gray-300">
            Login to continue chatting with your friends
          </p>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="mb-2 block text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none backdrop-blur-xl transition-all placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="mb-2 block text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none backdrop-blur-xl transition-all placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <span className="relative z-10">
              {isLoading ? "Logging in..." : "Login"}
            </span>
          </button>

          {/* DIVIDER */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          {/* SIGNUP */}
          <p className="text-center text-sm text-gray-300">
            New here?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="cursor-pointer font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              Create account
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;