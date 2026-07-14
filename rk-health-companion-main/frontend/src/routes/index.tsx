import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  HeartPulse,
  Menu,
  X,
  ArrowRight,
  Play,
  Calendar,
  Pill,
  BrainCircuit,
  FileText,
  CalendarDays,
  MessageSquare,
  Cloud,
  Smartphone,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  Star,
  Plus,
  Minus,
  Github,
  Linkedin,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RK Health · AI-Powered Healthcare Dashboard" },
      { name: "description", content: "Simplify your health journey. Manage appointments, track medications, generate AI health summaries, and export records — all in one premium platform." },
    ],
  }),
  component: LandingPage,
});

/* ---------- FAQ Item Component ---------- */
function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/80 py-4.5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors">
          {question}
        </span>
        <span className="shrink-0 ml-4 h-6 w-6 rounded-full bg-hover grid place-items-center text-muted-foreground group-hover:text-primary transition-colors">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "grid-rows-[1fr] opacity-100 mt-3.5" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-[14.5px] text-muted-foreground leading-relaxed pr-6">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Feature Card Component ---------- */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
}: {
  icon: typeof Calendar;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="card-surface hover-lift p-6 flex flex-col gap-4 border border-border/80 group">
      <div className={`h-12 w-12 rounded-2xl grid place-items-center shrink-0 ${color}`}>
        <Icon className="h-6 w-6 transition-transform group-hover:scale-110" strokeWidth={2.2} />
      </div>
      <div>
        <h3 className="text-[16.5px] font-semibold tracking-tight leading-none text-foreground">{title}</h3>
        <p className="text-[13.5px] text-muted-foreground mt-2 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      
      {/* 1. Header / Navigation Bar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-md py-3 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] border-b border-border/60"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.55_0.22_295)] grid place-items-center shadow-soft transition-transform group-hover:scale-105">
              <HeartPulse className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[18px] tracking-tight">RK Health</span>
          </Link>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-7">
            <a href="#features" className="text-[14px] font-medium text-foreground/80 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-[14px] font-medium text-foreground/80 hover:text-primary transition-colors">How It Works</a>
            <a href="#benefits" className="text-[14px] font-medium text-foreground/80 hover:text-primary transition-colors">Why RK Health</a>
            <a href="#faq" className="text-[14px] font-medium text-foreground/80 hover:text-primary transition-colors">FAQ</a>
          </nav>

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-[13.5px] font-semibold text-foreground/90 hover:text-primary hover:bg-hover px-4 py-2 rounded-xl transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-[13.5px] font-semibold bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] px-4.5 py-2.5 rounded-xl shadow-soft transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-10 w-10 rounded-xl hover:bg-hover grid place-items-center text-foreground transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border p-5 space-y-4 shadow-lg animate-fade-in">
            <nav className="flex flex-col gap-3">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-medium py-2 border-b border-border/50 text-foreground/80 hover:text-primary"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-medium py-2 border-b border-border/50 text-foreground/80 hover:text-primary"
              >
                How It Works
              </a>
              <a
                href="#benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-medium py-2 border-b border-border/50 text-foreground/80 hover:text-primary"
              >
                Why RK Health
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-medium py-2 text-foreground/80 hover:text-primary"
              >
                FAQ
              </a>
            </nav>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                className="w-full text-center py-2.5 rounded-xl border border-border text-[14px] font-medium hover:bg-hover transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-2.5 rounded-xl bg-primary text-primary-foreground text-[14px] font-semibold hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden px-5 sm:px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-primary tracking-widest uppercase bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> AI-Powered Health Assistant
            </span>
            <h1 className="text-[40px] sm:text-[50px] lg:text-[54px] font-bold leading-[1.1] tracking-tight text-foreground">
              AI-Powered Healthcare Management
            </h1>
            <p className="text-[17px] sm:text-[18px] text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Manage appointments, medications, health records, AI-powered summaries, reminders, and reports—all in one intelligent healthcare platform.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-95 font-semibold text-[14.5px] px-6 py-3 rounded-2xl shadow-soft transition active:scale-[0.98]"
              >
                Get Started <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <button
                className="inline-flex items-center gap-2 border border-border bg-card hover:bg-hover text-foreground font-semibold text-[14.5px] px-6 py-3 rounded-2xl shadow-soft transition active:scale-[0.98]"
              >
                <Play className="h-4 w-4 fill-foreground" /> Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Right Mockup illustration */}
          <div className="lg:col-span-6 relative w-full flex justify-center lg:justify-end animate-fade-in">
            {/* Dashboard UI mockup container */}
            <div className="w-full max-w-[550px] aspect-[1.3] bg-card border border-border rounded-3xl p-5 shadow-lg relative overflow-hidden select-none">
              
              {/* Header mockup */}
              <div className="flex justify-between items-center pb-4 border-b border-border mb-4">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="w-[180px] h-6 bg-hover rounded-xl border border-border" />
                <div className="h-6 w-6 rounded-full bg-hover" />
              </div>

              {/* Sidebar/Content layout mockup */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4 space-y-3 border-r border-border pr-2">
                  <div className="h-8 bg-primary/10 rounded-xl flex items-center px-3 gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <div className="h-2 w-12 bg-primary/40 rounded" />
                  </div>
                  <div className="h-8 hover:bg-hover rounded-xl flex items-center px-3 gap-2">
                    <div className="h-3 w-3 rounded-full bg-muted-foreground/35" />
                    <div className="h-2 w-14 bg-muted-foreground/30 rounded" />
                  </div>
                  <div className="h-8 hover:bg-hover rounded-xl flex items-center px-3 gap-2">
                    <div className="h-3 w-3 rounded-full bg-muted-foreground/35" />
                    <div className="h-2 w-10 bg-muted-foreground/30 rounded" />
                  </div>
                </div>

                <div className="col-span-8 space-y-4">
                  {/* Fake stats widget */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card border border-border p-3 rounded-2xl flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Appointments</span>
                      <span className="text-[20px] font-bold">12</span>
                    </div>
                    <div className="bg-card border border-border p-3 rounded-2xl flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Medications</span>
                      <span className="text-[20px] font-bold text-success">5/6</span>
                    </div>
                  </div>

                  {/* Fake AI summary box */}
                  <div className="bg-gradient-to-br from-[oklch(0.97_0.03_295)] to-[oklch(0.96_0.04_270)] border border-border p-3 rounded-2xl space-y-2">
                    <div className="flex gap-2 items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-ai animate-pulse" />
                      <div className="h-2.5 w-24 bg-ai/40 rounded" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 bg-foreground/60 rounded w-[90%]" />
                      <div className="h-2 bg-foreground/60 rounded w-[70%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Soft decorative shadow/glow behind mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-primary/10 rounded-full blur-[60px] z-[-1]" />
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-sidebar/55 border-y border-border px-5 sm:px-8">
        <div className="max-w-[1400px] mx-auto space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-[12px] font-bold tracking-widest text-primary uppercase bg-primary/10 px-3.5 py-1.5 rounded-full">Features</span>
            <h2 className="text-[32px] sm:text-[38px] font-bold tracking-tight text-foreground">
              Everything You Need in One Place
            </h2>
            <p className="text-[15.5px] text-muted-foreground leading-relaxed">
              Consolidate your healthcare monitoring, medicine prescriptions, and calendar schedule, powered by advanced automated AI insights.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Calendar}
              title="Appointment Management"
              desc="Book and coordinate medical consultations with your practitioners effortlessly."
              color="bg-primary/10 text-primary"
            />
            <FeatureCard
              icon={Pill}
              title="Medication Reminders"
              desc="Real-time compliance charts tracking your dosages, schedules, and compliance ratios."
              color="bg-success/10 text-success"
            />
            <FeatureCard
              icon={BrainCircuit}
              title="AI Health Summaries"
              desc="Instantly analyze complex medical consultation logs into clear, actionable bullet points."
              color="bg-ai/10 text-ai"
            />
            <FeatureCard
              icon={FileText}
              title="Health Reports"
              desc="Consolidate health compliance metrics and export clean PDFs for medical examinations."
              color="bg-primary/10 text-primary"
            />
            <FeatureCard
              icon={CalendarDays}
              title="Google Calendar Integration"
              desc="Automatically synchronize checkups and clinical tests straight to your Google Calendar."
              color="bg-warning/10 text-[oklch(0.55_0.17_60)]"
            />
            <FeatureCard
              icon={MessageSquare}
              title="SMS Notifications"
              desc="Receive secure text message alerts before medication schedules or doctor visits."
              color="bg-success/10 text-success"
            />
            <FeatureCard
              icon={Cloud}
              title="Cloud-Based Health Records"
              desc="Safely view, edit, and archive clinical records from any terminal."
              color="bg-primary/10 text-primary"
            />
            <FeatureCard
              icon={Smartphone}
              title="Responsive Dashboard"
              desc="Beautiful, fluid interfaces adapted to computer monitors, tablets, and smartphones."
              color="bg-ai/10 text-ai"
            />
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-[1400px] mx-auto space-y-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-[12px] font-bold tracking-widest text-primary uppercase bg-primary/10 px-3.5 py-1.5 rounded-full">Process</span>
            <h2 className="text-[32px] sm:text-[38px] font-bold tracking-tight text-foreground">
              Simple 4-Step Setup
            </h2>
            <p className="text-[15.5px] text-muted-foreground leading-relaxed">
              Unlock the power of automated healthcare records. Here is how easy it is to start:
            </p>
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="text-center space-y-4 flex flex-col items-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary font-bold text-[19px] grid place-items-center shadow-soft border border-primary/20">
                1
              </div>
              <h3 className="text-[17px] font-semibold text-foreground">Create Your Account</h3>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed px-4">
                Register inside our secure portal with your email and basic personal details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4 flex flex-col items-center">
              <div className="h-14 w-14 rounded-2xl bg-success/10 text-success font-bold text-[19px] grid place-items-center shadow-soft border border-success/20">
                2
              </div>
              <h3 className="text-[17px] font-semibold text-foreground">Add Appointments & Meds</h3>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed px-4">
                Input your prescription schedules and upcoming consultation appointments.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4 flex flex-col items-center">
              <div className="h-14 w-14 rounded-2xl bg-ai/10 text-ai font-bold text-[19px] grid place-items-center shadow-soft border border-ai/20">
                3
              </div>
              <h3 className="text-[17px] font-semibold text-foreground">Generate AI Summaries</h3>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed px-4">
                Paste doctor logs and compile instantaneous structured summaries.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center space-y-4 flex flex-col items-center">
              <div className="h-14 w-14 rounded-2xl bg-warning/10 text-[oklch(0.55_0.17_60)] font-bold text-[19px] grid place-items-center shadow-soft border border-warning/20">
                4
              </div>
              <h3 className="text-[17px] font-semibold text-foreground">Track Your Health</h3>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed px-4">
                Monitor compliance metrics and visual trend lines inside the dashboard.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Benefits Section */}
      <section id="benefits" className="py-20 bg-sidebar/55 border-y border-border px-5 sm:px-8">
        <div className="max-w-[1400px] mx-auto space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-[12px] font-bold tracking-widest text-primary uppercase bg-primary/10 px-3.5 py-1.5 rounded-full">Benefits</span>
            <h2 className="text-[32px] sm:text-[38px] font-bold tracking-tight text-foreground">
              Built for Modern Patients
            </h2>
          </div>

          {/* Stats cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-surface p-6 flex flex-col items-center text-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center"><Cloud className="h-5 w-5" /></div>
              <div className="text-[32px] font-bold tracking-tight leading-none text-primary">100%</div>
              <div className="text-[14px] font-semibold">Cloud Based</div>
              <p className="text-[12.5px] text-muted-foreground">Access your secure patient charts anytime, anywhere, on any terminal.</p>
            </div>
            <div className="card-surface p-6 flex flex-col items-center text-center gap-3">
              <div className="h-10 w-10 rounded-full bg-success/10 text-success grid place-items-center"><Clock className="h-5 w-5" /></div>
              <div className="text-[32px] font-bold tracking-tight leading-none text-success">24/7</div>
              <div className="text-[14px] font-semibold">Access Anywhere</div>
              <p className="text-[12.5px] text-muted-foreground">Never miss a dose or schedule with continuous system background syncing.</p>
            </div>
            <div className="card-surface p-6 flex flex-col items-center text-center gap-3">
              <div className="h-10 w-10 rounded-full bg-ai/10 text-ai grid place-items-center"><BrainCircuit className="h-5 w-5" /></div>
              <div className="text-[32px] font-bold tracking-tight leading-none text-ai">AI Powered</div>
              <div className="text-[14px] font-semibold">Smart Insights</div>
              <p className="text-[12.5px] text-muted-foreground">Transform complex test statistics and records into readable reports.</p>
            </div>
            <div className="card-surface p-6 flex flex-col items-center text-center gap-3">
              <div className="h-10 w-10 rounded-full bg-warning/10 text-[oklch(0.55_0.17_60)] grid place-items-center"><Shield className="h-5 w-5" /></div>
              <div className="text-[32px] font-bold tracking-tight leading-none text-[oklch(0.55_0.17_60)]">Secure</div>
              <div className="text-[14px] font-semibold">Healthcare Data</div>
              <p className="text-[12.5px] text-muted-foreground">Fully protected medical directory hosting with high level credentials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-[1400px] mx-auto space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-[12px] font-bold tracking-widest text-primary uppercase bg-primary/10 px-3.5 py-1.5 rounded-full">Testimonials</span>
            <h2 className="text-[32px] sm:text-[38px] font-bold tracking-tight text-foreground">
              What Our Patients Say
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card-surface p-6.5 space-y-4 border border-border/80 hover-lift flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex gap-0.5 text-warning">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4.5 w-4.5 fill-current" />)}
                </div>
                <p className="text-[14px] text-foreground/85 italic leading-relaxed">
                  "RK Health has totally transformed how I manage my diabetic medications. The compliance donut chart helps me remember my morning doses, and having my cardiologist appointments in one list is super helpful."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <img
                  src="https://i.pravatar.cc/80?img=32"
                  alt="Ananya Sharma"
                  className="h-9 w-9 rounded-full object-cover shrink-0"
                />
                <div className="text-left">
                  <div className="text-[13.5px] font-semibold">Ananya Sharma</div>
                  <div className="text-[11.5px] text-muted-foreground">Chronic Patient</div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card-surface p-6.5 space-y-4 border border-border/80 hover-lift flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex gap-0.5 text-warning">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4.5 w-4.5 fill-current" />)}
                </div>
                <p className="text-[14px] text-foreground/85 italic leading-relaxed">
                  "The AI consultations summary is like magic. I just copy in the long text report from my hospital doctor, and it parses it down into clear instructions. My family can easily understand it too."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <img
                  src="https://i.pravatar.cc/80?img=47"
                  alt="Dr. Ramesh Sen"
                  className="h-9 w-9 rounded-full object-cover shrink-0"
                />
                <div className="text-left">
                  <div className="text-[13.5px] font-semibold">Ramesh Sen</div>
                  <div className="text-[11.5px] text-muted-foreground">Retired Professor</div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card-surface p-6.5 space-y-4 border border-border/80 hover-lift flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex gap-0.5 text-warning">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4.5 w-4.5 fill-current" />)}
                </div>
                <p className="text-[14px] text-foreground/85 italic leading-relaxed">
                  "I love the clean interface. It feels so premium and reminds me of Apple Health but with the convenience of a web dashboard. I can access it from my phone and view all my reports in a click."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <img
                  src="https://i.pravatar.cc/80?img=59"
                  alt="Kunal Verma"
                  className="h-9 w-9 rounded-full object-cover shrink-0"
                />
                <div className="text-left">
                  <div className="text-[13.5px] font-semibold">Kunal Verma</div>
                  <div className="text-[11.5px] text-muted-foreground">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section id="faq" className="py-20 sm:py-28 bg-sidebar/55 border-y border-border px-5 sm:px-8">
        <div className="max-w-[800px] mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-[12px] font-bold tracking-widest text-primary uppercase bg-primary/10 px-3.5 py-1.5 rounded-full">FAQ</span>
            <h2 className="text-[32px] sm:text-[38px] font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Accordion list */}
          <div className="card-surface p-6.5 sm:p-8 rounded-3xl border border-border/80">
            <AccordionItem
              question="How does RK Health work?"
              answer="RK Health is a unified healthcare management application. You can input your upcoming doctor appointments, track your medicine compliance schedules, generate reports, and utilize our integrated AI helper to translate complex clinical consult notes into readable digests."
            />
            <AccordionItem
              question="Is my healthcare data secure?"
              answer="Absolutely. We implement secure data stores, credential verification rules, and modern encryption standards to protect your health summaries and files. Only you have authorization to view and update your data."
            />
            <AccordionItem
              question="Can I access it on mobile?"
              answer="Yes. The dashboard and landing pages are completely responsive and adapted for mobile viewport devices. It operates fluidly on mobile browsers without requiring a separate app installation."
            />
            <AccordionItem
              question="How are AI summaries generated?"
              answer="We employ natural language models that analyze clinical transcription text or medical consultation logs. It securely extracts key elements, diagnoses, advice, and prescriptions, grouping them into clean bullet points."
            />
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-background py-16 px-5 sm:px-8 border-t border-border">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Left brand info */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.55_0.22_295)] grid place-items-center">
                <HeartPulse className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-[18px] tracking-tight">RK Health</span>
            </div>
            <p className="text-[13.5px] text-muted-foreground max-w-sm leading-relaxed">
              Simplify your healthcare journey. Track prescriptions, view appointment dates, and inspect automated AI consultations in a clean space.
            </p>
            <div className="flex gap-4.5 pt-2 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Github"><Github className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 text-left">
            <h4 className="text-[13.5px] font-bold text-foreground uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-[13.5px] text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">Platform Features</a></li>
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="#benefits" className="hover:text-primary transition-colors">Why RK Health</a></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Sign In Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 text-left">
            <h4 className="text-[13.5px] font-bold text-foreground uppercase tracking-wider mb-4">Contact Support</h4>
            <ul className="space-y-2.5 text-[13.5px] text-muted-foreground">
              <li>Email: support@rkhealth.com</li>
              <li>Phone: +91 80 555-0199</li>
              <li>Location: Bengaluru, Karnataka, India</li>
            </ul>
          </div>
        </div>

        {/* Copyright info */}
        <div className="max-w-[1400px] mx-auto flex flex-wrap justify-between items-center border-t border-border/80 mt-12 pt-8 text-[12.5px] text-muted-foreground/75">
          <span>© 2026 RK Health Inc. All rights reserved.</span>
          <div className="flex gap-5 mt-4 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
