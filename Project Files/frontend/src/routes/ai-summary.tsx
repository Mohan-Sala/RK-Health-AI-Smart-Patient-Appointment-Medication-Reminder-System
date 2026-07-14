import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { BrainCircuit, Copy, Download, RefreshCw, Save, Sparkles, FileDown, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { appointmentsStore, searchStore } from "@/lib/store";

export const Route = createFileRoute("/ai-summary")({
  head: () => ({ meta: [{ title: "AI Summary · RK Health" }] }),
  component: AiSummaryPage,
});

// Fallback mock content if no backend summary is loaded yet
const initialMockSections = [
  { title: "Visit Overview", body: "Please select a doctor and click 'Generate Summary' to retrieve AI analysis of your consultation notes." },
  { title: "Medical Explanation", body: "Medical terminology will be automatically translated into plain, easy-to-understand explanations." },
  { title: "Diagnosis Notes", body: "Summary overview will display here." },
  { title: "Medication Instructions", body: "Custom dosage and schedule instructions will be generated from your prescribed medications." },
  { title: "Follow-up Advice", body: "Warning signs and emergency symptoms will be highlighted." },
  { title: "Recommendations", body: "Personalized diet, exercise, and lifestyle recommendations will appear here." },
];

// Helper to make API calls using the session token
const API_BASE = typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
  ? "/api"
  : "http://localhost:5000/api";

async function apiFetch(path: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", body?: any) {
  const token = localStorage.getItem("rk.token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const text = await response.text();
    let msg = "API Request Failed";
    try {
      const parsed = JSON.parse(text);
      msg = parsed.message || parsed.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return response.json();
}

function AiSummaryPage() {
  const appointments = appointmentsStore.use();
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [currentSummary, setCurrentSummary] = useState<any>(null);

  const fetchSummaries = async () => {
    try {
      const res = await apiFetch("/ai/summaries");
      if (res.success) {
        setSummaries(res.data);
      }
    } catch {}
  };

  useEffect(() => {
    appointmentsStore.hydrate();
    fetchSummaries();
  }, []);

  // Filter unique doctors from appointments sorted alphabetically
  const uniqueDoctors = useMemo(() => {
    return Array.from(new Set(appointments.map((a) => a.doctor)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [appointments]);

  // Handle default selection
  useEffect(() => {
    if (uniqueDoctors.length > 0 && !selectedDoctor) {
      setSelectedDoctor(uniqueDoctors[0]);
    }
  }, [uniqueDoctors]);

  // Find latest appointment matching selected doctor
  const appointment = useMemo(() => {
    const matches = appointments.filter((a) => a.doctor === selectedDoctor);
    if (matches.length === 0) return null;
    return matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [appointments, selectedDoctor]);

  // Sync current summary matching the appointment ID
  useEffect(() => {
    if (appointment) {
      const match = summaries.find((s) => s.appointmentId === appointment.id);
      setCurrentSummary(match || null);
    } else {
      setCurrentSummary(null);
    }
  }, [appointment, summaries]);

  // Search filter query sync
  const globalQ = searchStore.getQuery();
  useEffect(() => {
    if (globalQ && uniqueDoctors.length > 0) {
      const qLower = globalQ.toLowerCase();
      const match = uniqueDoctors.find(doc => doc.toLowerCase().includes(qLower));
      if (match) {
        setSelectedDoctor(match);
      }
      searchStore.setQuery("");
    }
  }, [globalQ, uniqueDoctors]);

  const generate = async () => {
    if (!appointment) {
      toast.error("Please add an appointment for this doctor first.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch("/ai/generate-summary", "POST", { appointmentId: appointment.id });
      if (res.success) {
        toast.success("AI summary generated successfully!");
        await fetchSummaries();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate AI summary.");
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async () => {
    if (!currentSummary) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/ai/summaries/${currentSummary.id}/regenerate`, "PUT");
      if (res.success) {
        toast.success("AI summary regenerated successfully!");
        await fetchSummaries();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to regenerate AI summary.");
    } finally {
      setLoading(false);
    }
  };

  const deleteSummary = async () => {
    if (!currentSummary) return;
    try {
      await apiFetch(`/ai/summaries/${currentSummary.id}`, "DELETE");
      toast.success("AI summary deleted.");
      await fetchSummaries();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete summary.");
    }
  };

  // Sections mapped from current loaded summary
  const displaySections = useMemo(() => {
    if (!currentSummary) return initialMockSections;
    return [
      { title: "Visit Overview", body: currentSummary.visitOverview },
      { title: "Medical Explanation", body: currentSummary.medicalExplanation },
      { title: "Diagnosis Notes", body: currentSummary.summary },
      { title: "Medication Instructions", body: currentSummary.medicationInstructions },
      { title: "Follow-up Advice", body: currentSummary.followUpAdvice },
      { title: "Recommendations", body: currentSummary.recommendations },
    ];
  }, [currentSummary]);

  const handleCopy = () => {
    if (!currentSummary) {
      toast.error("No summary generated yet.");
      return;
    }
    const fullText = displaySections.map(s => `[${s.title}]\n${s.body}`).join("\n\n");
    navigator.clipboard.writeText(fullText);
    toast.success("Summary text copied to clipboard!");
  };

  return (
    <AppLayout>
      <Topbar greeting="AI Summary" subtitle="Plain-language summaries powered by AI." />

      <PageHeader
        title="AI Summary"
        subtitle="Generate clear, patient-friendly summaries of medical visits."
      />

      <div className="card-surface p-5 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[260px]">
            <label className="text-[12px] text-muted-foreground">Select Doctor</label>
            <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl bg-background border border-border text-[13.5px]">
              {uniqueDoctors.length === 0 ? (
                <option value="">No doctors available</option>
              ) : (
                uniqueDoctors.map((doc) => (
                  <option key={doc} value={doc}>{doc}</option>
                ))
              )}
            </select>
          </div>
          <button onClick={generate} disabled={loading || !selectedDoctor} className="h-11 mt-5 px-5 rounded-xl bg-ai text-ai-foreground text-[13.5px] font-medium inline-flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50">
            <Sparkles className="h-4 w-4" /> {currentSummary ? "View Summary" : "Generate Summary"}
          </button>
        </div>
      </div>

      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-ai/10 text-ai grid place-items-center"><BrainCircuit className="h-5 w-5" /></div>
            <div>
              <div className="text-[16px] font-semibold">{currentSummary ? "AI Generated Summary" : "AI Summary Template"}</div>
              <div className="text-[12.5px] text-muted-foreground">
                {appointment ? `${appointment.visitType} · ${appointment.date}` : "No appointment selected"}
              </div>
            </div>
          </div>
          {currentSummary && (
            <div className="flex items-center gap-2">
              <ToolBtn icon={Copy} label="Copy" onClick={handleCopy} />
              <ToolBtn icon={RefreshCw} label="Regenerate" onClick={regenerate} />
              <ToolBtn icon={Trash2} label="Delete" onClick={deleteSummary} />
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-40 rounded bg-secondary animate-pulse" />
                <div className="h-3 w-full rounded bg-secondary animate-pulse" />
                <div className="h-3 w-11/12 rounded bg-secondary animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displaySections.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border p-5 bg-background">
                <div className="text-[13px] font-semibold text-ai mb-2">{s.title}</div>
                <p className="text-[13.5px] leading-relaxed text-foreground/85 whitespace-pre-line">{s.body}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={handleCopy} className="h-10 px-4 rounded-xl border border-border text-[13.5px] inline-flex items-center gap-2"><Copy className="h-4 w-4" /> Copy to Clipboard</button>
          {currentSummary && (
            <button onClick={regenerate} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-[13.5px] inline-flex items-center gap-2 ml-auto">Regenerate Summary</button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function ToolBtn({ icon: Icon, label, onClick }: { icon: typeof Copy; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} title={label} className="h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-hover text-muted-foreground transition">
      <Icon className="h-4 w-4" />
    </button>
  );
}
