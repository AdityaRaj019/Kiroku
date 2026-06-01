# Graph Report - kiroku  (2026-06-01)

## Corpus Check
- 58 files · ~27,329 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 576 nodes · 535 edges · 54 communities (47 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bb015868`
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
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `What You Must Do When Invoked` - 16 edges
3. `/graphify` - 15 edges
4. `compilerOptions` - 11 edges
5. `Part B - Semantic extraction (parallel subagents)` - 8 edges
6. `1. The Workflow Lifecycle` - 7 edges
7. `For --update (incremental re-extraction)` - 7 edges
8. `scripts` - 6 edges
9. `Project Context Bootstrap` - 6 edges
10. `Feature Development Workflow` - 6 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (54 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (98): Args, At, AtLeast, AtLoose, AtStrict, BatchPayload, Boolean, Bytes (+90 more)

### Community 1 - "Community 1"
Cohesion: 0.03
Nodes (63): AggregateUser, GetUserAggregateType, GetUserGroupByPayload, IntFieldUpdateOperationsInput, NullableStringFieldUpdateOperationsInput, Prisma__UserClient, StringFieldUpdateOperationsInput, UserAggregateArgs (+55 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (38): code:block1 (/graphify                                             # full), code:bash (if [ ! -f graphify-out/.graphify_python ]; then), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash (if [ ! -f graphify-out/.graphify_extract.json ]; then), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c ") (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (36): code:bash (mkdir -p graphify-out), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash (LOCAL_PATH=$(graphify clone <github-url> [--branch <branch>]), code:bash (graphify export obsidian), code:bash (graphify export html  # auto-aggregates to community view if), code:bash (graphify export wiki), code:bash (graphify export neo4j), code:bash (graphify export neo4j --push bolt://localhost:7687 --user ne) (+28 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (23): ModelName, NullsOrder, NullTypes, QueryMode, SortOrder, TransactionIsolationLevel, UserScalarFieldEnum, User (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (26): dependencies, cors, dotenv, express, jsonwebtoken, @prisma/client, redis, socket.io (+18 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (21): dependencies, next, react, react-dom, devDependencies, eslint, eslint-config-next, tailwindcss (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (12): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, outDir, resolveJsonModule, rootDir (+4 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (13): code:bash ($(cat graphify-out/.graphify_python) -c "), code:block11 ([Agent tool call 1: files 1-15, subagent_type="general-purpo), code:bash (PROJECT_ROOT=$(cat graphify-out/.graphify_root)), code:block13 (You are a graphify extraction subagent. Read the files liste), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c ") (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (11): 1. Identity & Mindset, 2.1 The Sandbox Rule (Test in Isolation), 2.2 Strict Boundary Safety, 2.3 Project Memory & Context Bootstrap, 2. Engineering Philosophy, 3.1 Response Structure, 3. Communication & Response Protocols, 4. Forbidden Actions (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (6): config, LogOptions, PrismaClient, PrismaClientConstructor, PrismaClient, User

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
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 30 - "Community 30"
Cohesion: 0.40
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 31 - "Community 31"
Cohesion: 0.40
Nodes (4): app, io, prisma, server

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

## Knowledge Gaps
- **439 isolated node(s):** `name`, `version`, `private`, `dev`, `build` (+434 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `What You Must Do When Invoked` connect `Community 3` to `Community 9`, `Community 2`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `/graphify` connect `Community 2` to `Community 3`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Step 3 - Extract entities and relationships` connect `Community 9` to `Community 3`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _439 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.020202020202020204 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.03125 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._