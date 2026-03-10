import { useState, useEffect } from "react";
import {
  getCreators,
  getAllVideos,
  getAdminSettings,
  saveAdminSettings,
  updateVideo,
  recalcCreatorEarnings,
  getServers,
  saveServers,
  resetAllData,
} from "../utils/storage";
import { calculateVideoEarnings } from "../utils/earnings";
import { downloadCSV } from "../utils/csv";
import AdminAuth from "../components/AdminAuth";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
const PLATFORMS = [
  { id: "youtube", label: "YouTube Shorts" },
  { id: "tiktok", label: "TikTok" },
  { id: "instagram", label: "Instagram Reels" },
  { id: "snapchat", label: "Snapchat" },
  { id: "facebook", label: "Facebook" },
];

export default function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("adminAuthed") === "true"
  );
  const [activeTab, setActiveTab] = useState("creators");

  if (!authed) {
    return <AdminAuth onSuccess={() => setAuthed(true)} />;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <AdminHeader />

      {/* Tabs */}
      <div className="mt-8 flex gap-1 border-b border-gray-200">
        {["creators", "videos", "settings"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-5 py-2.5 text-sm font-medium capitalize transition ${
              activeTab === t
                ? "border-b-2 border-brand-500 text-brand-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "videos" ? "Video Review" : t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "creators" && <CreatorsTab />}
        {activeTab === "videos" && <VideosTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </section>
  );
}

/* ─── Header stats ─── */

function AdminHeader() {
  const creators = getCreators();
  const videos = getAllVideos();
  const pending = videos.filter((v) => v.status === "pending").length;
  const totalPaid = creators.reduce((sum, c) => sum + (c.totalEarnings || 0), 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900">Admin Panel</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Creators" value={creators.length} />
        <StatCard label="Total Videos" value={videos.length} />
        <StatCard label="Pending Reviews" value={pending} />
        <StatCard label="Total Paid Out" value={`$${totalPaid.toFixed(2)}`} />
      </div>
    </div>
  );
}

/* ─── Creators Tab ─── */

function CreatorsTab() {
  const creators = getCreators();

  const exportCreators = () => {
    const rows = creators.map((c) => ({
      Name: c.name,
      Email: c.email,
      Discord: c.discord,
      IP: c.ip,
      Server: c.server,
      "Joined Date": new Date(c.claimedAt).toLocaleDateString(),
      Videos: c.videos.length,
      Earnings: c.totalEarnings?.toFixed(2) || "0.00",
      Status: c.status,
    }));
    downloadCSV(rows, "creators.csv");
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={exportCreators}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Export CSV
        </button>
      </div>

      {creators.length === 0 ? (
        <p className="py-12 text-center text-gray-400">No creators yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-card bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Discord</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Server</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Videos</th>
                <th className="px-4 py-3 text-right">Earnings</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {creators.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email}</td>
                  <td className="px-4 py-3 text-gray-600">{c.discord}</td>
                  <td className="px-4 py-3 font-mono text-xs text-brand-600">{c.ip}</td>
                  <td className="px-4 py-3 text-gray-600">{c.server}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(c.claimedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {c.videos.length}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ${(c.totalEarnings || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Videos Tab ─── */

function VideosTab() {
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editViews, setEditViews] = useState("");
  const [editJoins, setEditJoins] = useState("");

  const refresh = () => {
    const all = getAllVideos();
    // pending first, then others
    all.sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    });
    setVideos(all);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleApprove = (video) => {
    const views = parseInt(editViews, 10) || 0;
    const joins = parseInt(editJoins, 10) || 0;
    const earnings = calculateVideoEarnings(views, joins);

    updateVideo(video.creatorId, video.id, {
      status: "approved",
      views,
      joins,
      earnings,
    });
    recalcCreatorEarnings(video.creatorId);
    setEditingId(null);
    setEditViews("");
    setEditJoins("");
    refresh();
  };

  const handleReject = (video) => {
    updateVideo(video.creatorId, video.id, { status: "rejected" });
    refresh();
  };

  const exportVideos = () => {
    const rows = videos.map((v) => {
      const row = {
        Creator: v.creatorName,
        IP: v.creatorIp,
        Server: getServers().find((s) => s.id === v.server)?.name || v.server || "",
        Title: v.title,
        "Submitted Date": new Date(v.submittedAt).toLocaleDateString(),
        Status: v.status,
        Views: v.views,
        Joins: v.joins,
        Earnings: v.earnings.toFixed(2),
      };
      PLATFORMS.forEach((p) => {
        row[p.label] = v.platformUrls?.[p.id] || "";
      });
      return row;
    });
    downloadCSV(rows, "videos.csv");
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={exportVideos}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Export CSV
        </button>
      </div>

      {videos.length === 0 ? (
        <p className="py-12 text-center text-gray-400">No videos submitted yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-card bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Server</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Links</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Views</th>
                <th className="px-4 py-3 text-right">Joins</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {videos.map((v) => (
                <tr key={v.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {v.creatorName}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-brand-600">
                    {v.creatorIp}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {getServers().find((s) => s.id === v.server)?.name || v.server || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{v.title || "Untitled"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {PLATFORMS.filter((p) => v.platformUrls?.[p.id]).map((p) => (
                        <a
                          key={p.id}
                          href={v.platformUrls[p.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 hover:bg-brand-100"
                        >
                          {p.label}
                        </a>
                      ))}
                      {!v.platformUrls && v.url && (
                        <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-brand-500 underline text-xs">Link</a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(v.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === v.id ? (
                      <input
                        type="number"
                        min="0"
                        value={editViews}
                        onChange={(e) => setEditViews(e.target.value)}
                        placeholder="0"
                        className="w-20 rounded border border-gray-300 px-2 py-1 text-right text-xs"
                      />
                    ) : (
                      <span className="text-gray-600">{v.views.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === v.id ? (
                      <input
                        type="number"
                        min="0"
                        value={editJoins}
                        onChange={(e) => setEditJoins(e.target.value)}
                        placeholder="0"
                        className="w-20 rounded border border-gray-300 px-2 py-1 text-right text-xs"
                      />
                    ) : (
                      <span className="text-gray-600">{v.joins}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {v.status === "pending" && editingId !== v.id && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingId(v.id);
                            setEditViews(String(v.views));
                            setEditJoins(String(v.joins));
                          }}
                          className="rounded bg-green-500 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(v)}
                          className="rounded bg-red-500 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {editingId === v.id && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleApprove(v)}
                          className="rounded bg-brand-500 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-brand-600"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Settings Tab ─── */

function SettingsTab() {
  const [settings, setSettings] = useState(getAdminSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    saveAdminSettings({
      ...settings,
      ratePerJoin: parseFloat(settings.ratePerJoin) || 1,
      ratePerKViews: parseFloat(settings.ratePerKViews) || 1,
      earningsCap: parseFloat(settings.earningsCap) || 500,
    });
    setSaved(true);
  };

  return (
    <div className="space-y-8">
      {/* Monetization */}
      <div className="max-w-lg rounded-card bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-gray-900">Monetization</h2>
        <div className="mt-6 space-y-4">
          <SettingField
            label="Rate per join ($)"
            value={settings.ratePerJoin}
            onChange={(v) => handleChange("ratePerJoin", v)}
            type="number"
            step="0.01"
          />
          <SettingField
            label="Rate per 1k views ($)"
            value={settings.ratePerKViews}
            onChange={(v) => handleChange("ratePerKViews", v)}
            type="number"
            step="0.01"
          />
          <SettingField
            label="Earnings cap per creator ($)"
            value={settings.earningsCap}
            onChange={(v) => handleChange("earningsCap", v)}
            type="number"
            step="1"
          />
          <SettingField
            label="Program name"
            value={settings.programName}
            onChange={(v) => handleChange("programName", v)}
          />
        </div>
        <button
          onClick={handleSave}
          className="mt-6 rounded-card bg-brand-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Save Settings
        </button>
        {saved && (
          <p className="mt-2 text-sm font-medium text-green-600">Settings saved!</p>
        )}
      </div>

      {/* Servers */}
      <ServersEditor />

      {/* Danger Zone */}
      <div className="max-w-lg rounded-card border border-red-200 bg-red-50 p-6">
        <h2 className="font-display text-lg font-bold text-red-700">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-600">
          Permanently deletes all creators, videos, and resets all data. Cannot be undone.
        </p>
        <button
          onClick={() => {
            if (window.confirm("Reset ALL data? This cannot be undone.")) {
              resetAllData();
              window.location.reload();
            }
          }}
          className="mt-4 rounded-card bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
}

function SettingField({ label, value, onChange, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        {...props}
      />
    </div>
  );
}

/* ─── Servers Editor ─── */

function ServersEditor() {
  const [servers, setServers] = useState(getServers);
  const [saved, setSaved] = useState(false);

  const update = (id, key, value) => {
    setServers((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
    setSaved(false);
  };

  const deleteServer = (id) => {
    setServers((prev) => prev.filter((s) => s.id !== id));
    setSaved(false);
  };

  const addServer = () => {
    const id = "server-" + Date.now();
    setServers((prev) => [
      ...prev,
      { id, name: "New Server", domain: "newserver.com", description: "", longDescription: "" },
    ]);
    setSaved(false);
  };

  const handleSave = () => {
    saveServers(servers);
    setSaved(true);
  };

  const fieldCls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

  return (
    <div className="rounded-card bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold text-gray-900">Servers</h2>

      <div className="mt-6 space-y-6">
        {servers.map((s) => (
          <div key={s.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Name</label>
                    <input
                      value={s.name}
                      onChange={(e) => update(s.id, "name", e.target.value)}
                      className={fieldCls}
                      placeholder="Server name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Domain</label>
                    <input
                      value={s.domain}
                      onChange={(e) => update(s.id, "domain", e.target.value)}
                      className={fieldCls}
                      placeholder="domain.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Short description (homepage card)
                  </label>
                  <input
                    value={s.description}
                    onChange={(e) => update(s.id, "description", e.target.value)}
                    className={fieldCls}
                    placeholder="One-liner for the homepage card"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Full description (server page)
                  </label>
                  <textarea
                    value={s.longDescription || ""}
                    onChange={(e) => update(s.id, "longDescription", e.target.value)}
                    rows={10}
                    className={fieldCls + " resize-y font-mono text-xs leading-relaxed"}
                    placeholder="Full content shown on the server detail page. Use double line breaks between sections. ALL-CAPS lines become headings. Lines starting with an emoji become feature cards."
                  />
                </div>
              </div>
              <button
                onClick={() => deleteServer(s.id)}
                className="mt-1 shrink-0 text-xs text-red-400 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={addServer}
          className="rounded-lg border border-dashed border-brand-300 px-4 py-2 text-sm font-medium text-brand-500 transition hover:border-brand-500 hover:bg-brand-50"
        >
          + Add Server
        </button>
        <button
          onClick={handleSave}
          className="rounded-card bg-brand-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Save Servers
        </button>
        {saved && <p className="text-sm font-medium text-green-600">Saved!</p>}
      </div>
    </div>
  );
}
