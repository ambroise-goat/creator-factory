// TODO: add real video tracking / analytics

import { getAdminSettings } from "./storage";

/**
 * Calculate earnings for a single video based on views and joins.
 */
export function calculateVideoEarnings(views, joins) {
  const settings = getAdminSettings();
  const fromViews = (views / 1000) * settings.ratePerKViews;
  const fromJoins = joins * settings.ratePerJoin;
  return Math.round((fromViews + fromJoins) * 100) / 100;
}

/**
 * Calculate total earnings for a creator, respecting the per-creator cap.
 */
export function calculateTotalEarnings(videos) {
  const settings = getAdminSettings();
  let total = 0;
  for (const v of videos) {
    if (v.status === "approved") {
      total += v.earnings;
    }
  }
  return Math.min(Math.round(total * 100) / 100, settings.earningsCap);
}
