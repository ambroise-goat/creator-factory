import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentCreator,
  addVideo,
  getAdminSettings,
} from "../utils/storage";
import { calculateTotalEarnings } from "../utils/earnings";
import { getServers } from "../utils/storage";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

const PLATFORMS = [
  { id: "youtube", label: "YouTube Shorts", placeholder: "https://youtube.com/shorts/..." },
  { id: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@you/video/..." },
  { id: "instagram", label: "Instagram Reels", placeholder: "https://instagram.com/reel/..." },
  { id: "snapchat", label: "Snapchat", placeholder: "https://snapchat.com/..." },
  { id: "facebook", label: "Facebook", placeholder: "https://facebook.com/reel/..." },
];

const emptyUrls = () => Object.fromEntries(PLATFORMS.map((p) => [p.id, ""]));

function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  return (
    <>
      <span
        className="flex h-3.5 w-3.5 cursor-default items-center justify-center rounded-full bg-gray-300 text-[9px] font-bold text-gray-600"
        onMouseEnter={(e) => { setCoords({ x: e.clientX, y: e.clientY }); setShow(true); }}
        onMouseMove={(e) => setCoords({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setShow(false)}
      >
        ?
      </span>
      {show && (
        <div
          className="pointer-events-none fixed z-50 rounded bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
          style={{ left: coords.x + 12, top: coords.y - 38 }}
        >
          {text}
        </div>
      )}
    </>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [tab, setTab] = useState("brief");

  const servers = getServers();

  // Video form
  const [videoServer, setVideoServer] = useState(() => getServers()[0]?.id ?? "");
  const [videoTitle, setVideoTitle] = useState("");
  const [platformUrls, setPlatformUrls] = useState(emptyUrls);
  const [urlError, setUrlError] = useState(false);

  useEffect(() => {
    const c = getCurrentCreator();
    if (!c) {
      navigate("/join", { replace: true });
      return;
    }
    setCreator(c);
  }, [navigate]);

  if (!creator) return null;

  const approvedVideos = creator.videos.filter((v) => v.status === "approved");
  const totalEarnings = calculateTotalEarnings(creator.videos);
  const settings = getAdminSettings();

  const handleSubmitVideo = (e) => {
    e.preventDefault();
    const hasAtLeastOne = Object.values(platformUrls).some((u) => u.trim() !== "");
    if (!hasAtLeastOne) {
      setUrlError(true);
      return;
    }
    setUrlError(false);
    addVideo(creator.id, {
      server: videoServer,
      platformUrls,
      title: videoTitle,
    });
    setCreator(getCurrentCreator());
    setPlatformUrls(emptyUrls());
    setVideoTitle("");
  };

  const copyIP = () => {
    navigator.clipboard.writeText(creator.ip);
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Hey {creator.name.split(" ")[0]}
          </h1>
          <button
            onClick={copyIP}
            className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600 transition hover:bg-brand-100"
          >
            {creator.ip}
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Estimated Earnings</p>
          <p className="font-display text-3xl font-bold text-brand-500">
            ${totalEarnings.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">Cap: ${settings.earningsCap}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Videos Submitted" value={creator.videos.length} />
        <StatCard label="Approved Videos" value={approvedVideos.length} />
        <StatCard label="Estimated Earnings ($)" value={`$${totalEarnings.toFixed(2)}`} />
      </div>

      {/* Submit Video */}
      <div className="mt-10 rounded-card bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-gray-900">Submit a Video</h2>
        <form onSubmit={handleSubmitVideo} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Server
              </label>
              <select
                value={videoServer}
                onChange={(e) => setVideoServer(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {servers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Video title
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="My awesome Minecraft video"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Platform URLs{" "}
              <span className="font-normal text-gray-400">(at least one required)</span>
            </label>
            <div className="space-y-2">
              {PLATFORMS.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-sm text-gray-600">{p.label}</span>
                  <input
                    type="url"
                    value={platformUrls[p.id]}
                    onChange={(e) =>
                      setPlatformUrls((prev) => ({ ...prev, [p.id]: e.target.value }))
                    }
                    placeholder={p.placeholder}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              ))}
            </div>
            {urlError && (
              <p className="mt-1 text-xs text-red-500">
                Please enter at least one platform URL.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="rounded-card bg-brand-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Submit Video
          </button>
        </form>
      </div>

      {/* Videos Table */}
      {creator.videos.length > 0 && (
        <div className="mt-10 overflow-x-auto rounded-card bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Server</th>
                <th className="px-4 py-3">Platforms</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Views</th>
                <th className="px-4 py-3 text-right">Joins</th>
                <th className="px-4 py-3 text-right">
                  <span className="inline-flex items-center justify-end gap-1">
                    Earnings
                    <Tooltip
                      text={`$${settings.ratePerKViews.toFixed(2)} per 1k views${settings.ratePerJoin > 0 ? ` · $${settings.ratePerJoin.toFixed(2)} per join` : ""}`}
                    />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {creator.videos.map((v) => {
                const activePlatforms = PLATFORMS.filter(
                  (p) => v.platformUrls?.[p.id]
                );
                const serverName =
                  servers.find((s) => s.id === v.server)?.name || v.server || "—";
                const estEarnings =
                  v.status === "approved"
                    ? v.earnings
                    : (v.views / 1000) * settings.ratePerKViews;
                return (
                  <tr key={v.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {v.title || "Untitled"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{serverName}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {activePlatforms.length > 0
                          ? activePlatforms.map((p) => (
                              <a
                                key={p.id}
                                href={v.platformUrls[p.id]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 hover:bg-brand-100"
                              >
                                {p.label}
                              </a>
                            ))
                          : <span className="text-gray-400 text-xs">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {v.views.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{v.joins}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ${estEarnings.toFixed(2)}
                      {v.status !== "approved" && (
                        <span className="ml-1 text-xs font-normal text-gray-400">est.</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Server Brief Section */}
      <div className="mt-10 rounded-card bg-white p-6 shadow-sm">
        <div className="flex gap-1 border-b border-gray-100">
          {["brief", "examples", "faq"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition ${
                tab === t
                  ? "border-b-2 border-brand-500 text-brand-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === "brief" && <BriefTab />}
          {tab === "examples" && <ExamplesTab />}
          {tab === "faq" && <FAQTab />}
        </div>
      </div>
    </section>
  );
}

/* ─── Tabs ─── */

function BriefTab() {
  return (
    <div className="space-y-3 text-sm text-gray-600">
      {/* TODO: fill with real brief */}
      <p>
        <strong>Goal:</strong> Create short-form vertical videos (30–60 seconds) that
        showcase exciting moments on the server and drive players to join.
      </p>
      <p>
        <strong>Required CTA:</strong> Every video must include your personalized IP as a
        call-to-action, either spoken, shown on-screen, or both. Example: "Join me at
        martin.blocaria.com!"
      </p>
      <p>
        <strong>Content ideas:</strong> Epic builds, PvP moments, first-time reactions,
        tutorials, server events, hidden secrets.
      </p>
      <p>
        <strong>Do not:</strong> Use offensive language, show exploits/hacks, or include
        content from other servers.
      </p>
    </div>
  );
}

function ExamplesTab() {
  // TODO: replace with real creator video IDs
  const videoIds = ["dQw4w9WgXcQ", "dQw4w9WgXcQ"];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {videoIds.map((id, i) => (
        <div key={i} className="overflow-hidden rounded-lg">
          <div className="relative pb-[56.25%]">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${id}`}
              title={`Example ${i + 1}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function FAQTab() {
  const faqs = [
    {
      q: "When do I get paid?",
      a: "Payments are processed monthly. Once your videos are approved and earnings are calculated, you'll receive payment via your preferred method.",
    },
    {
      q: "Who is eligible?",
      a: "Anyone with a YouTube, TikTok, Instagram, or Snapchat account can join. There's no minimum follower count required.",
    },
    {
      q: "Is there an earnings cap?",
      a: "Yes, there is a per-creator earnings cap set by the admin. Check your dashboard for the current cap amount.",
    },
  ];

  return (
    <div className="divide-y divide-gray-100">
      {faqs.map((faq, i) => (
        <FAQItem key={i} question={faq.q} answer={faq.a} />
      ))}
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left text-sm font-medium text-gray-900"
      >
        {question}
        <span className="ml-2 text-gray-400">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-2 text-sm text-gray-600">{answer}</p>}
    </div>
  );
}
