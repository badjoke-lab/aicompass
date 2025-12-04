# V4 Overview

The v4 foundation introduces a dedicated API namespace, faster snapshot runner, and the second iteration of the scoring pipeline. This document outlines the intent of the foundation without exposing production logic.

## Goals
- Establish `/api/*` endpoints with predictable JSON responses.
- Centralize configuration for cache, sources, and feature flags.
- Unify metadata handling so downstream systems can rely on canonical shapes.
- Prepare the scoring v2 data flow while returning stubbed values for now.

## Non-goals
- Changing any v3 behavior or UI surfaces.
- Implementing final scoring formulas or persistence layers.
- Exposing publicly discoverable endpoints (robots headers remain in place).
