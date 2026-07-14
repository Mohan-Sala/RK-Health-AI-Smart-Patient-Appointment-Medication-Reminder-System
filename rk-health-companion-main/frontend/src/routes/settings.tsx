import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Bell, Calendar, BrainCircuit, Lock, Palette, Settings as SettingsIcon, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
import { authStore } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · RK Health" }] }),
  component: SettingsPage,
});

const tabs = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "sms", label: "Reminders (SMS)", icon: MessageSquare },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "ai", label: "AI Configuration", icon: BrainCircuit },
  { id: "privacy", label: "Privacy & Security", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function SettingsPage() {
  const user = authStore.use();
  const [tab, setTab] = useState("general");
  const { theme, setTheme } = useTheme();

  return (
    <AppLayout>
      <Topbar greeting="Settings" subtitle="Configure your RK Health experience." />

      <PageHeader title="Settings" subtitle="Personalize the way RK Health works for you." />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="card-surface p-3 h-fit">
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] transition ${tab===t.id ? "bg-primary/10 text-primary font-medium" : "text-foreground/80 hover:bg-hover"}`}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="card-surface p-6">
          {tab === "general" && (
            <Form title="General Settings" onSave={() => toast.success("Settings saved")}>
              <Field label="Theme">
                <div className="inline-flex rounded-xl border border-border bg-background p-1">
                  <button onClick={() => setTheme("light")} className={`h-9 px-4 rounded-lg text-[13px] ${theme==="light" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Light</button>
                  <button onClick={() => setTheme("dark")} className={`h-9 px-4 rounded-lg text-[13px] ${theme==="dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Dark</button>
                </div>
              </Field>
              <Field label="Language"><Select options={["English","Hindi","Spanish"]} /></Field>
              <Field label="Date Format"><Select options={["May 24, 2025","24/05/2025","2025-05-24"]} /></Field>
              <Field label="Time Format"><Select options={["12 Hour (AM/PM)","24 Hour"]} /></Field>
              <Field label="Timezone"><Select options={["Asia/Kolkata (IST)","UTC","America/New_York"]} /></Field>
              <Field label="Default View"><Select options={["Dashboard","Appointments","Medications"]} /></Field>
            </Form>
          )}
          {tab === "notifications" && (
            <Form title="Notifications" onSave={() => toast.success("Preferences saved")}>
              <Toggle label="SMS Notifications" defaultChecked />
              <Toggle label="Appointment Notifications" defaultChecked />
              <Toggle label="Medication Reminders" defaultChecked />
              <Toggle label="Email Notifications" />
              <Toggle label="Push Notifications" defaultChecked />
            </Form>
          )}
          {tab === "sms" && (
            <Form title="SMS Reminders" onSave={() => toast.success("SMS settings saved")}>
              <Field label="Phone Number"><input className="h-10 px-3 rounded-xl bg-background border border-border w-full text-[13.5px]" key={user?.phone} defaultValue={user?.phone || ""} /></Field>
              <Field label="Reminder Lead Time"><Select options={["10 minutes","30 minutes","1 hour"]} /></Field>
              <Toggle label="Send daily summary at 8 AM" defaultChecked />
            </Form>
          )}
          {tab === "calendar" && (
            <Form title="Calendar" onSave={() => toast.success("Calendar settings saved")}>
              <Toggle label="Google Calendar Sync" defaultChecked />
              <Field label="Default Reminder Time"><Select options={["15 min before","30 min before","1 hour before"]} /></Field>
              <Field label="Week Starts"><Select options={["Monday","Sunday"]} /></Field>
            </Form>
          )}
          {tab === "ai" && (
            <Form title="AI Configuration" onSave={() => toast.success("AI preferences saved")}>
              <Field label="Summary Length"><Select options={["Concise","Standard","Detailed"]} /></Field>
              <Toggle label="Include layman's explanation" defaultChecked />
              <Toggle label="Include medication schedule" defaultChecked />
            </Form>
          )}
          {tab === "privacy" && (
            <Form title="Privacy & Security" onSave={() => toast.success("Updated")}>
              <button className="h-10 px-4 rounded-xl border border-border text-[13.5px]">Change Password</button>
              <Toggle label="Two-factor authentication" />
              <Toggle label="Allow analytics" defaultChecked />
            </Form>
          )}
          {tab === "appearance" && (
            <Form title="Appearance" onSave={() => toast.success("Appearance updated")}>
              <Field label="Theme">
                <div className="grid grid-cols-3 gap-3">
                  {["light","dark","system"].map((t) => (
                    <button key={t} onClick={() => t !== "system" && setTheme(t as "light" | "dark")} className={`h-20 rounded-xl border-2 capitalize text-[13px] font-medium ${(theme===t || (t==="system" && false)) ? "border-primary bg-primary/5" : "border-border bg-background"}`}>{t}</button>
                  ))}
                </div>
              </Field>
            </Form>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

function Form({ title, children, onSave }: { title: string; children: React.ReactNode; onSave: () => void }) {
  return (
    <div>
      <h2 className="text-[18px] font-semibold mb-5">{title}</h2>
      <div className="space-y-5">{children}</div>
      <div className="mt-7 flex items-center gap-3">
        <button onClick={onSave} className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-[13.5px] font-medium">Save Changes</button>
        <button className="h-10 px-5 rounded-xl border border-border text-[13.5px]">Reset</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 items-center">
      <label className="text-[13.5px] text-muted-foreground">{label}</label>
      <div>{children}</div>
    </div>
  );
}

function Select({ options }: { options: string[] }) {
  return (
    <select className="h-10 px-3 rounded-xl bg-background border border-border text-[13.5px] w-full max-w-sm">
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-background">
      <span className="text-[13.5px]">{label}</span>
      <button onClick={() => setOn(!on)} className={`relative h-6 w-11 rounded-full transition ${on ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
