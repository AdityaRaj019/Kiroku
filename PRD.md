# Product Requirement Document (PRD)

## Project Name: MangaPulse (Manga Notification Platform)
**Status**: Draft / Under Review  
**Author**: Elite Senior Staff Software Engineer & Architect  
**Date**: June 1, 2026  

---

## 1. Executive Summary
MangaPulse is a high-performance, centralized manga tracking and notification platform designed to eliminate the friction of manually tracking ongoing manga series. By aggregates chapter updates from external services (e.g., MangaDex, AniList), comparing them against a localized cache, and dispatching instant, multi-channel notifications (Push, In-App, and Email Digests), MangaPulse guarantees that readers are notified within minutes of a chapter release. The platform utilizes a decoupled, worker-driven architecture backed by Next.js, Express, PostgreSQL, Prisma, Redis, and BullMQ to ensure horizontal scalability, high throughput, and robust operation under high traffic.

---

## 2. Product Vision
To be the fastest, most reliable, and user-centric manga release tracking platform on the web. MangaPulse aims to consolidate the fragmented manga consumption space by providing a single, unified source of truth for chapter releases, paired with a modern, responsive, and distraction-free UI. The platform’s core pillars are:
- **Instantaneous Alerting**: Minimize the delta between source release and user notification.
- **Personalized Control**: Give users fine-grained filters over what, when, and how they are notified.
- **Clean Workflow**: Provide a seamless jump from notification to reading.
- **High-Performance Architecture**: Maintain operational integrity and external API compliance through intelligent queueing and caching.

---

## 3. Problem Statement
Manga readers face several systemic challenges today:
1. **Manual checking**: Readers must cycle through multiple publisher and aggregator websites to see if a chapter is out.
2. **Delayed discovery**: Popular series updates are missed for hours or days due to lack of push mechanisms.
3. **Inconsistent notifications**: Existing scrapers often fail silently, resulting in missed updates.
4. **Fragmented tracking**: Reading progress is maintained across spreadsheets, browser bookmarks, or separate tracking lists.
5. **No release monitoring**: Aggregators do not offer clean APIs for tracking specific translations or groups.

**MangaPulse solves this by**:
- Automatically scanning source APIs for releases at regular, staggered intervals.
- Providing an integrated dashboard to manage followed series and read progress.
- Offering instant in-app alerts and web-push notifications to bridge the timing gap.

---

## 4. Goals & Objectives
- **Release Latency**: Detect and queue notifications for new chapters within **5 minutes** of their appearance on MangaDex.
- **Deliverability**: Achieve a **99.9%** delivery rate for queued notifications.
- **Engagement**: Transition at least **40%** of monthly active users (MAUs) to active web push subscribers.
- **API Resilience**: Maintain strict compliance with MangaDex rate limits (5 requests/sec burst, 1 request/sec sustained) without failing updates.
- **Uptime**: Maintain a **99.95%** service uptime across APIs and worker services.

---

## 5. Target Audience
- **Primary Users**: Core manga readers who follow more than 10 ongoing series and read chapters as soon as they release.
- **Secondary Users**:
  - Scanlation enthusiasts tracking specific translation groups.
  - Anime/Manga completionists using AniList to synchronize metadata.
  - Power readers needing customizable email summaries rather than individual real-time alerts.

---

## 6. Feature Requirements

### 6.1 User Authentication (MVP)
- **Email & Password**: Standard signup, login, password recovery, and secure sessions.
- **OAuth 2.0 Integration**: Single Sign-On (SSO) using Discord and Google.
- **Session Management**: Secure JWT token pairs (short-lived access tokens stored in-memory, long-lived refresh tokens stored in HttpOnly, secure, SameSite=Strict cookies) with rotation and revocation.

### 6.2 Manga Search & Discovery (MVP)
- **Global Search**: Query manga by title, author, or artist. Powered by MangaDex API with local caching of metadata.
- **Manga Detail Views**: Display cover art, description, publication status, genres, translation groups, and a paginated list of all chapters.
- **AniList Syncing**: Option to link an AniList account to pre-populate follows and reading lists.

### 6.3 Manga Tracking & Progress (MVP)
- **Follow / Unfollow**: A toggle to add/remove series from the user's dashboard.
- **Read Progress Tracker**: Mark chapters as Read/Unread. Automatically suggest the next chapter to read on the user's home screen.
- **Notification Toggles**: Enable/disable alerts per manga globally or per specific translation language.

### 6.4 Chapter Monitoring System (MVP Backend Worker)
- **Scheduled Pollers**: Cron-driven worker services checking for chapter releases.
- **Metadata Reconciliation**: Check external `chapter_id` against the local PostgreSQL database to determine if the chapter is a new release or an edit.
- **Deduplication Engine**: Prevent double insertion or notification of re-uploaded chapters.

### 6.5 Notification Dispatch System (MVP)
- **In-App Notifications**: Toast notifications and a dedicated notification bell menu listing recent updates.
- **Web Push (FCM)**: Real-time system notifications on Desktop and Mobile.
- **Email Alerts (Resend)**: Configurable email notifications.

### 6.6 Notification Preferences (MVP)
- **Global Quiet Mode**: Disable push and email notifications between user-defined hours.
- **Language Filtering**: Restrict notifications to specific languages (e.g., English, Spanish, Japanese).
- **Group Exclusion/Inclusion**: Follow only specific translation groups (e.g., official translations vs. scanlations).

### 6.7 Advanced Features (Post-MVP)
- **Smart Tracking Filters**: Notify only if a chapter contains specific keywords (e.g., "Official") or after a specific chapter number.
- **AI Recommendation Engine**: Vector embeddings of manga summaries combined with reading logs using PGVector to recommend new series.
- **Community Hub**: In-app comments section per chapter and shareable reading lists.
- **Release Prediction**: Machine learning regression modeling historical release patterns to estimate the hour/day of the next chapter's release.

---

## 7. User Flows

### 7.1 Onboarding & Authentication Flow
```
[Landing Page] ➔ [Register / Login Screen] ➔ [OAuth/Credentials Auth]
       ↓
[Success Verification] ➔ [Optional: Import from AniList] ➔ [Redirect to Dashboard]
```

### 7.2 Search & Follow Flow
```
[User Dashboard] ➔ [Type query in Search Bar] ➔ [Results Modal/Page]
       ↓
[Click Manga Title] ➔ [Manga Detail Page] ➔ [Click "Follow Series"]
       ↓
[Modal: Select Notification Preferences (Lang: EN, Push: Yes, Email: No)] ➔ [Saved]
```

### 7.3 Reading Progress & Dashboard Flow
```
[Dashboard Home] ➔ [Shows followed manga with unread chapters count]
       ↓
[Click "Read Next Chapter"] ➔ [Opens Source Link in new tab]
       ↓
[Local DB updates: last_read_chapter updated via click or manual checkbox]
```

### 7.4 Notification Preference Tuning Flow
```
[User Settings] ➔ [Notification Preferences Tab]
       ↓
[Set Quiet Hours: 22:00 - 08:00] ➔ [Toggle Web Push: ON] ➔ [Select Language: English] ➔ [Save Changes]
```

---

## 8. System Workflows

### 8.1 Manga Follow Flow
```mermaid
sequenceDiagram
    participant User as Frontend Client
    participant API as Express API Server
    participant DB as PostgreSQL Database
    
    User->>API: POST /api/v1/follows (mangaId, preferences)
    Note over API: Authenticate user & validate schema
    API->>DB: Check if Manga exists in DB
    alt Manga does not exist
        API->>DB: Fetch manga details from MangaDex API and insert into DB
    end
    API->>DB: Insert into user_follows (userId, mangaId, notificationsEnabled, languages)
    DB-->>API: Row Created / Confirmed
    API-->>User: HTTP 201 Created (Success Response)
```

### 8.2 Chapter Detection & Aggregation Flow (Cron-Scheduled)
```mermaid
sequenceDiagram
    participant Cron as Scheduler (BullMQ)
    participant Worker as Aggregator Worker
    participant API as MangaDex API
    participant DB as PostgreSQL Database
    participant Queue as Redis Queue (BullMQ)

    Cron->>Worker: Trigger Batch Check (Every 5 mins)
    Worker->>DB: Get list of active followed manga IDs
    DB-->>Worker: List of manga source_ids
    Worker->>API: Fetch latest chapters for batch (Respect Rate Limits)
    API-->>Worker: Return array of latest chapters
    loop For each returned chapter
        Worker->>DB: Check if chapter exists by source_id
        alt Chapter does not exist
            Worker->>DB: Insert new chapter row
            Worker->>Queue: Queue Notification Job {mangaId, chapterId}
        end
    end
```

### 8.3 Notification Dispatch Queue Flow
```mermaid
sequenceDiagram
    participant Queue as Redis Queue (BullMQ)
    participant Worker as Notification Dispatcher
    participant DB as PostgreSQL Database
    participant FCM as Firebase Cloud Messaging (Push)
    participant Email as Resend API (Email)

    Queue->>Worker: Consume Notification Job {mangaId, chapterId}
    Worker->>DB: Get followers for mangaId where notifications_enabled = true
    DB-->>Worker: List of users with push tokens & emails
    loop For each user
        Note over Worker: Check Quiet Hours & Language Preferences
        alt Preference Matches & Outside Quiet Hours
            par Push Alert
                Worker->>FCM: Send Web Push payload
                FCM-->>Worker: Success/Fail Token Status
            and In-App Alert
                Worker->>DB: Create Row in notifications table (Read = false)
            and Email Alert (Optional/Digest)
                Worker->>Email: Send Chapter Release Email
                Email-->>Worker: Return Message ID
            end
        end
    end
    Worker->>DB: Record Notification Job stats (sent_status = Sent)
```

---

## 9. Technical Architecture

The platform uses a fully decoupled architecture separating user traffic (API Server) from asynchronous long-running activities (Cron Scheduler, API Aggregator, Notification Workers).

```
                      +-------------------+
                      |   Next.js App     |
                      |   (Vercel Front)  |
                      +---------+---------+
                                | REST / WebSockets
                                v
                      +-------------------+
                      |  Express API      |
                      |  (Railway Node)   |
                      +----+---------+----+
                           |         |
      +--------------------+         +---------------------+
      | Prisma ORM                                         | Read/Write
      v                                                    v
+-----+-------------+                              +-------+-----------+
|   PostgreSQL DB   |                              |    Redis Cache    |
|   (Railway PG)    |                              |   & BullMQ Queue  |
+-------------------+                              +-------+-----+-----+
                                                           ^     ^
                                                           |     |
                                          +----------------+     |
                                          | Job Queue            | Trigger Jobs
                                          v                      v
                               +----------+--------+   +---------+---------+
                               | Notification      |   | Aggregator Worker |
                               | Dispatcher Worker |   | (Polls MangaDex)  |
                               +-------------------+   +-------------------+
```

### Infrastructure Specs:
- **Frontend Framework**: Next.js 15 (App Router, Tailwind CSS, ShadCN UI, Framer Motion)
- **Backend API Engine**: Node.js, Express, TypeScript, ts-node (Nodemon for development)
- **ORM & Database**: PostgreSQL 16+, Prisma ORM (highly structured migrations)
- **Queueing Engine**: Redis v7, BullMQ (enables structured scheduling, retries, backoff, and concurrency management)
- **Push Services**: Firebase Cloud Messaging SDK (VAPID key signatures for web push)
- **Email Dispatch**: Resend SDK (using custom domain DNS validation, SPF, DKIM, DMARC)

---

## 10. Database Design

### 10.1 Prisma Schema (`schema.prisma`)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum SubscriptionLanguage {
  EN
  JA
  ES
  FR
  DE
  IT
  PT
  ZH
}

enum SentStatus {
  PENDING
  SENT
  FAILED
}

model User {
  id           String        @id @default(uuid())
  username     String        @unique
  email        String        @unique
  passwordHash String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  follows      UserFollow[]
  notifications Notification[]
  pushTokens   PushToken[]
}

model PushToken {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  deviceType String?  // e.g., "Chrome-Win", "Safari-iOS"
  createdAt DateTime @default(now())
}

model Manga {
  id            String       @id @default(uuid())
  sourceId      String       @unique // External MangaDex / AniList ID
  title         String
  coverImage    String?
  description   String?      @db.Text
  status        String       // e.g., "ongoing", "completed"
  lastCheckedAt DateTime     @default(now())
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  chapters      Chapter[]
  followers     UserFollow[]
  notifications Notification[]

  @@index([sourceId])
}

model Chapter {
  id            String       @id @default(uuid())
  mangaId       String
  manga         Manga        @relation(fields: [mangaId], references: [id], onDelete: Cascade)
  sourceId      String       @unique // External Chapter ID
  chapterNumber String       // Stored as string to handle "95.5", "100a", etc.
  title         String?
  releaseDate   DateTime
  sourceUrl     String
  language      SubscriptionLanguage @default(EN)
  createdAt     DateTime     @default(now())
  notifications Notification[]

  @@index([mangaId])
  @@index([sourceId])
}

model UserFollow {
  userId               String
  mangaId              String
  user                 User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  manga                Manga                @relation(fields: [mangaId], references: [id], onDelete: Cascade)
  lastReadChapter      String?
  notificationsEnabled Boolean              @default(true)
  languages            SubscriptionLanguage[] @default([EN])
  createdAt            DateTime             @default(now())

  @@id([userId, mangaId])
}

model Notification {
  id         String     @id @default(uuid())
  userId     String
  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  mangaId    String
  manga      Manga      @relation(fields: [mangaId], references: [id], onDelete: Cascade)
  chapterId  String
  chapter    Chapter    @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  sentStatus SentStatus @default(PENDING)
  readStatus Boolean    @default(false)
  sentAt     DateTime?
  createdAt  DateTime   @default(now())

  @@index([userId, readStatus])
  @@index([mangaId])
}
```

### 10.2 Database Indexes & Constraints (SQL DDL)
```sql
-- Composite Key and Relational Foreign Keys
CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Manga" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "sourceId" VARCHAR(255) UNIQUE NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "coverImage" TEXT,
    "description" TEXT,
    "status" VARCHAR(50) NOT NULL,
    "lastCheckedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Chapter" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "mangaId" UUID REFERENCES "Manga"("id") ON DELETE CASCADE NOT NULL,
    "sourceId" VARCHAR(255) UNIQUE NOT NULL,
    "chapterNumber" VARCHAR(20) NOT NULL,
    "title" VARCHAR(255),
    "releaseDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "language" VARCHAR(10) DEFAULT 'EN',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "UserFollow" (
    "userId" UUID REFERENCES "User"("id") ON DELETE CASCADE NOT NULL,
    "mangaId" UUID REFERENCES "Manga"("id") ON DELETE CASCADE NOT NULL,
    "lastReadChapter" VARCHAR(20),
    "notificationsEnabled" BOOLEAN DEFAULT TRUE NOT NULL,
    "languages" VARCHAR(10)[] DEFAULT ARRAY['EN']::VARCHAR(10)[],
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("userId", "mangaId")
);

CREATE TABLE "Notification" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES "User"("id") ON DELETE CASCADE NOT NULL,
    "mangaId" UUID REFERENCES "Manga"("id") ON DELETE CASCADE NOT NULL,
    "chapterId" UUID REFERENCES "Chapter"("id") ON DELETE CASCADE NOT NULL,
    "sentStatus" VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    "readStatus" BOOLEAN DEFAULT FALSE NOT NULL,
    "sentAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crucial Performance Indexes
CREATE INDEX idx_user_follows_manga ON "UserFollow"("mangaId");
CREATE INDEX idx_chapters_manga ON "Chapter"("mangaId");
CREATE INDEX idx_chapters_source ON "Chapter"("sourceId");
CREATE INDEX idx_manga_source ON "Manga"("sourceId");
CREATE INDEX idx_notifications_user_unread ON "Notification"("userId", "readStatus");
CREATE INDEX idx_notifications_manga ON "Notification"("mangaId");
```

---

## 11. API Design

All endpoints require content headers: `Content-Type: application/json`. Protected endpoints require authentication headers: `Authorization: Bearer <JWT_ACCESS_TOKEN>`.

### 11.1 Public API Endpoints
- **GET `/api/v1/manga`**: Search and list manga dynamically.
  - **Query Parameters**:
    - `q` (string, optional) - Search keyword.
    - `limit` (int, default 20) - Pagination limit.
    - `offset` (int, default 0) - Pagination offset.
  - **Response (HTTP 200)**:
    ```json
    {
      "manga": [
        {
          "id": "e2ba8663-e380-4965-a6e5-4f4de55231c5",
          "sourceId": "f74154fa-a83a-4428-98e2-c0e816a75765",
          "title": "Chainsaw Man",
          "coverImage": "https://mangadex.org/covers/f74154fa/cover.jpg",
          "description": "Denji has a simple dream...",
          "status": "ongoing"
        }
      ],
      "pagination": { "limit": 20, "offset": 0, "total": 120 }
    }
    ```

- **GET `/api/v1/manga/:id`**: Get detail view of specific manga.
  - **Response (HTTP 200)**:
    ```json
    {
      "id": "e2ba8663-e380-4965-a6e5-4f4de55231c5",
      "sourceId": "f74154fa-a83a-4428-98e2-c0e816a75765",
      "title": "Chainsaw Man",
      "coverImage": "https://mangadex.org/covers/f74154fa/cover.jpg",
      "description": "Denji has a simple dream...",
      "status": "ongoing",
      "chaptersCount": 160
    }
    ```

- **GET `/api/v1/manga/:id/chapters`**: Get paginated list of chapters for a specific manga.
  - **Query Parameters**:
    - `limit` (int, default 50)
    - `offset` (int, default 0)
    - `language` (string, default "EN")
  - **Response (HTTP 200)**:
    ```json
    {
      "chapters": [
        {
          "id": "180b62e4-9d55-4cc9-b7b5-2fa75bb77322",
          "chapterNumber": "161",
          "title": "A Bitter Choice",
          "releaseDate": "2026-05-30T16:00:00.000Z",
          "sourceUrl": "https://mangadex.org/chapter/180b62e4-9d55-4cc9"
        }
      ]
    }
    ```

### 11.2 Protected API Endpoints (Required Token: JWT)
- **POST `/api/v1/follows`**: Follow a manga series.
  - **Payload**:
    ```json
    {
      "mangaId": "e2ba8663-e380-4965-a6e5-4f4de55231c5",
      "languages": ["EN"],
      "notificationsEnabled": true
    }
    ```
  - **Response (HTTP 201)**:
    ```json
    {
      "message": "Successfully followed manga.",
      "follow": {
        "userId": "d742f8c5-231a-4ab2-9ad1-9653a92ba47d",
        "mangaId": "e2ba8663-e380-4965-a6e5-4f4de55231c5",
        "notificationsEnabled": true
      }
    }
    ```

- **DELETE `/api/v1/follows/:mangaId`**: Unfollow a manga.
  - **Response (HTTP 200)**:
    ```json
    { "message": "Successfully unfollowed manga." }
    ```

- **GET `/api/v1/notifications`**: Get list of user notifications.
  - **Query Parameters**:
    - `unreadOnly` (boolean, default false)
  - **Response (HTTP 200)**:
    ```json
    {
      "notifications": [
        {
          "id": "c138f72c-f6ad-45df-bbfe-881c0db9cd7d",
          "readStatus": false,
          "createdAt": "2026-06-01T15:00:00.000Z",
          "manga": { "title": "Chainsaw Man" },
          "chapter": { "chapterNumber": "161", "title": "A Bitter Choice" }
        }
      ]
    }
    ```

- **PATCH `/api/v1/notifications/read`**: Mark specific or all notifications as read.
  - **Payload**:
    ```json
    {
      "notificationIds": ["c138f72c-f6ad-45df-bbfe-881c0db9cd7d"] // Pass empty array [] to mark all as read
    }
    ```
  - **Response (HTTP 200)**:
    ```json
    { "message": "Notifications updated successfully.", "modifiedCount": 1 }
    ```

### 11.3 Protected Push Token Endpoints
- **POST `/api/v1/notifications/push-token`**: Register a FCM Push Token.
  - **Payload**:
    ```json
    {
      "token": "eXp1X...c890aXb2Z1",
      "deviceType": "Chrome-Windows"
    }
    ```
  - **Response (HTTP 200)**:
    ```json
    { "message": "Push token registered successfully." }
    ```

### 11.4 Admin/System Control Endpoints (Requires API Key Header: `x-admin-key`)
- **POST `/api/v1/admin/worker/retry`**: Manually trigger worker retry logic for failed jobs.
  - **Payload**:
    ```json
    { "queueName": "notification-dispatcher", "jobId": "job-1094" }
    ```
  - **Response (HTTP 200)**:
    ```json
    { "status": "retried", "jobId": "job-1094" }
    ```

- **GET `/api/v1/admin/system/metrics`**: Health check and dashboard metrics for queue sizes and response rates.
  - **Response (HTTP 200)**:
    ```json
    {
      "status": "healthy",
      "workers": { "aggregator": "active", "dispatcher": "active" },
      "queues": {
        "manga-poller": { "waiting": 0, "active": 1, "failed": 4 },
        "notification-dispatcher": { "waiting": 12, "active": 2, "failed": 0 }
      },
      "database": { "connected": true, "poolSize": 8 }
    }
    ```

---

## 12. Notification System Logic

The notification system uses **BullMQ** to process and distribute notifications. Decoupled workers handle heavy integration calls to ensure HTTP responses are not blocked.

### 12.1 Jobs Structure & Payload
1. **Aggregator Job**: Running on a cron pattern, checks batches of followed manga.
2. **Notification Dispatch Job**: Placed in `notification-dispatcher` queue:
   ```json
   {
     "mangaId": "e2ba8663-e380-4965-a6e5-4f4de55231c5",
     "chapterId": "180b62e4-9d55-4cc9-b7b5-2fa75bb77322",
     "chapterNumber": "161",
     "mangaTitle": "Chainsaw Man",
     "language": "EN"
   }
   ```

### 12.2 Channels Implementation
- **In-App Notification**: Writes directly to the `Notification` PostgreSQL table. Emits via Socket.io if the client has an active WebSocket connection.
- **Web Push**: Utilizing Firebase Cloud Messaging (FCM). Employs `webpush-push-token` structures. Tokens that return `Messaging/Registration-token-not-registered` (uninstalled or cleared browser data) are pruned immediately from the database to save database resources.
- **Email Digests**: Sent via Resend. To avoid spamming users, real-time emails are debounced:
  - Users can select **Real-Time**, **Daily Digest**, or **Weekly Digest**.
  - A cron job parses user_follows, groups unread notifications for Digest users, and sends a single summary layout.

### 12.3 Retry and Backoff Logic
For external delivery calls (FCM, Resend), temporary network errors will occur. BullMQ is configured to handle retry strategies:
- **Max Retries**: 5 attempts.
- **Backoff Strategy**: Exponential.
- **Backoff Delay**: $1000 \times 2^{\text{attempt}}$ ms.
- **Dead Letter Queue (DLQ)**: Jobs failing 5 times are moved to a `failed` queue status, emitting an error trace to Sentry for review.

---

## 13. Scalability Plan

Aggregating from external sites and tracking thousands of manga creates high workload bursts. The following safeguards are established:

### 13.1 Staggered & Conditional Polling
1. **API Limit Controls**: The MangaDex API enforces strict limits. Our poller respects this by utilizing a local queue bottleneck where outbound HTTP calls are strictly throttled using a token bucket rate-limiter wrapper (maximum 5 calls/second).
2. **Smart Staggering Interval**: We adjust checking frequencies based on publication state and popularity:
   - **Ongoing (Popular)**: Poll every 10 minutes.
   - **Ongoing (Less Popular)**: Poll every 30 minutes.
   - **Hiatus / Completed**: Poll once every 24 hours.
3. **Database Caching Layer**: All manga metadata (cover art, details, description) is cached locally. When user searches are done, the frontend hits local DB indices first, querying external APIs only if no results are stored.

### 13.2 Queue Prioritization & Batching
- **Job Concurrency**: BullMQ worker concurrency is configured based on CPU core counts ($C \times 2$).
- **Batch Chapter Check**: Poll manga in batches of 100 via MangaDex's multi-ID query filters rather than making individual HTTP queries per manga.

### 13.3 Notification Deduplication Keys
To prevent duplicate pushes if a worker crashes midway:
- Maintain an idempotent key format in Redis: `notif:dup:<user_id>:<chapter_id>`.
- Set token expiration to 24 hours.
- Workers evaluate key existence before initiating FCM payloads.

---

## 14. Security Considerations

### 14.1 Authentication & Token Safety
- **JWT Storage**: In-memory token storage on client side. Refresh tokens reside in a HTTP-only, secure, SameSite=Strict cookie.
- **Password Protection**: Passwords processed using `bcrypt` (work factor rounds = 12).
- **Authentication Handshake**: Socket.io connections authenticate by requiring a handshake parameter verification containing the client JWT token.

### 14.2 API Security Controls
- **Rate-Limiting**:
  - Public endpoints: max 60 requests per minute per IP.
  - Auth endpoints (login/signup): max 5 requests per minute per IP.
- **Cors Policy**: Express app uses `cors` whitelist config ensuring only the designated Vercel production frontend domain has execution rights.
- **Helmet Middleware**: Configured security headers:
  - Disables `X-Powered-By`.
  - Configures strict Content-Security-Policy (CSP) headers.

### 14.3 Input Validation
All request payloads are verified against schemas utilizing **Zod** schema parser models. Invalid JSON payloads are intercepted at the Express middleware layer and returned with descriptive 400 Bad Request messages before invoking core database functions.

---

## 15. CI/CD Strategy

All code pushes undergo Automated Pipeline verification via GitHub Actions.

```
                  +----------------------------------+
                  |           Git Push/PR            |
                  +----------------+-----------------+
                                   |
                                   v
                  +----------------+-----------------+
                  |       Run Linter & Formatter     |
                  +----------------+-----------------+
                                   | Pass
                                   v
                  +----------------+-----------------+
                  |   Run Unit & Integration Tests   |
                  +----------------+-----------------+
                                   | Pass
                                   v
                  +----------------+-----------------+
                  |      Build Artifacts Check       |
                  |     (Vite client / Node build)   |
                  +----------------+-----------------+
                                   | Pass
                                   v
                  +----------------+-----------------+
                  |      Deploy to Railway/Vercel     |
                  +----------------------------------+
```

### 15.1 GitHub Actions Workflow: `.github/workflows/ci.yml`
```yaml
name: Continuous Integration & Deployment

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: kiroku_test
          POSTGRES_USER: runner
          POSTGRES_PASSWORD: password123
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: |
            backend/package-lock.json
            frontend/package-lock.json

      # Backend Checks
      - name: Install Backend Dependencies
        run: npm ci
        working-directory: ./backend

      - name: Generate Prisma Client
        run: npx prisma generate
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://runner:password123@localhost:5432/kiroku_test

      - name: Run Backend Linter
        run: npm run lint
        working-directory: ./backend
        continue-on-error: false

      - name: Run Backend Tests
        run: npm run test
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://runner:password123@localhost:5432/kiroku_test
          REDIS_URL: redis://localhost:6379

      # Frontend Checks
      - name: Install Frontend Dependencies
        run: npm ci
        working-directory: ./frontend

      - name: Run Frontend Build
        run: npm run build
        working-directory: ./frontend
        env:
          NEXT_PUBLIC_API_URL: https://api.placeholder.com

  deploy:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Railway Deploy (Backend)
        run: |
          curl -X POST ${{ secrets.RAILWAY_DEPLOY_WEBHOOK }}
      - name: Trigger Vercel Deploy (Frontend)
        run: |
          curl -X POST ${{ secrets.VERCEL_DEPLOY_WEBHOOK }}
```

---

## 16. Deployment Architecture

### 16.1 Environment Topology
- **Vercel (Production Client)**: Hosts the Next.js React frontend. Edge networking caching and routing for low latency.
- **Railway Server Node**: 
  - Hosts the Express API container.
  - Hosts the background daemon workers.
  - Automatically scales container instances based on CPU utilization metrics.
- **Database Engine**: Railway managed Postgres Instance. Multi-connection scaling via connection pool parameters (`pg-pool`).
- **Redis Cluster**: Actively handles queue variables and runtime session keys.

### 16.2 Environment Variable Declarations

#### Backend Configuration (`backend/.env`):
```ini
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://db_user:secure_password@db_host:5432/kiroku?schema=public&connection_limit=10
REDIS_URL=redis://default:redis_password@redis_host:6379
JWT_SECRET=super_secret_cryptographic_key_32_chars_long
JWT_REFRESH_SECRET=another_super_secret_refresh_key_32_chars_long
FCM_SERVER_KEY=firebase_cloud_messaging_authorization_token
RESEND_API_KEY=re_123456789abcdef
FRONTEND_URL=https://mangapulse.vercel.app
ADMIN_API_KEY=another_secure_admin_control_key
```

#### Frontend Configuration (`frontend/.env.local`):
```ini
NEXT_PUBLIC_API_URL=https://api.mangapulse.net
NEXT_PUBLIC_FCM_VAPID_KEY=BHg...d3Y
```

---

## 17. Monitoring Strategy

Observability is core to ensuring worker reliability and API response consistency.

### 17.1 Structured Log Specifications
Backend logging standardizes on **Winston** to output raw logging in JSON structures. System metrics format follows:
```json
{
  "timestamp": "2026-06-01T15:30:00.002Z",
  "level": "info",
  "message": "Notification successfully sent.",
  "context": {
    "userId": "d742f8c5-231a-4ab2-9ad1-9653a92ba47d",
    "chapterId": "180b62e4-9d55-4cc9-b7b5-2fa75bb77322",
    "mangaId": "e2ba8663-e380-4965-a6e5-4f4de55231c5",
    "channel": "FCM_Push",
    "durationMs": 42
  }
}
```

### 17.2 Metrics Tracker Dashboard (Prometheus/Grafana)
We expose custom Prometheus metrics endpoints on the API server:
- `manga_poll_duration_seconds`: Histogram of worker processing execution cycles.
- `notification_delivery_latency_seconds`: Duration between chapter detection and notification dispatch.
- `notification_failure_total`: Counter tracking failed dispatches tagged by failure labels (`FCM_Token_Expired`, `Resend_Rate_Limit`, `Network_Error`).

### 17.3 Sentry Integration
Any unhandled exception inside the worker processes is piped directly to Sentry, including stack trace contexts, environment tags, and relevant user context details.

---

## 18. Future Roadmap

```
+--------------------------------------------------------+
|                      Roadmap Phases                    |
+--------------------------------------------------------+
|                                                        |
|  Phase 1: MVP Setup (Weeks 1-4)                        |
|  * Setup DB models, authentication endpoints           |
|  * Integrate search & basic lists workflows            |
|  * Simple pollers matching direct chapter tables       |
|                                                        |
|  Phase 2: Scale and Dispatch (Weeks 5-8)               |
|  * Set up Redis clusters and BullMQ process instances  |
|  * Implement VAPID FCM pushes & Resend integration     |
|  * Introduce customized client settings panel         |
|                                                        |
|  Phase 3: Smart Tracking & AI (Weeks 9-12)             |
|  * Multi-language, translator filtering controls       |
|  * AI manga recommendations via pgvector embeddings    |
|  * Release interval forecasting algorithm             |
|                                                        |
|  Phase 4: Platforms & Ecosystem (Weeks 13-16)          |
|  * Native iOS & Android companion applications        |
|  * Browser Extension (Firefox/Chrome quick view)       |
|  * Discord/Telegram alerting Webhook integrations      |
|                                                        |
+--------------------------------------------------------+
```

---

## 19. Risks & Constraints

1. **Third-Party API Outages**: MangaDex or AniList APIs may suffer unexpected disruptions.
   - **Mitigation**: Graceful degradation. If search APIs fail, present cached catalog records with a banner indicating "Search offline".
2. **Push Notification Blockers**: Modern browsers impose strict policies on background worker pushes.
   - **Mitigation**: Educate users during registration, showing onboarding tips on how to register browser service workers correctly.
3. **Queue Bloating**: If millions of notifications are generated during a major release spike, workers can run out of system memory.
   - **Mitigation**: Scale workers horizontally using container replication, and deploy separate Redis instances exclusively for BullMQ data.

---

## 20. Success Metrics

- **Average Delivery Time**: Delivery of pushes $\le 10$ seconds after local database recording.
- **Engagement Threshold**: Average active users interacting with at least **3 pushes** per week.
- **Subscription Conversions**: Over **25%** of logged-in users tracking more than 5 series.
- **API Error Ratios**: Error rate on the Express controller routes remains $\le 0.05\%$.
- **Database Query Performance**: Average response times for `/manga/:id/chapters` under load $\le 50$ milliseconds.
