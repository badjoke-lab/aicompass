import { devV4Models } from "@/data/dev/v4/models";
import type { V4ModelInput } from "../types";

export function getV4Models(): V4ModelInput[] {
  return devV4Models;
}

export function getV4Model(slug: string): V4ModelInput | undefined {
  return devV4Models.find((model) => model.slug === slug);
}
