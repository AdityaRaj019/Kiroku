# Graph Report - kiroku  (2026-07-03)

## Corpus Check
- 56 files · ~37,883 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 704 nodes · 952 edges · 66 communities (60 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2272a815`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]

## God Nodes (most connected - your core abstractions)
1. `Product Requirement Document (PRD)` - 22 edges
2. `What You Must Do When Invoked` - 16 edges
3. `upsertMangaBatch()` - 15 edges
4. `/graphify` - 15 edges
5. `getMangaDetails()` - 14 edges
6. `parseUserId()` - 13 edges
7. `11.2 Protected API Endpoints (Required Token: JWT)` - 13 edges
8. `useAuthStore` - 12 edges
9. `MangaDexService` - 11 edges
10. `refresh()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `refresh()` --calls--> `parseUserId()`  [EXTRACTED]
  backend/src/modules/auth/auth.controller.ts → backend/src/utils/auth.helpers.ts
- `logout()` --calls--> `parseUserId()`  [EXTRACTED]
  backend/src/modules/auth/auth.controller.ts → backend/src/utils/auth.helpers.ts
- `profile()` --calls--> `parseUserId()`  [EXTRACTED]
  backend/src/modules/auth/auth.controller.ts → backend/src/utils/auth.helpers.ts
- `upsertLibraryItem()` --calls--> `parseUserId()`  [EXTRACTED]
  backend/src/modules/library/controllers/upsert.ts → backend/src/utils/auth.helpers.ts
- `getMangaDetails()` --calls--> `parseUserId()`  [EXTRACTED]
  backend/src/modules/manga/manga.controller.ts → backend/src/utils/auth.helpers.ts

## Communities (66 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (25): clearRefreshCookie(), login(), logout(), profile(), refresh(), register(), setRefreshCookie(), LoginInput (+17 more)

### Community 1 - "Community 1"
Cohesion: 0.29
Nodes (7): 11.5.1 Multi-Platform Library Aggregator, 11.5.2 Spoiler-Free Community Comments, 11.5.3 Intelligent Manga Recommendation Engine, 11.5.4 Physical & Digital Hybrid Ledger, 11.5.5 Scan-to-Track, 11.5.6 Social "Read-Along" Rooms, 11.5 Phase 2 API Endpoints

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (38): code:block1 (/graphify                                             # full), code:bash (if [ ! -f graphify-out/.graphify_python ]; then), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash (if [ ! -f graphify-out/.graphify_extract.json ]; then), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c ") (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.04
Nodes (49): code:bash ($(cat graphify-out/.graphify_python) -c "), code:block11 ([Agent tool call 1: files 1-15, subagent_type="general-purpo), code:bash (PROJECT_ROOT=$(cat graphify-out/.graphify_root)), code:block13 (You are a graphify extraction subagent. Read the files liste), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c ") (+41 more)

### Community 4 - "Community 4"
Cohesion: 0.20
Nodes (9): 19. Risks & Constraints, 1. Executive Summary, 20. Success Metrics, 2. Product Vision, 3. Problem Statement, 4. Goals & Objectives, 5. Target Audience, Product Requirement Document (PRD) (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (13): 7.5.1 Multi-Platform Sync Flow, 7.5.2 Spoiler-Free Comments Flow, 7.5.3 Scan-to-Track Flow, 7.5 Phase 2 Feature Flows, 8.1 Manga Follow Flow, 8.2 Chapter Detection & Aggregation Flow (Cron-Scheduled), 8.3 Notification Dispatch Queue Flow, 8. System Workflows (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (9): 7.1 Onboarding & Authentication Flow, 7.2 Search & Follow Flow, 7.3 Reading Progress & Dashboard Flow, 7.4 Notification Preference Tuning Flow, 7. User Flows, code:block1 ([Landing Page] ➔ [Register / Login Screen] ➔ [OAuth/Credenti), code:block2 ([User Dashboard] ➔ [Type query in Search Bar] ➔ [Results Mod), code:block3 ([Dashboard Home] ➔ [Shows followed manga with unread chapter) (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (9): 16.1 Environment Topology, 16.2 Environment Variable Declarations, 16. Deployment Architecture, Backend Configuration (`backend/.env`):, code:json ({ "message": "Notifications updated successfully.", "modifie), code:json ({), code:ini (NODE_ENV=production), code:ini (NEXT_PUBLIC_API_URL=https://api.mangapulse.net) (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (15): FilterState, LANGUAGES, LeftFilterPanel(), LeftFilterPanelProps, POPULAR_GENRES, STATUS_OPTIONS, MangaCard(), MangaCardProps (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (11): 1. Identity & Mindset, 2.1 The Sandbox Rule (Test in Isolation), 2.2 Strict Boundary Safety, 2.3 Project Memory & Context Bootstrap, 2. Engineering Philosophy, 3.1 Response Structure, 3. Communication & Response Protocols, 4. Forbidden Actions (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (16): 10.1 Prisma Schema (`schema.prisma`), 10.2 Database Indexes & Constraints (SQL DDL), 10.3 Prisma Schema Extensions for Phase 2, 10.4 SQL DDL Extensions for Phase 2, 10. Database Design, 11.2 Protected API Endpoints (Required Token: JWT), 11.4 Admin/System Control Endpoints (Requires API Key Header: `x-admin-key`), code:prisma (datasource db {) (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.20
Nodes (9): 1. Stack Detection Procedure, 2.1 Code Conventions Alignment, 2.2 Package Managers Alignment, 2. Adaptation Guidelines, Dynamic Project Stack Detection & Alignment Guidelines, Step 1: Detect Language Environment, Step 2: Identify Core Frameworks (JavaScript/Node Ecosystem), Step 3: Detect Build Tooling & Type System (+1 more)

### Community 13 - "Community 13"
Cohesion: 0.22
Nodes (8): 1. The Workflow Lifecycle, code:mermaid (graph TD), Phase 1: Planning & Codebase Inspection, Phase 2: Sandbox Isolation & Verification, Phase 3: Integration, Phase 4: Validation Loop, Phase 5: Sign-Off & Verification, Task Execution Lifecycle & Development Workflow

### Community 14 - "Community 14"
Cohesion: 0.25
Nodes (7): 1. Directory Structure, 2. Component Implementation (`Button.tsx`), 3. Styles (`Button.module.css`), code:block1 (src/components/ui/Button/), code:typescript (import React from 'react';), code:css (.button {), React Component Template Blueprint

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (7): code:text (Action_Register.md), Graphify Context, Obsidian Vault Context, Output Discipline, Priority Order, Project Context Bootstrap, When To Run

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (6): 1. Requirements & Spec Analysis, 2. Sandbox Verification (The Isolation Stage), 3. Schema & Database Execution, 4. Logic Implementation, 5. Verification & Validation Loop, Feature Development Workflow

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (5): 1. Structure & Naming, 2. Type Safety & Parameters, 3. Asynchronous Execution, 4. Correctness & Error Safety, Function Quality & Execution Checklist

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (5): 1. Build & Type Checking, 2. Testing & Coverage, 3. Styling & Performance Assets, 4. Logging & Monitoring, Production Readiness & Deployment Checklist

### Community 19 - "Community 19"
Cohesion: 0.33
Nodes (5): 1. Reproduction & Tracing, 2. Diagnosis & Isolation, 3. Implementing the Fix, 4. Validation Loop, Bug Fixing & Diagnosis Workflow

### Community 20 - "Community 20"
Cohesion: 0.33
Nodes (5): 1. Stabilize, 2. Verify the Mitigation, 3. Patch Safely, 4. Close the Loop, Hotfix & Rollback Workflow

### Community 21 - "Community 21"
Cohesion: 0.33
Nodes (5): 1. Triage, 2. Mitigation, 3. Communication, 4. Recovery & Follow-Up, Incident Response Checklist

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (5): 1. Scope & Diff Hygiene, 2. Verification, 3. Security & Operations, 4. Handoff, Pull Request Readiness Checklist

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (5): 1. Injection & Database Security, 2. Secret & Configuration Safety, 3. Client & Cross-Origin Safety, 4. Payload & System Hardening, Security Inspection Checklist

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (5): 1. Directory Structure, 2. API Controller Implementation, API Route Template Blueprint, code:block1 (src/server/controllers/userController.ts  # Controller file), code:typescript (import { Request, Response } from 'express';)

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (5): 1. Pure Function Test Blueprint, 2. Async Service Test Blueprint with Mocks, code:typescript (import { describe, it, expect } from 'vitest';), code:typescript (import { describe, it, expect, vi, beforeEach } from 'vitest), Test Template Blueprint

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (5): 1. Pre-Release Validation, 2. Environment Verification, 3. Execution & Release, 4. Post-Deployment Smoke Test, Deployment & Release Workflow

### Community 27 - "Community 27"
Cohesion: 0.40
Nodes (4): Agent Framework Index, Load Order, Retrieval Rules, Skill Map

### Community 28 - "Community 28"
Cohesion: 0.40
Nodes (4): 1. Strict Asynchronous Execution Laws, 2. Function Design Standards, 3. Boundary Safety & Data Integrity, Absolute Global Laws & Coding Standards

### Community 29 - "Community 29"
Cohesion: 0.15
Nodes (8): bebasNeue, geistMono, geistSans, metadata, notoSansJP, plusJakartaSans, HydrationGuard(), QueryProvider()

### Community 30 - "Community 30"
Cohesion: 0.08
Nodes (26): 1. Database & Cache Infrastructure, 2. Backend Setup, 3. Frontend Setup, 📡 API Routing Overview, Authentication (`/api/v1/auth`), code:text (=======================================================), code:text (kiroku/), code:bash (docker start kiroku-redis) (+18 more)

### Community 31 - "Community 31"
Cohesion: 0.10
Nodes (19): authRouter, libraryRouter, errorMiddleware(), app, authLimiter, bootstrap(), corsOrigins, globalLimiter (+11 more)

### Community 32 - "Community 32"
Cohesion: 0.50
Nodes (3): Gotchas, Instructions, Validation Loops

### Community 33 - "Community 33"
Cohesion: 0.50
Nodes (3): Gotchas, Instructions, Validation Loops

### Community 34 - "Community 34"
Cohesion: 0.50
Nodes (3): Gotchas, Instructions, Validation Loops

### Community 35 - "Community 35"
Cohesion: 0.50
Nodes (3): Gotchas, Instructions, Validation Loops

### Community 36 - "Community 36"
Cohesion: 0.50
Nodes (3): Gotchas, Instructions, Validation Loops

### Community 37 - "Community 37"
Cohesion: 0.50
Nodes (3): Gotchas, Instructions, Validation Loops

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (3): Gotchas, Instructions, Validation Loops

### Community 39 - "Community 39"
Cohesion: 0.50
Nodes (3): Gotchas, Instructions, Validation Loops

### Community 40 - "Community 40"
Cohesion: 0.50
Nodes (3): Gotchas, Instructions, Validation Loops

### Community 41 - "Community 41"
Cohesion: 0.50
Nodes (3): Gotchas, Instructions, Validation Loops

### Community 42 - "Community 42"
Cohesion: 0.50
Nodes (3): Gotchas, Instructions, Validation Loops

### Community 43 - "Community 43"
Cohesion: 0.50
Nodes (3): Gotchas, Instructions, Validation Loops

### Community 47 - "Community 47"
Cohesion: 0.10
Nodes (6): AIAssistant(), FeatureCardProps, Features(), Footer(), Header(), Hero()

### Community 48 - "Community 48"
Cohesion: 0.29
Nodes (7): 8.4.1 Multi-Platform Aggregation Flow (Cron-Scheduled), 8.4.2 Scan-to-Track Image Reconciliation Flow, 8.4.3 Social Read-Along Room Progress Sync, 8.4 Phase 2 System Workflows, code:mermaid (sequenceDiagram), code:mermaid (sequenceDiagram), code:mermaid (sequenceDiagram)

### Community 49 - "Community 49"
Cohesion: 0.18
Nodes (12): LibraryItemIdParam, libraryItemIdParamSchema, libraryQuerySchema, LibraryStatus, LibraryUserIdParam, libraryUserIdParamSchema, MediaType, SortField (+4 more)

### Community 50 - "Community 50"
Cohesion: 0.35
Nodes (6): removeLibraryItem(), getPublicUserLibrary(), getUserLibrary(), LibraryQueryInput, AppError, parseUserId()

### Community 52 - "Community 52"
Cohesion: 0.22
Nodes (9): 6.1 User Authentication (MVP), 6.2 Manga Search & Discovery (MVP), 6.3 Manga Tracking & Progress (MVP), 6.4 Chapter Monitoring System (MVP Backend Worker), 6.5 Notification Dispatch System (MVP), 6.6 Notification Preferences (MVP), 6.7 Advanced Features (Post-MVP), 6.8 Phase 2 Advanced Core Features (+1 more)

### Community 53 - "Community 53"
Cohesion: 0.33
Nodes (6): 15.1 GitHub Actions Workflow: `.github/workflows/ci.yml`, 15. CI/CD Strategy, code:json ({), code:json ({), code:block35 (+----------------------------------+), code:yaml (name: Continuous Integration & Deployment)

### Community 54 - "Community 54"
Cohesion: 0.47
Nodes (6): 11.1 Public API Endpoints, 11.3 Protected Push Token Endpoints, 11. API Design, code:json ({), code:json ({), code:json ({)

### Community 55 - "Community 55"
Cohesion: 0.11
Nodes (34): ensureLocalManga(), resolveEndDate(), resolveStartDate(), upsertLibraryItem(), extractArtist(), extractAuthor(), extractCoverUrl(), fetchUserTracking() (+26 more)

### Community 56 - "Community 56"
Cohesion: 0.20
Nodes (10): getMangaChapters(), mangaRouter, ChaptersQueryInput, chaptersQuerySchema, MangaIdParam, mangaIdParamSchema, SearchQueryInput, searchQuerySchema (+2 more)

### Community 57 - "Community 57"
Cohesion: 0.18
Nodes (11): adapter, chapterCounts, followMap, generateChapters(), HASHED_PASSWORD, libraryItemMap, main(), mangaData (+3 more)

### Community 58 - "Community 58"
Cohesion: 0.33
Nodes (6): 12.1 Jobs Structure & Payload, 12.2 Channels Implementation, 12.3 Retry and Backoff Logic, 12. Notification System Logic, code:json ({ "message": "Successfully unfollowed manga." }), code:json ({)

### Community 59 - "Community 59"
Cohesion: 0.07
Nodes (36): AuthActions, AuthState, initialState, useAuthStore, useRouteGuard(), Navbar(), GlassCard(), GlassCardProps (+28 more)

### Community 60 - "Community 60"
Cohesion: 0.33
Nodes (6): 17.1 Structured Log Specifications, 17.2 Metrics Tracker Dashboard (Prometheus/Grafana), 17.3 Sentry Integration, 17. Monitoring Strategy, code:json ({ "message": "Push token registered successfully." }), code:json ({)

### Community 62 - "Community 62"
Cohesion: 0.50
Nodes (4): 13.1 Staggered & Conditional Polling, 13.2 Queue Prioritization & Batching, 13.3 Notification Deduplication Keys, 13. Scalability Plan

### Community 63 - "Community 63"
Cohesion: 0.50
Nodes (4): 14.1 Authentication & Token Safety, 14.2 API Security Controls, 14.3 Input Validation, 14. Security Considerations

### Community 64 - "Community 64"
Cohesion: 0.67
Nodes (3): 18. Future Roadmap, code:json ({ "queueName": "notification-dispatcher", "jobId": "job-1094), code:block40 (+--------------------------------------------------------+)

### Community 65 - "Community 65"
Cohesion: 0.40
Nodes (5): 7.5.4 Social "Read-Along" Room Flow, 9. Technical Architecture, code:block15 (+-------------------+), code:block8 ([Social Hub] ➔ [Create Room] ➔ [Select Manga & Set Target Ch), Infrastructure Specs:

## Knowledge Gaps
- **297 isolated node(s):** `adapter`, `prisma`, `preHashHex`, `HASHED_PASSWORD`, `usersData` (+292 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product Requirement Document (PRD)` connect `Community 4` to `Community 64`, `Community 65`, `Community 5`, `Community 6`, `Community 7`, `Community 11`, `Community 52`, `Community 53`, `Community 54`, `Community 58`, `Community 60`, `Community 62`, `Community 63`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `What You Must Do When Invoked` connect `Community 3` to `Community 2`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `/graphify` connect `Community 2` to `Community 3`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `adapter`, `prisma`, `preHashHex` to the rest of the system?**
  _297 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `Community 9` be split into smaller, more focused modules?**
  _Cohesion score 0.10461538461538461 - nodes in this community are weakly interconnected._