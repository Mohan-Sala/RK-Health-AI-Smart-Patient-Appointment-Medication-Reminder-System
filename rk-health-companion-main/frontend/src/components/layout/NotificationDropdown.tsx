import { useEffect, useRef, useState } from "react";
import { Bell, Pill, CalendarCheck2, BrainCircuit, FileDown, Clock, AlertTriangle } from "lucide-react";

type Tone = "primary" | "success" | "warning" | "ai" | "danger";
const toneBg: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  ai: "bg-ai/10 text-ai",
  danger: "bg-danger/10 text-danger",
};

const items = [
  { icon: Pill, tone: "ai" as Tone, title: "Medicine reminder sent", desc: "Paracetamol 500mg at 09:00 AM", time: "2m ago", unread: true },
  { icon: CalendarCheck2, tone: "primary" as Tone, title: "Appointment booked", desc: "Dr. Priya Mehta on May 24, 04:30 PM", time: "15m ago", unread: true },
  { icon: BrainCircuit, tone: "ai" as Tone, title: "AI summary generated", desc: "Visit summary for Dr. Rajesh Sharma", time: "1h ago", unread: true },
  { icon: FileDown, tone: "success" as Tone, title: "Report exported", desc: "Health report generated successfully", time: "3h ago", unread: false },
  { icon: Clock, tone: "warning" as Tone, title: "Upcoming appointment", desc: "Dental checkup tomorrow at 11:30 AM", time: "5h ago", unread: false },
  { icon: AlertTriangle, tone: "danger" as Tone, title: "Medicine missed", desc: "Omega 3 was skipped yesterday", time: "1d ago", unread: false },
];

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(items.filter((i) => i.unread).length);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative h-10 w-10 grid place-items-center rounded-full hover:bg-hover transition"
        aria-label="Notifications"
      >
        <Bell className="h-[18px] w-[18px] text-foreground/80" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-danger text-white text-[10px] font-semibold grid place-items-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[380px] max-w-[92vw] origin-top-right rounded-2xl bg-popover border border-border shadow-[var(--shadow-hover)] z-50 animate-scale-in">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="text-[15px] font-semibold">Notifications</div>
            <button
              onClick={() => setUnread(0)}
              className="text-[12px] font-medium text-primary hover:underline"
            >
              Mark all as read
            </button>
          </div>
          <div className="max-h-[360px] overflow-y-auto py-1">
            {items.map((n, i) => (
              <button
                key={i}
                className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-hover transition"
              >
                <div className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${toneBg[n.tone]}`}>
                  <n.icon className="h-[18px] w-[18px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-[13.5px] font-medium truncate">{n.title}</div>
                    {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                  </div>
                  <div className="text-[12.5px] text-muted-foreground truncate">{n.desc}</div>
                </div>
                <div className="text-[11px] text-muted-foreground shrink-0 pt-1">{n.time}</div>
              </button>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-border text-center">
            <button className="text-[13px] font-medium text-primary hover:underline">View all notifications</button>
          </div>
        </div>
      )}
    </div>
  );
}
