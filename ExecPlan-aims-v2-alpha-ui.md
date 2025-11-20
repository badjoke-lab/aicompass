diff --git a/ExecPlan-aims-v2-alpha-ui.md b/ExecPlan-aims-v2-alpha-ui.md
new file mode 100644
index 0000000000000000000000000000000000000000..7e1024b6adf9ec03c7441815b06fe9ada4fd1fde
--- /dev/null
+++ b/ExecPlan-aims-v2-alpha-ui.md
@@ -0,0 +1,25 @@
+# Exec Plan: aims-v2-alpha-ui
+
+## Goals
+- Stand up an internal-only aims-v2 UI surface under `/v2/*` without touching the public aims-v1 flows.
+- Ship the `/v2/leaderboard` snapshot plus `/v2/models/[slug]` detail views using the v2 scoring helpers in `lib/v2`.
+- Keep the interface minimal (tables, small charts, text summaries) yet deterministic and type-safe so it can be iterated on quickly.
+- Avoid adding navigation links or public exposure until the prototype is validated.
+
+## Plan
+1. **Routing & layout scaffold**
+   - Add a dedicated `app/v2` layout with lightweight context text to ensure the alpha pages stay isolated from v1.
+   - Wire `/v2/leaderboard` and `/v2/models/[slug]` routes that rely solely on server components so data stays deterministic.
+2. **Leaderboard snapshot**
+   - Use `v2ScoreEngine.getSnapshots()` to build a table of all models with totals, weighted deltas, volatility, transparency, and ecosystem depth markers.
+   - Keep styling consistent with existing Tailwind tokens and reuse shared helpers (`HistorySparkline`, badges) when practical.
+3. **Model detail page**
+   - Combine `v2ScoreEngine.getBySlug` with `getInternalDashboardData()` to surface metadata completeness, evidence buckets, transparency health, and trend velocity history per model.
+   - Provide placeholders for evidence gaps and metadata coverage so reviewers can see what still needs curation.
+4. **Verification**
+   - Run `npm run lint` plus `npx tsc --noEmit` to ensure the prototype passes linting and type checks.
+   - Capture fresh screenshots of both new routes for internal review.
+   - Open a PR summarizing the prototype scope and verification steps.
+
+## Status
+- 2025-02-22: Plan created and ready for execution.
