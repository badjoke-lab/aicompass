# Exec Plans

## aims-v1-ui
- **Owner:** ChatGPT (gpt-5-codex)
- **Created:** 2025-02-14
- **Status:** Active
- **Summary:** Build the aims-v1 UI layers on top of the existing foundation, including leaderboard, spikes/movers, and detailed model views powered by local JSON data.

### Plan
1. **Baseline + data audit** – Re-read the existing foundation components, typings, and data helpers so that the new UI reuses them without regressions. Update the local JSON/types only where new subscores or metadata are required.
2. **Home leaderboard experience** – Implement a responsive dark-theme leaderboard (table on desktop, cards on mobile) with the summary bar, tracked metrics, total averages, and "Spikes & Movers" section powered by the helper functions.
3. **Model detail view** – Build `/models/[slug]` routes showing vendor/modality metadata, chips for leaderboard status and spikes/waiting, the 30-day sparkline, subscore grids, and placeholder evidence links grouped per scoring category.
4. **Polish + QA** – Ensure styling/theme consistency, wire up mock history data for sparklines, document progress here, and finish with lint/typecheck plus screenshots for the leaderboard and a model detail page.

### Progress
- 2025-02-14: Plan created and baseline review started.
- 2025-02-14: Implemented the aims-v1 leaderboard/table UI, movers section, model detail route, and ran lint/type checks with screenshots.
