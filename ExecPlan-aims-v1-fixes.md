# ExecPlan: aims-v1-fixes

## Objectives
- Rebrand lingering references to legacy names so the product consistently presents as **AI Model Scoreboard**.
- Modernize funding touchpoints with placeholder Stripe/Ko-fi links and BTC/ETH/USDT wallet cards until production credentials exist.
- Expand the aims-v1 methodology narrative with detailed philosophy, category coverage, delta rules, and transparency expectations.
- Refresh public documentation to reflect the updated story without touching `AGENTS.md`.

## Scope & Deliverables
1. **Brand Language** – Audit metadata, navigation, and hero copy for any legacy brand references (e.g., prior project names) and ensure they now read "AI Model Scoreboard" end-to-end.
2. **Donation Experience** – Update `/donation` to feature placeholder Stripe and Ko-fi links plus crypto wallet cards for BTC, ETH, and USDT with sample addresses/memos.
3. **Methodology Depth** – Rework `/methodology` to explicitly document the evidence-first principle, all seven scoring categories, the 30-day delta rule, and transparency requirements.
4. **Documentation** – Ensure README (and any other relevant docs) describe the updated methodology, donation rails, and naming conventions.
5. **Quality Gate** – Run lint + typecheck, capture refreshed UI screenshots (home leaderboard & methodology), and prep a clean PR vs `main`.

## Phases
1. **Assessment (Done)**
   - Scan codebase for outdated branding.
   - Review existing donation/methodology pages for gaps.
2. **Implementation**
   - Update donation data structures and copy with placeholders.
   - Rewrite methodology content with structured sections.
   - Ensure README summarizes brand, methodology, and donation options.
3. **Validation & Release**
   - Run `npm run lint` and `npx tsc --noEmit`.
   - Capture screenshots via the running dev server.
   - Commit, open PR via `make_pr`.

## Risks & Mitigations
- **Hidden brand references** – Use repository-wide search (case-insensitive) to confirm none remain.
- **Copy regressions** – Keep changes textual; avoid structural component changes to minimize styling impact.
- **Build failures** – Run lint/typecheck locally before PR.

## Success Metrics
- No occurrences of legacy names.
- `/donation` and `/methodology` pages show new copy & placeholder rails.
- README communicates methodology/donation updates.
- Tests pass and screenshots stored for the PR.
