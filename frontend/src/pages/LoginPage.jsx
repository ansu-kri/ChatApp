import { useState } from "react";
import {
  MessageCircleIcon,
  MailIcon,
  LockIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData); // your login function
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full  flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row h-full">
            
            {/* LEFT */}
            <div className="md:w-1/2 p-8 flex items-center justify-center h-full md:border-r border-slate-600/30">
              <div className="w-full max-w-md">

                {/* HEADER */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-slate-400">
                    Login to access to your account
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
                          setFormData({ ...formData, email: e.target.value })
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
                          setFormData({ ...formData, password: e.target.value })
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
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <LoaderIcon className="w-5 h-5 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/signup" className="auth-link">
                    Don't have an account? Sign Up
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 h-full bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-100">
                    Connect anytime, anywhere
                  </h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default LoginPage;