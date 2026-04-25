import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardList,
  Cpu,
  Globe2,
  HeartPulse,
  Loader2,
  Map,
  MapPin,
  Radio,
  Send,
  Shield,
  Sparkles,
  Target,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const MotionArticle = motion.article;
const MotionDiv = motion.div;
const MotionSection = motion.section;

const explicitApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = explicitApiBaseUrl
  ? explicitApiBaseUrl.replace(/\/$/, "")
  : "/api";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const commandCards = [
  {
    icon: Radio,
    title: "Signal Intake",
    text: "Live reports, field requests, and responder updates resolve into one clear operating picture.",
    glow: "shadow-[0_0_42px_rgba(236,72,153,0.24)]",
    iconGlow: "bg-pink-400/18 text-pink-100 shadow-[0_0_28px_rgba(236,72,153,0.38)]",
  },
  {
    icon: Cpu,
    title: "Agentic Routing",
    text: "Task agents rank urgency, match skills, and route volunteers to the highest-impact work.",
    glow: "shadow-[0_0_42px_rgba(168,85,247,0.25)]",
    iconGlow: "bg-violet-400/18 text-violet-100 shadow-[0_0_28px_rgba(168,85,247,0.38)]",
  },
  {
    icon: Map,
    title: "Geo Awareness",
    text: "Priority zones, safe paths, and nearby resources stay visible as conditions shift.",
    glow: "shadow-[0_0_42px_rgba(34,211,238,0.23)]",
    iconGlow: "bg-cyan-400/18 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.36)]",
  },
  {
    icon: Users,
    title: "Volunteer Mesh",
    text: "Teams coordinate across roles without losing context, accountability, or momentum.",
    glow: "shadow-[0_0_42px_rgba(59,130,246,0.24)]",
    iconGlow: "bg-blue-400/18 text-blue-100 shadow-[0_0_28px_rgba(59,130,246,0.36)]",
  },
  {
    icon: Shield,
    title: "Trust Layer",
    text: "Sensitive details are filtered, verified, and surfaced only where they belong.",
    glow: "shadow-[0_0_42px_rgba(20,184,166,0.22)]",
    iconGlow: "bg-teal-400/18 text-teal-100 shadow-[0_0_28px_rgba(20,184,166,0.34)]",
  },
];

const featureCards = [
  {
    icon: Zap,
    title: "Instant Triage",
    text: "Classify reports and push response queues into action.",
    glow: "hover:shadow-[0_0_54px_rgba(236,72,153,0.35)]",
  },
  {
    icon: HeartPulse,
    title: "Relief Pulse",
    text: "Track demand, coverage, and unresolved needs in real time.",
    glow: "hover:shadow-[0_0_54px_rgba(34,211,238,0.34)]",
  },
  {
    icon: Activity,
    title: "Ops Clarity",
    text: "Keep decisions aligned across coordinators and field teams.",
    glow: "hover:shadow-[0_0_54px_rgba(168,85,247,0.35)]",
  },
  {
    icon: Globe2,
    title: "Civic Scale",
    text: "Expand from local action to multi-region volunteer networks.",
    glow: "hover:shadow-[0_0_54px_rgba(59,130,246,0.34)]",
  },
];

const resourceLabels = {
  medical_team: "Medical",
  food_supply_team: "Food Supply",
  rescue_team: "Rescue",
  logistics_team: "Logistics",
};

function severityTone(severity = "") {
  const normalized = severity.toLowerCase();

  if (normalized.includes("high") || normalized.includes("critical")) {
    return "text-pink-100 bg-pink-400/15 shadow-[0_0_28px_rgba(236,72,153,0.28)]";
  }

  if (normalized.includes("medium")) {
    return "text-violet-100 bg-violet-400/15 shadow-[0_0_28px_rgba(168,85,247,0.24)]";
  }

  return "text-cyan-100 bg-cyan-400/15 shadow-[0_0_28px_rgba(34,211,238,0.22)]";
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-[-30%] animate-mesh bg-[radial-gradient(circle_at_18%_12%,rgba(236,72,153,0.28),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_50%_84%,rgba(168,85,247,0.24),transparent_32%),linear-gradient(135deg,#05020d_0%,#090419_44%,#030712_100%)] blur-2xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,2,13,0.22)_55%,rgba(5,2,13,0.92)_100%)]" />
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <MotionArticle
      variants={fadeUp}
      whileHover={{ y: -8, scale: 1.025 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`rounded-2xl bg-white/10 p-6 backdrop-blur-xl ring-1 ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_24px_80px_rgba(2,6,23,0.35)] transition-all duration-300 hover:bg-white/[0.14] ${className}`}
    >
      {children}
    </MotionArticle>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <MotionDiv
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto mb-8 max-w-3xl text-center"
    >
      <p className="mb-3 text-sm font-semibold uppercase text-cyan-200/80">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-white md:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">{text}</p>
    </MotionDiv>
  );
}

function HeroIntelligenceVisual() {
  return (
    <div className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-white/[0.14] via-white/[0.05] to-cyan-300/[0.08] p-6 ring-1 ring-white/10">
      <div className="absolute inset-0 bg-[conic-gradient(from_140deg_at_50%_45%,rgba(236,72,153,0.18),rgba(168,85,247,0.18),rgba(34,211,238,0.16),rgba(236,72,153,0.18))] opacity-70 blur-2xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:42px_42px] opacity-25" />
      <div className="absolute left-8 right-8 top-10 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100/80">
              Live Command
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">Agentic response core</p>
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-pink-100 ring-1 ring-white/15">
            Active
          </div>
        </div>

        <div className="relative rounded-[2rem] bg-black/20 p-8 sm:p-10 ring-1 ring-white/15 backdrop-blur-xl">
          <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-pink-300/0 via-cyan-200/60 to-pink-300/0" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-400/15 text-pink-100">
                  <Radio className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Signal Intake</p>
                  <p className="text-xs text-slate-300">Crisis input</p>
                </div>
              </div>
            </div>

            <div className="flex h-28 w-28 animate-pulse-glow items-center justify-center rounded-[2rem] bg-gradient-to-br from-pink-400/20 to-cyan-300/20 ring-1 ring-white/20 shadow-[0_0_46px_rgba(34,211,238,0.28)]">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-black/25">
                <Cpu className="h-8 w-8 text-cyan-100" />
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-100">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Volunteer Sync</p>
                  <p className="text-xs text-slate-300">Team routing</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Location", value: "Pinned fast" },
              { label: "Priority", value: "Scored live" },
              { label: "Teams", value: "Ready to deploy" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-white/10 px-4 py-4 text-center ring-1 ring-white/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, tone = "" }) {
  const MetricIcon = icon;

  return (
    <div
      className={`rounded-2xl bg-white/10 p-5 backdrop-blur-xl ring-1 ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] ${tone}`}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-cyan-100">
        <MetricIcon className="h-5 w-5" />
      </div>
      <p className="text-sm uppercase text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value || "Unknown"}</p>
    </div>
  );
}

function buildGoogleMapsEmbedUrl(location) {
  if (!location || location === "Unknown") {
    return "";
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=13&output=embed`;
}

function buildGoogleMapsLink(location) {
  if (!location || location === "Unknown") {
    return "#";
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

function normalizeLocationCandidate(candidate) {
  return candidate.replace(/\s+/g, " ").replace(/^[,\s.-]+|[,\s.-]+$/g, "").trim();
}

function isLikelyLocationCandidate(candidate) {
  if (!candidate) {
    return false;
  }

  const normalized = candidate.toLowerCase();

  if (/^\d/.test(candidate)) {
    return false;
  }

  if (
    normalized.startsWith("least ") ||
    normalized === "critical condition" ||
    normalized.startsWith("critical condition ") ||
    normalized.includes(" beyond capacity") ||
    normalized.includes(" trapped") ||
    normalized.includes(" injured")
  ) {
    return false;
  }

  return candidate.length <= 80 && candidate.split(/\s+/).length <= 8;
}

function extractLocationFromText(text) {
  if (!text) {
    return "";
  }

  const patterns = [
    /\b(?:in|near|around|from)\s+([^.!?;]+?)(?=\s+(?:with|where|and|need|needs|multiple|several|people|families|injured|trapped|blocked|overwhelmed|without|after|following)\b|[.!?;]|$)/iu,
    /\bat\s+(?!least\b)([^.!?;]+?)(?=\s+(?:with|where|and|need|needs|multiple|several|people|families|injured|trapped|blocked|overwhelmed|without|after|following|operating)\b|[.!?;]|$)/iu,
    /\b(?:such as|including)\s+([^.!?;]+?)(?=\s+(?:is|are|was|were|has|have|need|needs|reported|overwhelmed|operating)\b|[.!?;]|$)/iu,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    const candidate = normalizeLocationCandidate(match?.[1] ?? "");

    if (isLikelyLocationCandidate(candidate)) {
      return candidate;
    }
  }

  return "";
}

function isMockResult(result) {
  return [result?.cleaned_input, result?.assigned_volunteer, result?.reasoning_summary].some(
    (value) => typeof value === "string" && value.toLowerCase().includes("mock"),
  );
}

function deriveMapContext(result, fallbackText) {
  const extractedLocation =
    extractLocationFromText(result?.raw_input) ||
    extractLocationFromText(result?.cleaned_input) ||
    extractLocationFromText(fallbackText);

  const reportedLocation =
    !isMockResult(result) && result?.location && result.location !== "Unknown"
      ? result.location
      : "";

  const resolvedLocation = extractedLocation || reportedLocation || "";

  const mapQuery = resolvedLocation;

  return {
    displayLocation: resolvedLocation || "Location pending",
    mapQuery,
  };
}

function LocationMapCard({ location, mapQuery }) {
  const embedUrl = buildGoogleMapsEmbedUrl(mapQuery);
  const openMapUrl = buildGoogleMapsLink(mapQuery);

  return (
    <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-cyan-100">
            <MapPin className="h-5 w-5" />
            <h4 className="font-semibold text-white">Location Intelligence</h4>
          </div>
          <p className="mt-2 text-sm text-slate-300">{location || "Location pending"}</p>
        </div>
        {embedUrl ? (
          <a
            href={openMapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition duration-300 hover:bg-white/[0.14]"
          >
            Open Map
            <ArrowRight className="h-4 w-4" />
          </a>
        ) : null}
      </div>

      {embedUrl ? (
        <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
          <iframe
            title={`Map for ${location || "resolved location"}`}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full border-0 bg-black/20"
          />
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center rounded-2xl bg-black/20 text-center text-sm text-slate-300 ring-1 ring-white/10">
          A precise map will appear here once the agent resolves a usable location.
        </div>
      )}
    </div>
  );
}

async function ensureAgentServiceAvailable() {
  const healthAbortController = new AbortController();
  const healthTimeoutId = window.setTimeout(() => healthAbortController.abort(), 4000);

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: healthAbortController.signal,
    });

    if (!response.ok) {
      throw new Error();
    }
  } catch {
    throw new Error(
      "Could not reach the agentic AI service. Start the FastAPI backend on port 8001, or set VITE_API_BASE_URL.",
    );
  } finally {
    window.clearTimeout(healthTimeoutId);
  }
}

function buildPipelineErrorMessage(response, data) {
  if ([500, 502, 503, 504].includes(response.status)) {
    return "Could not reach the agentic AI service. Start the FastAPI backend on port 8001, or set VITE_API_BASE_URL.";
  }

  return data?.detail || data?.error || `The agent pipeline returned ${response.status}.`;
}

function CrisisConsole() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function analyzeCrisis(event) {
    event.preventDefault();
    const text = description.trim();

    if (!text) {
      setError("Describe the crisis first so the agents have a signal to analyze.");
      setResult(null);
      return;
    }

    setError("");
    setIsLoading(true);
    const abortController = new AbortController();
    const timeoutId = window.setTimeout(() => abortController.abort(), 45000);

    try {
      await ensureAgentServiceAvailable();

      const response = await fetch(`${API_BASE_URL}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
        body: JSON.stringify({ text }),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(buildPipelineErrorMessage(response, data));
      }

      if (!data) {
        throw new Error("The agent pipeline returned an empty response.");
      }

      if (data.error) {
        throw new Error(data.detail || data.error);
      }

      setResult(data);
    } catch (requestError) {
      setResult(null);
      if (requestError.name === "AbortError") {
        setError("The agent pipeline took too long to respond. Try a shorter crisis description.");
        return;
      }

      const isNetworkFailure =
        requestError instanceof TypeError && requestError.message === "Failed to fetch";

      setError(
        isNetworkFailure
          ? "Could not reach the agentic AI service. Start the FastAPI backend on port 8001, or set VITE_API_BASE_URL."
          : requestError.message ||
              "Could not reach the agentic AI service. Make sure the backend is running.",
      );
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }

  const resourceDistribution = result?.resource_distribution ?? {};
  const volunteerPlan = Array.isArray(result?.volunteer_plan) ? result.volunteer_plan : [];
  const mapContext = deriveMapContext(result, description);

  return (
    <MotionSection
      id="agent-console"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="py-16"
    >
      <div className="rounded-[2rem] bg-white/10 p-6 backdrop-blur-xl ring-1 ring-white/15 shadow-[0_0_95px_rgba(236,72,153,0.18),inset_0_1px_0_rgba(255,255,255,0.16)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="flex flex-col gap-6">
            <form onSubmit={analyzeCrisis} className="flex flex-col">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 ring-1 ring-white/15">
                <Bot className="h-4 w-4 text-pink-200" />
                Agentic AI Console
              </div>

              <h2 className="max-w-xl bg-gradient-to-r from-pink-200 via-fuchsia-200 to-cyan-200 bg-clip-text pb-1 text-2xl font-semibold leading-[1.1] text-transparent sm:text-3xl lg:text-4xl">
                Tell the crisis. Get the response plan.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">
                Enter what happened, where it happened, and who needs help. The agent pipeline will
                classify the situation, score priority, and assign volunteer teams.
              </p>

              <label htmlFor="crisis-description" className="sr-only">
                Crisis description
              </label>
              <textarea
                id="crisis-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Example: Heavy flooding in Wayanad. 35 people trapped, drinking water shortage, two injured, road access blocked."
                className="mt-7 min-h-52 resize-none rounded-2xl bg-black/25 p-5 text-base leading-7 text-white outline-none ring-1 ring-white/15 backdrop-blur-xl transition duration-300 placeholder:text-slate-400 focus:bg-white/10 focus:ring-cyan-200/50 focus:shadow-[0_0_44px_rgba(34,211,238,0.18)]"
              />

              {error ? (
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-pink-500/12 p-4 text-sm text-pink-100 ring-1 ring-pink-200/20">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-none" />
                  <p>{error}</p>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-5 inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400 px-7 py-4 font-semibold text-white shadow-[0_0_38px_rgba(236,72,153,0.38),0_18px_65px_rgba(34,211,238,0.18)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_54px_rgba(34,211,238,0.38),0_20px_80px_rgba(236,72,153,0.24)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Agents Thinking
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Analyze Crisis
                  </>
                )}
              </button>
            </form>

            <MotionDiv
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex-1"
            >
              <LocationMapCard
                location={mapContext.displayLocation}
                mapQuery={mapContext.mapQuery}
              />
            </MotionDiv>
          </div>

          <div className="min-h-[580px] rounded-[1.75rem] bg-black/20 p-5 ring-1 ring-white/15 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:p-6">
            {result ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase text-cyan-200/80">Agent Output</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      {result.need_type || "Response"} plan for {result.location || "Unknown"}
                    </h3>
                  </div>
                  <span
                    className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${severityTone(
                      result.severity,
                    )}`}
                  >
                    {result.severity || "Unknown"} severity
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard icon={MapPin} label="Location" value={mapContext.displayLocation} />
                  <MetricCard icon={Users} label="People" value={result.people_count} />
                  <MetricCard icon={Target} label="Priority" value={result.priority_score} />
                  <MetricCard icon={UserCheck} label="Volunteers" value={result.volunteer_count} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
                    <div className="mb-4 flex items-center gap-3 text-cyan-100">
                      <ClipboardList className="h-5 w-5" />
                      <h4 className="font-semibold text-white">Resource Distribution</h4>
                    </div>
                    <div className="grid gap-3">
                      {Object.entries(resourceLabels).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{label}</span>
                          <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-white">
                            {resourceDistribution[key] ?? 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
                    <div className="mb-4 flex items-center gap-3 text-cyan-100">
                      <CheckCircle2 className="h-5 w-5" />
                      <h4 className="font-semibold text-white">Reasoning Summary</h4>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">
                      {result.reasoning_summary || "The agents returned a response plan."}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-4 text-lg font-semibold text-white">Volunteer Assignments</h4>
                  <div className="grid gap-4 xl:grid-cols-2">
                    {volunteerPlan.length ? (
                      volunteerPlan.map((volunteer, index) => (
                        <div
                          key={`${volunteer.name || "volunteer"}-${index}`}
                          className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 transition duration-300 hover:bg-white/[0.14] hover:shadow-[0_0_42px_rgba(34,211,238,0.18)]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-white">
                                {volunteer.name || `Volunteer ${index + 1}`}
                              </p>
                              <p className="mt-1 text-sm text-cyan-200">
                                {volunteer.role || "Field Volunteer"} -{" "}
                                {volunteer.organization || "Aid Partner"}
                              </p>
                            </div>
                            <span className="rounded-full bg-pink-400/15 px-3 py-1 text-xs font-semibold text-pink-100">
                              Unit {index + 1}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {(volunteer.skills || []).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 ring-1 ring-white/10"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          <p className="mt-4 text-sm leading-6 text-slate-300">
                            <span className="font-semibold text-white">Strength:</span>{" "}
                            {volunteer.strength || "Rapid field coordination"}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            <span className="font-semibold text-white">Task:</span>{" "}
                            {volunteer.assigned_task || "Support the response team"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl bg-white/10 p-5 text-slate-300 ring-1 ring-white/15">
                        No volunteer assignments were returned.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[520px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.28)]">
                  <Bot className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Awaiting crisis signal</h3>
                <p className="mt-3 max-w-md leading-7 text-slate-300">
                  The analysis plan will appear here with priority, resource distribution, and
                  volunteer assignments.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05020d] text-white">
      <AmbientBackground />

      <MotionSection
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative z-10 flex min-h-[92vh] items-center justify-center px-5 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid w-full max-w-[1360px] items-center gap-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.028))] px-5 py-5 backdrop-blur-[26px] ring-1 ring-white/12 shadow-[0_0_72px_rgba(168,85,247,0.16),inset_0_1px_0_rgba(255,255,255,0.12)] sm:px-6 sm:py-7 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:py-9">
          <MotionDiv variants={fadeUp} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
              <Sparkles className="h-4 w-4 text-pink-200" />
              AidFlow
            </div>

            <h1 className="max-w-4xl bg-gradient-to-r from-pink-300 via-fuchsia-300 to-cyan-300 bg-clip-text pb-2 text-5xl font-semibold leading-[1.05] text-transparent sm:text-6xl lg:text-7xl">
              Agentic Volunteer Intelligence
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200/86 sm:text-xl lg:text-[1.2rem]">
              Describe a crisis and let coordinated AI agents classify urgency, prioritize needs,
              and assign volunteer teams in one calm mission interface.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#agent-console"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400 px-7 py-4 font-semibold text-white shadow-[0_0_38px_rgba(236,72,153,0.42),0_18px_65px_rgba(34,211,238,0.2)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_0_54px_rgba(34,211,238,0.42),0_20px_80px_rgba(236,72,153,0.26)]"
              >
                Analyze Crisis
                <ArrowRight className="h-5 w-5 transition duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#system"
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-7 py-4 font-semibold text-cyan-100 ring-1 ring-white/15 backdrop-blur-xl transition duration-300 hover:scale-[1.03] hover:bg-white/[0.14] hover:shadow-[0_0_36px_rgba(168,85,247,0.28)]"
              >
                View System
              </a>
            </div>
          </MotionDiv>

          <MotionDiv
            variants={fadeUp}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="w-full lg:max-w-[650px] lg:justify-self-end"
          >
            <HeroIntelligenceVisual />
          </MotionDiv>
        </div>
      </MotionSection>

      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-5 py-8 sm:px-6 lg:px-8">

        <CrisisConsole />

        <section id="mission-grid" className="py-16">
          <SectionTitle
            eyebrow="Mission Grid"
            title="Intelligence cards for fast scanning."
            text="Operational signals stay grouped by capability, making urgent decisions easier to compare."
          />

          <MotionDiv
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="flex snap-x gap-5 overflow-x-auto pb-5 pr-4"
          >
            {commandCards.map((card) => {
              const Icon = card.icon;

              return (
                <GlassCard
                  key={card.title}
                  className={`min-w-[285px] snap-start sm:min-w-[320px] lg:min-w-[360px] ${card.glow}`}
                >
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconGlow}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{card.text}</p>
                </GlassCard>
              );
            })}
          </MotionDiv>
        </section>

        <MotionSection
          id="system"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="py-12"
        >
          <div className="rounded-[2rem] bg-white/10 p-7 backdrop-blur-xl ring-1 ring-white/15 shadow-[0_0_85px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.16)] sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase text-pink-200/85">About The System</p>
                <h2 className="text-3xl font-semibold text-white md:text-5xl">
                  A glass command layer for people-powered crisis response.
                </h2>
              </div>
              <div className="space-y-6 text-lg leading-8 text-slate-200/88">
                <p>
                  AidFlow Intelligence converts scattered requests into coordinated action. It
                  aligns incoming reports, volunteer skills, resource context, and field updates so
                  coordinators can move with confidence under pressure.
                </p>
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <p className="text-3xl font-semibold text-cyan-200">24/7</p>
                    <p className="mt-1 text-sm text-slate-300">signal watch</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-pink-200">AI</p>
                    <p className="mt-1 text-sm text-slate-300">routing core</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-violet-200">Live</p>
                    <p className="mt-1 text-sm text-slate-300">team sync</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionSection>

        <section className="py-16">
          <SectionTitle
            eyebrow="Features"
            title="Operational depth across every response."
            text="Coordinate triage, status, teams, and scale through focused signals tuned for real field work."
          />

          <MotionDiv
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <MotionArticle
                  key={feature.title}
                  variants={fadeUp}
                  whileHover={{ y: -7, scale: 1.035 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className={`rounded-2xl bg-white/10 p-6 backdrop-blur-xl ring-1 ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_24px_75px_rgba(2,6,23,0.34)] transition-all duration-300 hover:bg-white/[0.14] ${feature.glow}`}
                >
                  <Icon className="mb-6 h-8 w-8 text-cyan-200 drop-shadow-[0_0_16px_rgba(34,211,238,0.5)]" />
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{feature.text}</p>
                </MotionArticle>
              );
            })}
          </MotionDiv>
        </section>
      </div>
    </main>
  );
}

export default App;
