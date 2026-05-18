import { useState } from "react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  LoaderIcon,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setCredentials } from "../features/auth/authSlice";
import { useSignupMutation } from "../api/authApi";

function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // RTK Query mutation
  const [signupUser, { isLoading }] = useSignupMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // API Call
      const data = await signupUser(formData).unwrap();

      // Save to redux
      dispatch(setCredentials(data));

      console.log("Signup Success", data);

      // Redirect
      navigate("/chat");

    } catch (error) {
      console.log("Signup Error", error);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900 min-h-screen">
      <div className="relative w-full max-w-md">

        <BorderAnimatedContainer>
          <div className="w-full p-8 flex items-center justify-center">
            <div className="w-full">

              {/* HEADING */}
              <div className="text-center mb-8">
                <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />

                <h2 className="text-2xl font-bold text-slate-200 mb-2">
                  Create Account
                </h2>

                <p className="text-slate-400">
                  Sign up for a new account
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* FULL NAME */}
                <div>
                  <label className="auth-input-label">
                    Full Name
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fullName: e.target.value,
                        })
                      }
                      className="input"
                      placeholder="John Doe"
                    />

                    <UserIcon className="auth-input-icon" />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="auth-input-label">
                    Email
                  </label>

                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="input"
                      placeholder="johndoe@gmail.com"
                    />

                    <MailIcon className="auth-input-icon" />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="auth-input-label">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      className="input"
                      placeholder="Enter your password"
                    />

                    <LockIcon className="auth-input-icon" />
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  className="auth-btn flex items-center justify-center gap-2"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderIcon className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

              </form>

              {/* LOGIN LINK */}
              <div className="mt-6 text-center">
                <Link to="/" className="auth-link">
                  Already have an account? Login
                </Link>
              </div>

            </div>
          </div>
        </BorderAnimatedContainer>

      </div>
    </div>
  );
}

export default SignUpPage;
