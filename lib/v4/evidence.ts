import { V4Evidence } from "../../types/v4";

const DEFAULT_EVIDENCE_BASELINE = 50;

export function calculateEvidenceScore(evidence: V4Evidence[]): number {
  if (!evidence || evidence.length === 0) return 0;

  const total = evidence.reduce((sum, item) => sum + item.value, 0);
  return Math.round(total / evidence.length);
}

export function calculateCredibilityFromEvidence(
  credibility: number,
  evidence: V4Evidence[]
): number {
  const evidenceScore = calculateEvidenceScore(evidence);
  const baselineAdjusted = credibility === 0 ? DEFAULT_EVIDENCE_BASELINE : credibility;
  const combined = baselineAdjusted * 0.7 + evidenceScore * 0.3;

  return Math.round(combined);
}
