// import { useState } from "react";
// import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
// import {
//   MessageCircleIcon,
//   LockIcon,
//   MailIcon,
//   UserIcon,
//   LoaderIcon,
// } from "lucide-react";

// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";

// import { setCredentials } from "../features/auth/authSlice";
// import { useSignupMutation } from "../api/authApi";

// function SignUpPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // RTK Query mutation
//   const [signupUser, { isLoading }] = useSignupMutation();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//   });

//   // ================= HANDLE SUBMIT =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // API Call
//       const data = await signupUser(formData).unwrap();

//       // Save to redux
//       dispatch(setCredentials(data));

//       console.log("Signup Success", data);

//       // Redirect
//       navigate("/chat");

//     } catch (error) {
//       console.log("Signup Error", error);
//     }
//   };

//   return (
//     <div className="w-full flex items-center justify-center p-4 bg-slate-900 min-h-screen">
//       <div className="relative w-full max-w-md">

//         <BorderAnimatedContainer>
//           <div className="w-full p-8 flex items-center justify-center">
//             <div className="w-full">

//               {/* HEADING */}
//               <div className="text-center mb-8">
//                 <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />

//                 <h2 className="text-2xl font-bold text-slate-200 mb-2">
//                   Create Account
//                 </h2>

//                 <p className="text-slate-400">
//                   Sign up for a new account
//                 </p>
//               </div>

//               {/* FORM */}
//               <form onSubmit={handleSubmit} className="space-y-6">

//                 {/* FULL NAME */}
//                 <div>
//                   <label className="auth-input-label">
//                     Full Name
//                   </label>

//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={formData.fullName}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           fullName: e.target.value,
//                         })
//                       }
//                       className="input"
//                       placeholder="John Doe"
//                     />

//                     <UserIcon className="auth-input-icon" />
//                   </div>
//                 </div>

//                 {/* EMAIL */}
//                 <div>
//                   <label className="auth-input-label">
//                     Email
//                   </label>

//                   <div className="relative">
//                     <input
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           email: e.target.value,
//                         })
//                       }
//                       className="input"
//                       placeholder="johndoe@gmail.com"
//                     />

//                     <MailIcon className="auth-input-icon" />
//                   </div>
//                 </div>

//                 {/* PASSWORD */}
//                 <div>
//                   <label className="auth-input-label">
//                     Password
//                   </label>

//                   <div className="relative">
//                     <input
//                       type="password"
//                       value={formData.password}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           password: e.target.value,
//                         })
//                       }
//                       className="input"
//                       placeholder="Enter your password"
//                     />

//                     <LockIcon className="auth-input-icon" />
//                   </div>
//                 </div>

//                 {/* BUTTON */}
//                 <button
//                   className="auth-btn flex items-center justify-center gap-2"
//                   type="submit"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <>
//                       <LoaderIcon className="w-5 h-5 animate-spin" />
//                       Creating Account...
//                     </>
//                   ) : (
//                     "Create Account"
//                   )}
//                 </button>

//               </form>

//               {/* LOGIN LINK */}
//               <div className="mt-6 text-center">
//                 <Link to="/" className="auth-link">
//                   Already have an account? Login
//                 </Link>
//               </div>

//             </div>
//           </div>
//         </BorderAnimatedContainer>

//       </div>
//     </div>
//   );
// }

// export default SignUpPage;



import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};
export default SignUpPage;
