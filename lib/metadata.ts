import type { Metadata } from "next";

const SITE_NAME = "AI Model Scoreboard";
const SITE_URL = "https://ai-model-scoreboard.vercel.app";
const DEFAULT_DESCRIPTION =
  "Evidence-first AI model rankings with live Hugging Face signals, transparent weights, and public documentation.";
const DEFAULT_IMAGE = "/og.png";

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  openGraphType?: "website" | "article";
  imageAlt?: string;
}

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "AI leaderboard",
    "model rankings",
    "Hugging Face scores",
    "open metrics",
    "AI transparency",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Transparent AI signals`,
    description:
      "Independent AI model leaderboard with reproducible signals, open methodology, and evidence-backed deltas.",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: "AI Model Scoreboard leaderboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Independent AI model leaderboard with reproducible signals, open methodology, and evidence-backed deltas.",
    images: [DEFAULT_IMAGE],
  },
};

export function buildPageMetadata({
  title,
  description,
  path,
  openGraphType = "website",
  imageAlt,
}: BuildMetadataOptions): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const alt = imageAlt ?? `${title} preview from AI Model Scoreboard`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: openGraphType,
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [DEFAULT_IMAGE],
    },
  };
}

export { DEFAULT_DESCRIPTION, DEFAULT_IMAGE, SITE_NAME, SITE_URL };
