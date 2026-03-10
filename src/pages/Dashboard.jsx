import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentCreator,
  addVideo,
  getAdminSettings,
  getServers,
  isPrefixTaken,
  claimServerIP,
  getCreatorClaimedServers,
} from "../utils/storage";
import { calculateTotalEarnings } from "../utils/earnings";
import { useT } from "../i18n";
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
  const t = useT();
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
    const claimed = getCreatorClaimedServers(c);
    if (claimed.length > 0) setVideoServer(claimed[0].serverId);
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

  const refresh = () => setCreator(getCurrentCreator());

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Hey {creator.name.split(" ")[0]}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {getCreatorClaimedServers(creator).map((cs) => (
              <button
                key={cs.serverId}
                onClick={() => navigator.clipboard.writeText(cs.ip)}
                title="Click to copy"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600 transition hover:bg-brand-100"
              >
                {cs.ip}
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              </button>
            ))}
          </div>
          <ClaimIPForm creator={creator} onClaimed={refresh} />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{t("dash_earnings_label")}</p>
          <p className="font-display text-3xl font-bold text-brand-500">
            ${totalEarnings.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">{t("dash_cap")} ${settings.earningsCap}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label={t("dash_stat_total")} value={creator.videos.length} />
        <StatCard label={t("dash_stat_approved")} value={approvedVideos.length} />
        <StatCard label={t("dash_stat_earnings")} value={`$${totalEarnings.toFixed(2)}`} />
      </div>

      {/* Submit Video */}
      <div className="mt-10 rounded-card bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-gray-900">{t("dash_submit_title")}</h2>
        <form onSubmit={handleSubmitVideo} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t("dash_server")}
              </label>
              <select
                value={videoServer}
                onChange={(e) => setVideoServer(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {getCreatorClaimedServers(creator).map((cs) => {
                  const s = servers.find((x) => x.id === cs.serverId);
                  return <option key={cs.serverId} value={cs.serverId}>{s?.name || cs.serverId}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t("dash_video_title")}
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
              {t("dash_platform_urls")}{" "}
              <span className="font-normal text-gray-400">{t("dash_platform_required")}</span>
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
              <p className="mt-1 text-xs text-red-500">{t("dash_platform_error")}</p>
            )}
          </div>

          <button
            type="submit"
            className="rounded-card bg-brand-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            {t("dash_submit_btn")}
          </button>
        </form>
      </div>

      {/* Videos Table */}
      {creator.videos.length > 0 && (
        <div className="mt-10 overflow-x-auto rounded-card bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">{t("dash_table_title")}</th>
                <th className="px-4 py-3">{t("dash_table_server")}</th>
                <th className="px-4 py-3">{t("dash_table_platforms")}</th>
                <th className="px-4 py-3">{t("dash_table_status")}</th>
                <th className="px-4 py-3 text-right">{t("dash_table_views")}</th>
                <th className="px-4 py-3 text-right">{t("dash_table_joins")}</th>
                <th className="px-4 py-3 text-right">
                  <span className="inline-flex items-center justify-end gap-1">
                    {t("dash_table_earnings")}
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
                      {v.title || t("dash_untitled")}
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
                        <span className="ml-1 text-xs font-normal text-gray-400">{t("dash_est")}</span>
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
          {[
            { key: "brief", label: t("dash_tab_brief") },
            { key: "examples", label: t("dash_tab_examples") },
            { key: "faq", label: t("dash_tab_faq") },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`px-4 py-2 text-sm font-medium capitalize transition ${
                tab === item.key
                  ? "border-b-2 border-brand-500 text-brand-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.label}
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

/* ─── Claim IP Form ─── */

function ClaimIPForm({ creator, onClaimed }) {
  const t = useT();
  const allServers = getServers();
  const claimedIds = getCreatorClaimedServers(creator).map((cs) => cs.serverId);
  const unclaimedServers = allServers.filter((s) => !claimedIds.includes(s.id));

  const [open, setOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState(unclaimedServers[0]?.id ?? "");
  const [prefix, setPrefix] = useState(creator.prefix);
  const [availability, setAvailability] = useState(null);

  if (unclaimedServers.length === 0) return null;

  const selectedServer = allServers.find((s) => s.id === selectedServerId);

  const checkAvailability = () => {
    if (!prefix.trim()) return;
    setAvailability(isPrefixTaken(prefix) ? "taken" : "available");
  };

  const handleClaim = () => {
    if (availability !== "available" || !selectedServer) return;
    claimServerIP(creator.id, { serverId: selectedServer.id, prefix, domain: selectedServer.domain });
    onClaimed();
    setOpen(false);
    setAvailability(null);
  };

  const inputCls =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-brand-300 px-3 py-1 text-sm font-medium text-brand-500 transition hover:border-brand-500 hover:bg-brand-50"
      >
        {t("claim_another")}
      </button>

      {open && (
        <div className="mt-3 rounded-card border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
            {t("claim_title")}
          </p>

          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className="text-xs text-gray-400">{t("claim_already")}</span>
            {allServers.filter((s) => claimedIds.includes(s.id)).map((s) => (
              <span key={s.id} className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-400">
                {s.name}
              </span>
            ))}
          </div>

          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">{t("claim_server")}</label>
                <select
                  value={selectedServerId}
                  onChange={(e) => { setSelectedServerId(e.target.value); setAvailability(null); }}
                  className={inputCls}
                >
                  {unclaimedServers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">{t("claim_prefix")}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prefix}
                    onChange={(e) => { setPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")); setAvailability(null); }}
                    className={inputCls}
                    placeholder="yourname"
                  />
                  <button
                    type="button"
                    onClick={checkAvailability}
                    disabled={!prefix}
                    className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-40"
                  >
                    {t("claim_check")}
                  </button>
                </div>
              </div>
            </div>

            {selectedServer && prefix && (
              <p className="text-xs text-gray-500">
                {t("claim_preview")}{" "}
                <span className="font-semibold text-brand-600">
                  {prefix}.{selectedServer.domain}
                </span>
              </p>
            )}

            {availability === "taken" && (
              <p className="text-xs text-red-500">{t("claim_taken")}</p>
            )}
            {availability === "available" && (
              <p className="text-xs text-green-600">{t("claim_available")}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleClaim}
                disabled={availability !== "available"}
                className="rounded-card bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-600 disabled:opacity-40"
              >
                {t("claim_btn")}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-card border border-gray-300 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
              >
                {t("claim_cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Tabs ─── */

function BriefTab() {
  const t = useT();
  return (
    <div className="space-y-3 text-sm text-gray-600">
      <p><strong>{t("brief_goal_label")}</strong> {t("brief_goal")}</p>
      <p><strong>{t("brief_cta_label")}</strong> {t("brief_cta")}</p>
      <p><strong>{t("brief_ideas_label")}</strong> {t("brief_ideas")}</p>
      <p><strong>{t("brief_donot_label")}</strong> {t("brief_donot")}</p>
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
  const t = useT();
  const faqs = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
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
