import { useState } from "react";
import {
  MessageCircleIcon,
  MailIcon,
  LockIcon,
  LoaderIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../api/authApi";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // RTK Query login mutation
  const [loginUser, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // API call
      const data = await loginUser(formData).unwrap();

      // Save user/token to redux
      dispatch(setCredentials(data));

      console.log("Login Success", data);

      // Redirect
      navigate("/chat");
    } catch (error) {
      console.log("Login Error", error);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900 min-h-screen">
      <div className="relative w-full max-w-md">
        <BorderAnimatedContainer>
          <div className="w-full p-8 flex items-center justify-center">
            <div className="w-full">

              {/* HEADER */}
              <div className="text-center mb-8">
                <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />

                <h2 className="text-2xl font-bold text-slate-200 mb-2">
                  Welcome Back
                </h2>

                <p className="text-slate-400">
                  Login to access your account
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* EMAIL */}
                <div>
                  <label className="auth-input-label">Email</label>

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
                  <label className="auth-input-label">Password</label>

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
                  type="submit"
                  disabled={isLoading}
                  className="auth-btn flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <LoaderIcon className="w-5 h-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              {/* SIGNUP LINK */}
              <div className="mt-6 text-center">
                <Link to="/signup" className="auth-link">
                  Don't have an account? Sign Up
                </Link>
              </div>

            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default LoginPage;