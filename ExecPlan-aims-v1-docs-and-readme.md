# Exec Plan: aims-v1-docs-and-readme

## Goals
- Document the current aims-v1 release in `docs/aims-v1-spec.md`.
- Refresh the root `README.md` with the latest branding, navigation, donation story, and setup instructions.
- Optionally introduce a concise `docs/changelog.md` that captures the aims-v1 foundation + UI milestones.

## Plan
1. **Repository context + guardrails** – Confirm there are no AGENTS.md constraints; keep scope to Markdown docs only.
2. **Spec drafting** – Create the `docs/` folder (if missing) and write `docs/aims-v1-spec.md` with the required sections (Overview, Scoring model, UI & pages, Data & operations, Donation & sustainability), reflecting the existing product experience.
3. **Changelog (optional)** – If it adds clarity, add `docs/changelog.md` summarizing the aims-v1 foundation and UI milestones without duplicating the spec.
4. **README refresh** – Update `README.md` with the new product summary, live link, setup steps, and references to the spec + Methodology page.
5. **Verification + polish** – Proofread docs, run `npm run lint` and a basic typecheck, then capture the commands for the PR summary.

## Status
- 2025-02-15: Plan created.
