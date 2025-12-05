import type { MetadataRoute } from "next";

import { fetchLeaderboard } from "@/lib/fetchers";
import { SITE_URL } from "@/lib/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let leaderboardModels = [] as Awaited<ReturnType<typeof fetchLeaderboard>>["leaderboard"];

  try {
    const data = await fetchLeaderboard();
    leaderboardModels = data.leaderboard;
  } catch (error) {
    console.error("Failed to fetch leaderboard for sitemap", error);
  }

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
    },
    ...leaderboardModels.map((model) => ({
      url: `${SITE_URL}/${model.slug}`,
      lastModified: new Date(model.updatedAt ?? now),
    })),
  ];
}
