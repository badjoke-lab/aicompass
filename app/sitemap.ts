import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const basePages = [
    "/",
    "/about",
    "/methodology",
    "/support",
    "/donation",
    "/docs",
    "/docs/changelog",
    "/privacy",
  ];

  return basePages.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.6,
  }));
}
