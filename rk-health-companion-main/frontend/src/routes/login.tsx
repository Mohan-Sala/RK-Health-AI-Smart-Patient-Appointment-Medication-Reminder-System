import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HeartPulse, Check, Mail, Eye, EyeOff, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · RK Health" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("mohan@gmail.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Enter a valid email address";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please resolve form validation errors.");
      return;
    }

    setLoading(true);
    try {
      const isValid = await authStore.login(email, password);
      if (!isValid) {
        setLoading(false);
        toast.error("Invalid email or password.");
        return;
      }

      const user = authStore.getCurrentUser();
      setLoading(false);
      setSuccess(true);
      toast.success(`Login Successful! Welcome back, ${user?.name || "User"}`);
      setTimeout(() => {
        // Redirect to dashboard
        navigate({ to: "/dashboard" });
      }, 1200);
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background font-sans select-none overflow-x-hidden">
      {/* Left side: Premium Gradient Splash (hidden on mobile) */}
      <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary via-[oklch(0.55_0.22_295)] to-ai text-white relative overflow-hidden">
        {/* Decorative backdrop shapes */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] aspect-square rounded-full bg-white/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] aspect-square rounded-full bg-ai-foreground/10 blur-[120px]" />

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 w-fit hover:opacity-90 transition">
          <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md grid place-items-center border border-white/20 shadow-soft">
            <HeartPulse className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-[19px] tracking-tight">RK Health</span>
        </Link>

        {/* Welcome Info */}
        <div className="my-auto space-y-8 max-w-md z-10">
          <div className="space-y-3">
            <span className="text-[11px] font-bold tracking-widest uppercase bg-white/15 px-3.5 py-1.5 rounded-full border border-white/10">Welcome Back</span>
            <h2 className="text-[36px] font-bold leading-tight tracking-tight mt-3">
              Your Healthcare Companion.
            </h2>
            <p className="text-[15.5px] text-white/80 leading-relaxed">
              Log in to access your personalized medical record tracker, view upcoming appointments, and explore automated health summaries.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-start gap-3.5">
              <div className="h-6 w-6 rounded-full bg-white/20 grid place-items-center shrink-0 mt-0.5"><Check className="h-3.5 w-3.5" /></div>
              <div>
                <h4 className="text-[14.5px] font-semibold">Consolidated Dashboard</h4>
                <p className="text-[13px] text-white/70">A unified space for medicines, appointments, and doctors.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[12.5px] text-white/60 flex items-center justify-between border-t border-white/10 pt-6">
          <span>© 2026 RK Health Inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
      </div>

      {/* Right side: Login Form Card */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 bg-background sm:p-12">
        <div className="w-full max-w-md card-surface p-8 sm:p-10 rounded-3xl border border-border bg-card/75 backdrop-blur-md relative">
          
          {success ? (
            <div className="text-center py-12 space-y-5 animate-scale-in">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-success/10 text-success grid place-items-center border border-success/20">
                <CheckCircle2 className="h-8 w-8 animate-pulse" />
              </div>
              <h2 className="text-[24px] font-bold text-foreground">Sign In Successful</h2>
              <p className="text-muted-foreground text-[14px] max-w-xs mx-auto">
                Welcome back. We are preparing your personal health dashboard...
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center lg:hidden mb-4">
                  <HeartPulse className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <h1 className="text-[24px] font-bold tracking-tight text-foreground">Welcome Back</h1>
                <p className="text-[13.5px] text-muted-foreground mt-1.5">
                  Login to continue managing your healthcare.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Address */}
                <div>
                  <label className="text-[12.5px] font-medium text-foreground/80 mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="mohan@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full h-11 pl-10 pr-3 rounded-xl bg-background border ${
                        errors.email ? "border-danger focus:ring-danger/25" : "border-border focus:ring-primary/25"
                      } text-[13.5px] focus:outline-none focus:ring-4 transition-all`}
                    />
                  </div>
                  {errors.email && <p className="text-danger text-[11px] mt-1.5">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[12.5px] font-medium text-foreground/80 block">Password</label>
                    <a href="#" className="text-[12px] font-semibold text-primary hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full h-11 pl-10 pr-10 rounded-xl bg-background border ${
                        errors.password ? "border-danger focus:ring-danger/25" : "border-border focus:ring-primary/25"
                      } text-[13.5px] focus:outline-none focus:ring-4 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-danger text-[11px] mt-1.5">{errors.password}</p>}
                </div>

                {/* Remember Me */}
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-left select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span className="text-[12.5px] leading-tight text-muted-foreground">
                      Remember this browser session
                    </span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="pt-2 space-y-3.5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-[14px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink mx-3 text-[11.5px] text-muted-foreground uppercase font-semibold tracking-wider">or</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  <button
                    type="button"
                    className="w-full h-11 rounded-xl border border-border bg-card hover:bg-hover active:scale-[0.98] transition-all text-[13.5px] font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </div>

                {/* Switch to Register */}
                <div className="pt-3 text-center text-[13.5px] text-muted-foreground">
                  New to RK Health?{" "}
                  <Link to="/register" className="text-primary hover:underline font-semibold">
                    Create Account
                  </Link>
                </div>
              </form>
            </>
          )}

          {/* Mini Footer */}
          <div className="mt-8 flex justify-center gap-5 text-[11px] text-muted-foreground/60 border-t border-border pt-4">
            <Link to="/" className="hover:underline">Back to Home</Link>
            <span>·</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}
