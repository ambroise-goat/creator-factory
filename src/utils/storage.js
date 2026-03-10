// TODO: connect to real DB / Supabase
// All data mutations go through this file.
// To swap localStorage for a real API, only this file needs to change.

import { DEFAULT_TAKEN_PREFIXES, SERVERS as DEFAULT_SERVERS } from "../constants/servers";

/* ─── helpers ─── */

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ─── Taken IPs ─── */

export function getTakenPrefixes() {
  // TODO: replace with real API call
  const stored = read("takenIPs");
  if (!stored) {
    write("takenIPs", DEFAULT_TAKEN_PREFIXES);
    return DEFAULT_TAKEN_PREFIXES;
  }
  return stored;
}

export function isPrefixTaken(prefix) {
  // TODO: replace with real API call
  const taken = getTakenPrefixes();
  return taken.map((p) => p.toLowerCase()).includes(prefix.toLowerCase());
}

function addTakenPrefix(prefix) {
  // TODO: replace with real API call
  const taken = getTakenPrefixes();
  if (!taken.includes(prefix.toLowerCase())) {
    taken.push(prefix.toLowerCase());
    write("takenIPs", taken);
  }
}

/* ─── Creators ─── */

export function getCreators() {
  // TODO: replace with real API call
  return read("creators") || [];
}

export function getCreatorById(id) {
  // TODO: replace with real API call
  return getCreators().find((c) => c.id === id) || null;
}

export function saveCreator(creator) {
  // TODO: replace with real API call
  const creators = getCreators();
  const idx = creators.findIndex((c) => c.id === creator.id);
  if (idx >= 0) {
    creators[idx] = creator;
  } else {
    creators.push(creator);
  }
  write("creators", creators);
}

export function createCreator(data) {
  // TODO: replace with real API call
  const ip = `${data.prefix}.${data.domain}`;
  const creator = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    discord: data.discord,
    creatorType: data.creatorType,
    platform: data.platform,
    ip,
    prefix: data.prefix,
    server: data.server,
    claimedServers: [{ serverId: data.server, prefix: data.prefix, ip }],
    claimedAt: new Date().toISOString(),
    videos: [],
    totalEarnings: 0,
    status: "active",
  };
  saveCreator(creator);
  addTakenPrefix(data.prefix);
  setCurrentCreator(creator.id);
  return creator;
}

/* ─── Current Creator (mock auth) ─── */

export function getCurrentCreator() {
  // TODO: replace with real API call
  const id = read("currentCreator");
  if (!id) return null;
  return getCreatorById(id);
}

export function setCurrentCreator(id) {
  // TODO: replace with real API call
  write("currentCreator", id);
}

export function logoutCreator() {
  // TODO: replace with real API call
  localStorage.removeItem("currentCreator");
}

/* ─── Videos ─── */

// MVP: log-uniform between 1k–111k (Pareto-like, most videos stay low)
function randomViews() {
  return Math.floor(1000 * Math.pow(111, Math.random()));
}

export function addVideo(creatorId, videoData) {
  // TODO: replace with real API call
  const creator = getCreatorById(creatorId);
  if (!creator) return null;
  const video = {
    id: crypto.randomUUID(),
    server: videoData.server,
    platformUrls: videoData.platformUrls,
    title: videoData.title,
    submittedAt: new Date().toISOString(),
    status: "pending",
    views: randomViews(),
    joins: 0,
    earnings: 0,
  };
  creator.videos.push(video);
  saveCreator(creator);
  return video;
}

export function updateVideo(creatorId, videoId, updates) {
  // TODO: replace with real API call
  const creator = getCreatorById(creatorId);
  if (!creator) return null;
  const video = creator.videos.find((v) => v.id === videoId);
  if (!video) return null;
  Object.assign(video, updates);
  saveCreator(creator);
  return video;
}

export function getAllVideos() {
  // TODO: replace with real API call
  const creators = getCreators();
  const videos = [];
  for (const c of creators) {
    for (const v of c.videos) {
      videos.push({ ...v, creatorId: c.id, creatorName: c.name, creatorIp: c.ip });
    }
  }
  return videos;
}

/* ─── Admin Settings ─── */

const DEFAULT_SETTINGS = {
  ratePerJoin: 1.0,
  ratePerKViews: 1.0,
  earningsCap: 500,
  programName: "Creator Factory",
};

export function getAdminSettings() {
  // TODO: replace with real API call
  const stored = read("adminSettings");
  if (!stored) {
    write("adminSettings", DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function saveAdminSettings(settings) {
  // TODO: replace with real API call
  write("adminSettings", settings);
}

/* ─── Claimed IPs ─── */

export function getCreatorClaimedServers(creator) {
  if (creator.claimedServers?.length > 0) return creator.claimedServers;
  // backward compat for creators created before multi-IP
  if (creator.ip) return [{ serverId: creator.server, prefix: creator.prefix, ip: creator.ip }];
  return [];
}

export function claimServerIP(creatorId, { serverId, prefix, domain }) {
  const creator = getCreatorById(creatorId);
  if (!creator) return null;
  // migrate old data
  if (!creator.claimedServers) {
    creator.claimedServers = [{ serverId: creator.server, prefix: creator.prefix, ip: creator.ip }];
  }
  if (creator.claimedServers.find((cs) => cs.serverId === serverId)) return null;
  const ip = `${prefix}.${domain}`;
  creator.claimedServers.push({ serverId, prefix, ip });
  saveCreator(creator);
  addTakenPrefix(prefix);
  return { serverId, prefix, ip };
}

/* ─── Servers ─── */

export function getServers() {
  const stored = read("servers");
  if (!stored) {
    write("servers", DEFAULT_SERVERS);
    return DEFAULT_SERVERS;
  }
  return stored;
}

export function saveServers(servers) {
  write("servers", servers);
}

/* ─── Reset ─── */

export function resetAllData() {
  ["creators", "currentCreator", "takenIPs", "servers", "adminSettings"].forEach(
    (key) => localStorage.removeItem(key)
  );
}

/* ─── Recalculate creator earnings ─── */

export function recalcCreatorEarnings(creatorId) {
  // TODO: replace with real API call
  const creator = getCreatorById(creatorId);
  if (!creator) return;
  const settings = getAdminSettings();
  let total = 0;
  for (const v of creator.videos) {
    if (v.status === "approved") {
      total += v.earnings;
    }
  }
  creator.totalEarnings = Math.min(total, settings.earningsCap);
  saveCreator(creator);
}
