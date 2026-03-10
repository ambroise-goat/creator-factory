import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isPrefixTaken, createCreator, getCurrentCreator, getServers } from "../utils/storage";

const CREATOR_TYPES = ["YouTuber", "TikToker", "Both"];
const PLATFORMS = ["YouTube Shorts", "TikTok", "Instagram Reels", "Snapchat"];

export default function Join() {
  const navigate = useNavigate();
  const existing = getCurrentCreator();

  // Redirect if already signed up
  if (existing) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    discord: "",
    creatorType: CREATOR_TYPES[0],
    platform: PLATFORMS[0],
  });

  const [prefix, setPrefix] = useState("");
  const servers = getServers();
  const [server, setServer] = useState(() => getServers()[0]);
  const [availability, setAvailability] = useState(null); // null | "taken" | "available"

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const checkAvailability = () => {
    const clean = prefix.toLowerCase().replace(/[^a-z0-9]/g, "");
    setPrefix(clean);
    if (!clean) return;
    // TODO: replace with real API call
    setAvailability(isPrefixTaken(clean) ? "taken" : "available");
  };

  const claimIP = () => {
    createCreator({
      ...form,
      prefix: prefix.toLowerCase(),
      server: server.id,
      domain: server.domain,
    });
    navigate("/dashboard");
  };

  return (
    <section className="mx-auto max-w-lg px-4 py-16">
      {/* Progress indicator */}
      <div className="mb-10 flex items-center justify-center gap-3">
        <StepDot active={step >= 1} label="1" />
        <div className={`h-0.5 w-10 ${step >= 2 ? "bg-brand-500" : "bg-gray-300"}`} />
        <StepDot active={step >= 2} label="2" />
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="rounded-card bg-white p-8 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Join the Program
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Tell us about yourself to get started.
          </p>

          <div className="mt-6 space-y-4">
            <Field
              label="Full name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleFormChange}
              required
            />
            <Field
              label="Discord username"
              name="discord"
              value={form.discord}
              onChange={handleFormChange}
              required
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Creator type
              </label>
              <select
                name="creatorType"
                value={form.creatorType}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {CREATOR_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Preferred platform
              </label>
              <select
                name="platform"
                value={form.platform}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {PLATFORMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-card bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Continue
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="rounded-card bg-white p-8 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Claim Your IP
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose a unique prefix for your personalized server IP.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Server
              </label>
              <select
                value={server.id}
                onChange={(e) => {
                  setServer(servers.find((s) => s.id === e.target.value));
                  setAvailability(null);
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {servers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Your prefix
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => {
                    setPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""));
                    setAvailability(null);
                  }}
                  placeholder="yourname"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={checkAvailability}
                  disabled={!prefix}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-40"
                >
                  Check
                </button>
              </div>
            </div>

            {/* Live preview */}
            {prefix && (
              <div className="rounded-lg bg-brand-50 px-4 py-3 text-center">
                <p className="text-sm text-gray-500">Your IP will be</p>
                <p className="mt-1 font-display text-lg font-bold text-brand-600">
                  {prefix}.{server.domain}
                </p>
              </div>
            )}

            {/* Availability feedback */}
            {availability === "taken" && (
              <p className="text-sm font-medium text-red-600">
                This IP is already taken. Try another.
              </p>
            )}
            {availability === "available" && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-green-600">Available!</p>
                <button
                  onClick={claimIP}
                  className="w-full rounded-card bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                  Claim this IP
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setStep(1)}
            className="mt-6 text-sm text-gray-400 transition hover:text-gray-600"
          >
            &larr; Back
          </button>
        </div>
      )}
    </section>
  );
}

/* ─── Tiny helpers ─── */

function StepDot({ active, label }) {
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
        active ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-500"
      }`}
    >
      {label}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}
