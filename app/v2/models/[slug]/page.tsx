+import Link from "next/link";
+import { notFound } from "next/navigation";
+import HistorySparkline from "@/components/HistorySparkline";
+import { getInternalDashboardData, TRANSPARENCY_ALERT_THRESHOLD } from "@/lib/v2/dashboard";
+import { v2ScoreEngine } from "@/lib/v2";
+import type { MetadataCompletenessSnapshot, EvidenceBucketScore } from "@/lib/v2/dashboard";
+import type { Model } from "@/types/model";
+
+interface PageProps {
+  params: { slug: string };
+}
+
+export function generateMetadata({ params }: PageProps) {
+  const snapshot = v2ScoreEngine.getBySlug(params.slug);
+  if (!snapshot) {
+    return { title: "AIMS v2 · Model" };
+  }
+  return { title: `AIMS v2 · ${snapshot.metrics.name}` };
+}
+
+export default function ModelDetailPage({ params }: PageProps) {
+  const snapshot = v2ScoreEngine.getBySlug(params.slug);
+  if (!snapshot) {
+    notFound();
+  }
+  const dashboard = getInternalDashboardData();
+  const modelHealth = dashboard.modelHealth.find((entry) => entry.slug === snapshot.model.slug);
+  if (!modelHealth) {
+    notFound();
+  }
+
+  const metadata = modelHealth.metadata;
+  const evidence = modelHealth.evidence;
+  const transparency = snapshot.metrics.transparencyCompliance;
+  const trend = snapshot.metrics.trendVelocity;
+  const weighted = snapshot.metrics.weightedDelta;
+  const ecosystem = snapshot.metrics.ecosystemDepth;
+
+  return (
+    <div className="space-y-8">
+      <div className="flex flex-col gap-2">
+        <Link href="/v2/leaderboard" className="text-xs uppercase tracking-wide text-slate-500 hover:text-accent">
+          ← back to v2 leaderboard
+        </Link>
+        <div>
+          <p className="text-sm uppercase tracking-wide text-slate-400">model detail</p>
+          <h1 className="text-3xl font-semibold text-slate-50">{snapshot.metrics.name}</h1>
+          <p className="text-sm text-slate-400">{snapshot.metrics.vendor}</p>
+        </div>
+      </div>
+
+      <section className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6 lg:grid-cols-3">
+        <div className="space-y-4">
+          <MetricBlock label="Total" value={`${snapshot.metrics.total.toFixed(1)} pts`} description="latest composite" />
+          <MetricBlock
+            label="Transparency compliance"
+            value={`${Math.round(transparency.ratio * 100)}%`}
+            description={`score ${transparency.transparencyScore} · disclosures ${transparency.disclosureScore}`}
+            alert={transparency.ratio < TRANSPARENCY_ALERT_THRESHOLD}
+          />
+          <MetricBlock
+            label="Weighted Δ"
+            value={weighted.value.toFixed(2)}
+            description={`raw ${weighted.rawDelta.toFixed(1)} · adoption ${weighted.adoptionWeight.toFixed(2)} · performance ${weighted.performanceWeight.toFixed(2)}`}
+          />
+        </div>
+        <div className="space-y-4">
+          <MetricBlock
+            label="Trend velocity"
+            value={`${trend.velocity.toFixed(2)} /wk`}
+            description={`${trend.windowDays}d window · Δ ${trend.delta.toFixed(1)} · samples ${trend.sampleCount}`}
+            intent={trend.velocity >= 0 ? "positive" : "negative"}
+          />
+          <MetricBlock
+            label="Volatility"
+            value={`${snapshot.metrics.volatilityBucket}`}
+            description={`index ${snapshot.metrics.volatilityIndex.toFixed(2)}`}
+          />
+          <MetricBlock
+            label="Ecosystem depth"
+            value={`${ecosystem.depth.toFixed(1)} pts`}
+            description={`modalities +${ecosystem.modalityBonus.toFixed(1)} · coverage +${ecosystem.coverageBonus.toFixed(1)} · signals ${ecosystem.evidenceSignals}`}
+          />
+        </div>
+        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
+          <p className="text-xs uppercase tracking-wide text-slate-400">history</p>
+          <HistorySparkline history={snapshot.model.history} chartId={snapshot.model.slug} />
+        </div>
+      </section>
+
+      <section className="grid gap-6 lg:grid-cols-2">
+        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
+          <SectionHeader title="Metadata completeness" value={`${Math.round(metadata.ratio * 100)}%`} />
+          <MetadataList metadata={metadata} model={snapshot.model} />
+        </div>
+        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
+          <SectionHeader
+            title="Evidence placeholders"
+            value={`${Math.round(evidence.ratio * 100)}%`}
+            subtext={`${evidence.signals} signals tracked`}
+          />
+          <EvidenceList buckets={evidence.buckets} missing={evidence.missingBuckets} />
+        </div>
+      </section>
+
+      <section className="grid gap-6 lg:grid-cols-2">
+        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
+          <SectionHeader title="Weighted delta inputs" value={`${weighted.value.toFixed(2)} pts`} />
+          <ul className="mt-4 space-y-2 text-sm text-slate-300">
+            <li>
+              <strong className="text-slate-100">Raw Δ:</strong> {weighted.rawDelta.toFixed(1)} over the last 30 days
+            </li>
+            <li>
+              <strong className="text-slate-100">Adoption weight:</strong> {weighted.adoptionWeight.toFixed(2)} · performance weight {" "}
+              {weighted.performanceWeight.toFixed(2)}
+            </li>
+            <li>
+              <strong className="text-slate-100">Stability penalty:</strong> ×{weighted.stabilityPenalty.toFixed(2)}
+            </li>
+            <li>
+              <strong className="text-slate-100">Momentum boost:</strong> {weighted.momentumBoost.toFixed(2)}
+            </li>
+          </ul>
+        </div>
+        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
+          <SectionHeader title="Trend + volatility" value={`${trend.velocity.toFixed(2)} /wk`} />
+          <ul className="mt-4 space-y-2 text-sm text-slate-300">
+            <li>
+              <strong className="text-slate-100">Window:</strong> {trend.windowDays} days · {trend.sampleCount} checkpoints
+            </li>
+            <li>
+              <strong className="text-slate-100">Delta:</strong> {trend.delta.toFixed(1)} points over the window
+            </li>
+            <li>
+              <strong className="text-slate-100">Volatility bucket:</strong> {snapshot.metrics.volatilityBucket}
+            </li>
+            <li>
+              <strong className="text-slate-100">Volatility index:</strong> {snapshot.metrics.volatilityIndex.toFixed(2)}
+            </li>
+          </ul>
+        </div>
+      </section>
+    </div>
+  );
+}
+
+function MetadataList({ metadata, model }: { metadata: MetadataCompletenessSnapshot; model: Model }) {
+  return (
+    <div className="mt-4 space-y-4 text-sm text-slate-300">
+      <div>
+        <p className="text-xs uppercase tracking-wide text-slate-500">Present</p>
+        <ul className="mt-2 list-disc space-y-1 pl-5">
+          {metadata.present.map((field) => (
+            <li key={field}>{field}</li>
+          ))}
+        </ul>
+      </div>
+      <div>
+        <p className="text-xs uppercase tracking-wide text-slate-500">Missing</p>
+        {metadata.missing.length ? (
+          <ul className="mt-2 list-disc space-y-1 pl-5 text-yellow-200">
+            {metadata.missing.map((field) => (
+              <li key={field}>{field}</li>
+            ))}
+          </ul>
+        ) : (
+          <p className="mt-2 text-slate-400">All tracked metadata fields are populated.</p>
+        )}
+      </div>
+      <div className="rounded-lg border border-slate-800/80 bg-slate-900/30 p-3 text-xs text-slate-400">
+        <p className="font-semibold uppercase tracking-wide text-slate-500">raw metadata</p>
+        <dl className="mt-2 grid grid-cols-2 gap-2">
+          <dt className="text-slate-500">Release</dt>
+          <dd className="text-slate-100">{model.releaseDate ?? "—"}</dd>
+          <dt className="text-slate-500">Modalities</dt>
+          <dd className="text-slate-100">{model.modalities?.join(", ") ?? model.modality ?? "—"}</dd>
+          <dt className="text-slate-500">Parameters</dt>
+          <dd className="text-slate-100">{model.parameterSize ?? "—"}</dd>
+          <dt className="text-slate-500">Training disclosure</dt>
+          <dd className="text-slate-100">{model.trainingDisclosureLevel ?? "—"}</dd>
+          <dt className="text-slate-500">Eval reproducibility</dt>
+          <dd className="text-slate-100">{model.evalReproducibilityLevel ?? "—"}</dd>
+        </dl>
+      </div>
+    </div>
+  );
+}
+
+function EvidenceList({ buckets, missing }: { buckets: EvidenceBucketScore[]; missing: string[] }) {
+  return (
+    <div className="mt-4 space-y-3">
+      {buckets.map((bucket) => (
+        <div key={bucket.key} className="rounded-lg border border-slate-900/60 bg-slate-900/20 p-3">
+          <div className="flex items-center justify-between text-sm">
+            <p className="font-semibold text-slate-100">{bucket.label}</p>
+            <span className="font-mono text-slate-300">{bucket.count} items</span>
+          </div>
+          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
+            <div className="h-1.5 rounded-full bg-accent" style={{ width: `${Math.min(1, bucket.completeness) * 100}%` }} />
+          </div>
+        </div>
+      ))}
+      {missing.length > 0 && (
+        <p className="text-xs text-yellow-200">
+          Missing coverage: {missing.join(", ")} — add placeholder evidence to improve ratios.
+        </p>
+      )}
+    </div>
+  );
+}
+
+function SectionHeader({
+  title,
+  value,
+  subtext
+}: {
+  title: string;
+  value: string;
+  subtext?: string;
+}) {
+  return (
+    <div className="flex items-baseline justify-between gap-4">
+      <div>
+        <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
+        {subtext ? <p className="text-xs text-slate-500">{subtext}</p> : null}
+      </div>
+      <p className="text-2xl font-semibold text-slate-50">{value}</p>
+    </div>
+  );
+}
+
+function MetricBlock({
+  label,
+  value,
+  description,
+  alert,
+  intent
+}: {
+  label: string;
+  value: string;
+  description: string;
+  alert?: boolean;
+  intent?: "positive" | "negative";
+}) {
+  const intentClass = intent === "positive" ? "text-positive" : intent === "negative" ? "text-negative" : "text-slate-100";
+  return (
+    <div className={`rounded-xl border border-slate-900/60 bg-slate-900/20 p-4 ${alert ? "border-yellow-500/40" : ""}`}>
+      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
+      <p className={`text-2xl font-semibold ${intentClass}`}>{value}</p>
+      <p className="text-xs text-slate-500">{description}</p>
+      {alert ? (
+        <p className="mt-1 text-xs text-yellow-300">Transparency below threshold — review disclosures.</p>
+      ) : null}
+    </div>
+  );
+}
