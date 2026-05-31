import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../app/auth/authApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { signupSchema } from "./validation/authSchema";
import type { SignupFormData } from "./validation/authSchema";

function Signup() {
  const navigate = useNavigate();

  const [signup, { isLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const res = await signup(data).unwrap();

      console.log(res);

      toast.success("Signup successful 🚀");

      navigate("/");
    } catch (err: any) {
      const message = err?.data?.detail;

      if (message === "Email already exists") {
        toast.error("Already registered");

        setTimeout(() => {
          navigate("/");
        }, 1200);

        return;
      }

      toast.error("Signup failed");
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-[#09090f] px-4">
      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* glowing gradients */}
        <div className="absolute left-[-120px] top-[-120px] h-[400px] w-[400px] rounded-full bg-indigo-600/30 blur-3xl animate-pulse" />

        <div className="absolute bottom-[-120px] right-[-120px] h-[400px] w-[400px] rounded-full bg-pink-500/30 blur-3xl animate-pulse" />

        <div className="absolute left-[40%] top-[35%] h-[250px] w-[250px] rounded-full bg-purple-500/20 blur-3xl animate-bounce" />

        {/* grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* ================= SIGNUP CARD ================= */}

      <motion.form
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl"
      >
        {/* CARD GLOW */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-2xl" />

        <div className="relative z-10">
          {/* ICON */}
          {/* <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
            className="mb-6 flex justify-center"
          >
            <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl shadow-lg">
              🚀
            </div>
          </motion.div> */}

          {/* TITLE */}
          <h2 className="mb-2 text-center text-3xl font-bold text-white">
            Create Account
          </h2>

          <p className="mb-8 text-center text-sm text-gray-300">
            Join the next generation messaging platform
          </p>

          {/* NAME */}
          <div className="mb-4">
            <label className="mb-2 block text-sm text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              {...register("name")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
            />

            {errors.name && (
              <p className="mt-2 text-sm text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="mb-2 block text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="mb-2 block text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              {...register("password")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30"
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            type="submit"
            disabled={isLoading}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition duration-300 group-hover:opacity-100" />

            <span className="relative z-10">
              {isLoading ? "Creating account..." : "Signup"}
            </span>
          </motion.button>

          {/* DIVIDER */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          {/* LOGIN */}
          <p className="text-center text-sm text-gray-300">
            Already registered?{" "}
            <span
              onClick={() => navigate("/")}
              className="cursor-pointer font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              Login
            </span>
          </p>
        </div>
      </motion.form>
    </div>
  );
}

export default Signup;