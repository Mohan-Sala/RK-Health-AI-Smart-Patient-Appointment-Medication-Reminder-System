import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Camera, Pencil, Mail, Phone, Calendar, MapPin, HeartPulse } from "lucide-react";
import { toast } from "sonner";
import { authStore, profileStore } from "@/lib/store";
import { ProfileModal } from "@/components/modals/ProfileModal";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · RK Health" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const user = authStore.use();
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    void profileStore.hydrate();
  }, []);

  const handleSave = async (data: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    avatar: string;
    bloodGroup: string;
    height: string;
    weight: string;
    bmi: string;
    allergies: string;
    medicalConditions: string;
    insurance: string;
    lifestyle: string;
  }) => {
    try {
      await authStore.updateProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        gender: data.gender,
        avatar: data.avatar,
        bloodGroup: data.bloodGroup || null,
        height: data.height || null,
        weight: data.weight || null,
        bmi: data.bmi || null,
        allergies: data.allergies || null,
        medicalConditions: data.medicalConditions || null,
        insurance: data.insurance || null,
        lifestyle: data.lifestyle || null,
      });
      toast.success("Profile updated successfully");
      await profileStore.hydrate();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
      throw err;
    }
  };

  const formatValue = (value?: string | null, fallback = "Not Provided") => {
    if (!value || !String(value).trim()) return fallback;
    return value;
  };

  return (
    <AppLayout>
      <Topbar greeting="Profile" subtitle="Your personal & health information." />

      <PageHeader
        title="Profile"
        subtitle="Manage your account, health profile and contacts."
        actions={
          <button
            onClick={() => setEditOpen(true)}
            className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-[13.5px] font-medium inline-flex items-center gap-2 hover:opacity-90 transition"
          >
            <Pencil className="h-4 w-4" /> Edit Profile
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-surface p-6 text-center">
          <div className="relative inline-block">
            <img
              src={user?.avatar || "/images/default-avatar.png"}
              alt={user?.name || "User"}
              className="h-28 w-28 rounded-full object-cover ring-4 ring-card"
            />
            <button
              onClick={() => setEditOpen(true)}
              className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-soft"
              aria-label="Edit Profile"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 text-[18px] font-semibold">{user?.name || "User"}</div>
          <div className="text-[13px] text-muted-foreground">{user?.email || "Not Provided"}</div>
          <div className="text-[13px] text-muted-foreground">{user?.phone || "Not Provided"}</div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            <Mini label="Appointments" val="12" />
            <Mini label="Medications" val="24" />
            <Mini label="Reports" val="8" />
            <Mini label="AI Summaries" val="14" />
          </div>
        </div>

        <div className="card-surface p-6 lg:col-span-2">
          <SectionTitle>Personal Information</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info icon={Mail} label="Email" val={formatValue(user?.email)} />
            <Info icon={Phone} label="Phone" val={formatValue(user?.phone)} />
            <Info
              icon={Calendar}
              label="Date of Birth"
              val={user?.dob ? new Date(user.dob).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not Provided"}
            />
            <Info icon={MapPin} label="Address" val="Bengaluru, India" />
            <Info label="Gender" val={formatValue(user?.gender)} />
            <Info label="Emergency Contact" val={formatValue(user?.emergencyContactPhone)} />
          </div>

          <div className="my-6 h-px bg-border" />

          <SectionTitle>Health Information</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Info label="Blood Group" val={formatValue(user?.bloodGroup)} />
            <Info label="Height" val={user?.height ? `${user.height} cm` : "Not Provided"} />
            <Info label="Weight" val={user?.weight ? `${user.weight} kg` : "Not Provided"} />
            <Info label="BMI" val={formatValue(user?.bmi)} />
            <Info label="Allergies" val={formatValue(user?.allergies)} />
            <Info label="Medical Conditions" val={formatValue(user?.medicalConditions)} />
            <Info label="Insurance" val={formatValue(user?.insurance)} />
            <Info label="Lifestyle" val={formatValue(user?.lifestyle)} />
          </div>

          <div className="mt-6 rounded-2xl p-5 bg-linear-to-br from-primary/10 to-ai/10 border border-border flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-card grid place-items-center"><HeartPulse className="h-6 w-6 text-primary" /></div>
            <div className="flex-1">
              <div className="text-[14px] font-semibold">{user?.bmi ? `BMI ${user.bmi}` : "BMI Not Provided"}</div>
              <div className="text-[12.5px] text-muted-foreground">Keep your profile details up to date for better care tracking.</div>
            </div>
          </div>
        </div>
      </div>

      <ProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        onSave={handleSave}
      />
    </AppLayout>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[15px] font-semibold mb-4">{children}</h3>;
}

function Info({ icon: Icon, label, val }: { icon?: typeof Mail; label: string; val: string }) {
  return (
    <div className="rounded-xl border border-border p-3 bg-background">
      <div className="text-[11.5px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3" />} {label}
      </div>
      <div className="text-[13.5px] font-medium mt-1">{val || "Not Provided"}</div>
    </div>
  );
}

function Mini({ label, val }: { label: string; val: string }) {
  return (
    <div className="rounded-xl border border-border p-3 bg-background">
      <div className="text-[11.5px] text-muted-foreground">{label}</div>
      <div className="text-[18px] font-semibold leading-none mt-1">{val}</div>
    </div>
  );
}
