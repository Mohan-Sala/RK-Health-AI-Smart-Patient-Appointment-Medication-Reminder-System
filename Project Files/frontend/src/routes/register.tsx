import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HeartPulse, Check, User, Mail, Phone, Calendar, Eye, EyeOff, Lock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { authStore } from "@/lib/store";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Your Account · RK Health" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password Strength State
  const [strength, setStrength] = useState(0);
  const [strengthText, setStrengthText] = useState("");
  const [strengthColor, setStrengthColor] = useState("bg-muted");

  // Calculate Password Strength
  useEffect(() => {
    if (!password) {
      setStrength(0);
      setStrengthText("");
      setStrengthColor("bg-muted");
      return;
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    setStrength(score);
    if (score === 1) {
      setStrengthText("Weak");
      setStrengthColor("bg-danger");
    } else if (score === 2) {
      setStrengthText("Fair");
      setStrengthColor("bg-warning");
    } else if (score === 3) {
      setStrengthText("Good");
      setStrengthColor("bg-primary");
    } else if (score === 4) {
      setStrengthText("Strong");
      setStrengthColor("bg-success");
    }
  }, [password]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Full Name is required";
    
    if (!email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Enter a valid email address";
    }

    if (!phone) {
      errs.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(phone)) {
      errs.phone = "Enter a valid phone number (min 10 digits)";
    }

    if (!dob) errs.dob = "Date of birth is required";
    if (!gender) errs.gender = "Gender is required";

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms) {
      errs.acceptTerms = "You must accept the terms and conditions";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please resolve the errors in the form.");
      return;
    }

    setLoading(true);
    try {
      await authStore.register({
        name,
        email,
        phone,
        dob,
        gender,
        password,
        avatar: "",
      });

      // clear the form
      setName("");
      setEmail("");
      setPhone("");
      setDob("");
      setGender("");
      setPassword("");
      setConfirmPassword("");

      setLoading(false);
      setSuccess(true);
      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Registration failed. Please try again.");
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

        {/* Feature Highlights on Left Side */}
        <div className="my-auto space-y-8 max-w-md z-10">
          <div className="space-y-3">
            <span className="text-[11px] font-bold tracking-widest uppercase bg-white/15 px-3.5 py-1.5 rounded-full border border-white/10">SaaS Platform</span>
            <h2 className="text-[36px] font-bold leading-tight tracking-tight mt-3">
              Start Managing Your Health Smarter.
            </h2>
            <p className="text-[15.5px] text-white/80 leading-relaxed">
              Join thousands of patients managing appointments, prescriptions, and secure health data in one intuitive portal.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-start gap-3.5">
              <div className="h-6 w-6 rounded-full bg-white/20 grid place-items-center shrink-0 mt-0.5"><Check className="h-3.5 w-3.5" /></div>
              <div>
                <h4 className="text-[14.5px] font-semibold">100% Secure & Compliant</h4>
                <p className="text-[13px] text-white/70">Industry-leading encryption standards for patient record security.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="h-6 w-6 rounded-full bg-white/20 grid place-items-center shrink-0 mt-0.5"><Check className="h-3.5 w-3.5" /></div>
              <div>
                <h4 className="text-[14.5px] font-semibold">Real-Time Synchronization</h4>
                <p className="text-[13px] text-white/70">Connect with doctors, appointments, and medication compliance charts.</p>
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

      {/* Right side: Registration Form Card */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 bg-background sm:p-12 overflow-y-auto">
        <div className="w-full max-w-xl card-surface p-8 sm:p-10 rounded-3xl border border-border bg-card/75 backdrop-blur-md relative">
          
          {success ? (
            <div className="text-center py-12 space-y-5 animate-scale-in">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-success/10 text-success grid place-items-center border border-success/20">
                <CheckCircle2 className="h-8 w-8 animate-pulse" />
              </div>
              <h2 className="text-[24px] font-bold text-foreground">Registration Successful!</h2>
              <p className="text-muted-foreground text-[14px] max-w-xs mx-auto">
                Your account is ready. Redirecting you to the sign-in page to continue...
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center lg:hidden mb-4">
                  <HeartPulse className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <h1 className="text-[24px] font-bold tracking-tight text-foreground">Create Your RK Health Account</h1>
                <p className="text-[13.5px] text-muted-foreground mt-1.5">
                  Join RK Health and start managing your healthcare intelligently.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="text-[12.5px] font-medium text-foreground/80 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Mohan Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full h-11 pl-10 pr-3 rounded-xl bg-background border ${
                        errors.name ? "border-danger focus:ring-danger/25" : "border-border focus:ring-primary/25"
                      } text-[13.5px] focus:outline-none focus:ring-4 transition-all`}
                    />
                  </div>
                  {errors.name && <p className="text-danger text-[11px] mt-1.5">{errors.name}</p>}
                </div>

                {/* Email & Phone grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
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

                  {/* Phone */}
                  <div>
                    <label className="text-[12.5px] font-medium text-foreground/80 mb-1.5 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full h-11 pl-10 pr-3 rounded-xl bg-background border ${
                          errors.phone ? "border-danger focus:ring-danger/25" : "border-border focus:ring-primary/25"
                        } text-[13.5px] focus:outline-none focus:ring-4 transition-all`}
                      />
                    </div>
                    {errors.phone && <p className="text-danger text-[11px] mt-1.5">{errors.phone}</p>}
                  </div>
                </div>

                {/* DOB & Gender grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* DOB */}
                  <div>
                    <label className="text-[12.5px] font-medium text-foreground/80 mb-1.5 block">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className={`w-full h-11 pl-10 pr-3 rounded-xl bg-background border ${
                          errors.dob ? "border-danger focus:ring-danger/25" : "border-border focus:ring-primary/25"
                        } text-[13.5px] focus:outline-none focus:ring-4 transition-all`}
                      />
                    </div>
                    {errors.dob && <p className="text-danger text-[11px] mt-1.5">{errors.dob}</p>}
                  </div>

                  {/* Gender select */}
                  <div>
                    <label className="text-[12.5px] font-medium text-foreground/80 mb-1.5 block">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={`w-full h-11 px-3.5 rounded-xl bg-background border ${
                        errors.gender ? "border-danger focus:ring-danger/25" : "border-border focus:ring-primary/25"
                      } text-[13.5px] focus:outline-none focus:ring-4 transition-all`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-danger text-[11px] mt-1.5">{errors.gender}</p>}
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-4 pt-1">
                  {/* Password */}
                  <div>
                    <label className="text-[12.5px] font-medium text-foreground/80 mb-1.5 block">Password</label>
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

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2.5 space-y-1 animate-fade-in">
                        <div className="flex justify-between items-center text-[11px] font-medium">
                          <span className="text-muted-foreground">Password strength:</span>
                          <span className={
                            strength === 1 ? "text-danger" :
                            strength === 2 ? "text-warning" :
                            strength === 3 ? "text-primary" :
                            "text-success"
                          }>{strengthText}</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden flex gap-0.5">
                          <div className={`h-full rounded-full transition-all duration-300 ${strength >= 1 ? strengthColor : "bg-transparent"} flex-1`} />
                          <div className={`h-full rounded-full transition-all duration-300 ${strength >= 2 ? strengthColor : "bg-transparent"} flex-1`} />
                          <div className={`h-full rounded-full transition-all duration-300 ${strength >= 3 ? strengthColor : "bg-transparent"} flex-1`} />
                          <div className={`h-full rounded-full transition-all duration-300 ${strength >= 4 ? strengthColor : "bg-transparent"} flex-1`} />
                        </div>
                      </div>
                    )}
                    {errors.password && <p className="text-danger text-[11px] mt-1.5">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-[12.5px] font-medium text-foreground/80 mb-1.5 block">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full h-11 pl-10 pr-10 rounded-xl bg-background border ${
                          errors.confirmPassword ? "border-danger focus:ring-danger/25" : "border-border focus:ring-primary/25"
                        } text-[13.5px] focus:outline-none focus:ring-4 transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-danger text-[11px] mt-1.5">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-left select-none">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span className="text-[12.5px] leading-tight text-muted-foreground">
                      I agree to the <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>, and consent to electronic communication.
                    </span>
                  </label>
                  {errors.acceptTerms && <p className="text-danger text-[11px] mt-1.5">{errors.acceptTerms}</p>}
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
                        Create Account <ArrowRight className="h-4 w-4" />
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

                {/* Switch to Login */}
                <div className="pt-3 text-center text-[13.5px] text-muted-foreground">
                  Already have an RK Health account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-semibold">
                    Sign In
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
