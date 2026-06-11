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

### 6.8 Phase 2 Advanced Core Features
- **Multi-Platform Library Aggregator**: Consolidates active followed lists and "currently reading" progress from Webtoon, MangaDex, Shonen Jump, Manga Plus, and Tappytoon. Stores authenticated session credentials securely using AES-256 and syncs lists via background workers.
- **Spoiler-Free Community Comments**: Threaded discussion boards tied directly to chapter IDs/numbers. Hides and blurs comments associated with chapters that are higher than the user's current tracked progress.
- **Intelligent Manga Recommendation Engine**: Recommends titles based on specific tropes (e.g., "Active Protagonist"), art styles ("Rough Sketch-style"), and pacing ("Slow-burn Romance"), rather than broad genres, utilizing AI embeddings and vector similarity.
- **Physical & Digital Hybrid Ledger**: A collection manager mapping digital chapters read versus physical book volumes owned on a shelf. Includes a "Shopping List Generator" to compute and recommend purchases of missing physical volumes.
- **Scan-to-Track**: A camera feature allowing users to snap a photo of a physical manga cover or a screenshot of a digital reader. The backend uses OCR and AI image analysis to automatically detect the series and log progress.
- **Social "Read-Along" Rooms**: Synchronized reading rooms where friends sync progress. The room lock prevents members from tracking progress or viewing discussion notes ahead of the locked threshold or the slowest member. Includes real-time Socket.IO chat.

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

### 7.5 Phase 2 Feature Flows

#### 7.5.1 Multi-Platform Sync Flow
```
[User Dashboard] ➔ [Manage Integrations] ➔ [Click "Connect Webtoon"]
       ↓
[Input Login/Session Cookie] ➔ [Validate Credentials] ➔ [Queue Aggregator Sync]
       ↓
[Dashboard updates with combined "Currently Reading" feed]
```

#### 7.5.2 Spoiler-Free Comments Flow
```
[Manga Details Page] ➔ [Click "Chapter 50 Comments"]
       ↓
[System checks user's UserFollow lastReadChapter]
       ↓
      alt User lastReadChapter >= 50
          [Display comments normally]
      else User lastReadChapter < 50
          [Blur comments with overlay: "Locked - Catch up to Chapter 50 to unlock"]
      end
```

#### 7.5.3 Scan-to-Track Flow
```
[User Dashboard] ➔ [Click "Scan Cover"] ➔ [Camera Interface Overlay]
       ↓
[Capture Image] ➔ [Image Uploaded to Backend] ➔ [AI/OCR matches title & volume]
       ↓
[Modal displays match: "Vol. 5 of Chainsaw Man" - "Track Digitally" or "Add to Physical Bookshelf"]
```

#### 7.5.4 Social "Read-Along" Room Flow
```
[Social Hub] ➔ [Create Room] ➔ [Select Manga & Set Target Chapter: 15] ➔ [Generate Invite Code]
       ↓
[Friends Join Room] ➔ [Members chat and read up to Chapter 15]
       ↓
[Attempting to read Chapter 16 displays warning: "Locked - Wait for all members to catch up"]
       ↓
[All members hit Chapter 15] ➔ [Target unlocks and increments to Chapter 20]
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

### 8.4 Phase 2 System Workflows

#### 8.4.1 Multi-Platform Aggregation Flow (Cron-Scheduled)
```mermaid
sequenceDiagram
    participant Cron as Scheduler (BullMQ)
    participant Worker as Sync Worker
    participant DB as PostgreSQL Database
    participant Ext as External Site API/Web scraper
    
    Cron->>Worker: Trigger Platform Sync (Every 1 hour)
    Worker->>DB: Fetch user_platform_accounts with credentials
    DB-->>Worker: Accounts List (Webtoon, MangaPlus, etc.)
    loop For each platform account
        Worker->>Ext: Fetch user's "currently reading" list using credentials
        Ext-->>Worker: Return array of { manga_title, last_read_chapter }
        Worker->>DB: Match manga titles to local catalog
        Worker->>DB: Upsert UserFollow (userId, mangaId, lastReadChapter)
    end
```

#### 8.4.2 Scan-to-Track Image Reconciliation Flow
```mermaid
sequenceDiagram
    participant User as Frontend Client
    participant API as Express API Server
    participant Vision as AI/OCR Engine
    participant DB as PostgreSQL Database
    
    User->>API: POST /api/v1/track/scan (Multipart Image File)
    API->>Vision: Analyze image for title, volume & chapter numbers
    Vision-->>API: Returns identified text/metadata (e.g. "Chainsaw Man Volume 12")
    API->>DB: Search catalog for matched Manga & Volume
    alt Match found
        DB-->>API: Return Manga details & Volume Chapters
        API-->>User: HTTP 200 (Matched details & Action prompt)
    else Match not found
        API-->>User: HTTP 404 (Manual selection fallback)
    end
```

#### 8.4.3 Social Read-Along Room Progress Sync
```mermaid
sequenceDiagram
    participant User as Frontend Client
    participant Socket as Socket.IO Server
    participant DB as PostgreSQL Database
    
    User->>Socket: Emit room:progress_update { roomId, chapterNumber }
    Socket->>DB: Update read_along_room_members currentChapter
    Socket->>DB: Fetch all member progress for roomId
    DB-->>Socket: List of member progress
    Socket->>Socket: Evaluate slowest member progress & target lock
    Socket-->>User: Broadcast room:state_change { roomId, members, unlockedUntil }
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

### 10.3 Prisma Schema Extensions for Phase 2
```prisma
enum IntegrationPlatform {
  WEBTOON
  MANGADEX
  SHONEN_JUMP
  MANGA_PLUS
  TAPPYTOON
}

model UserPlatformAccount {
  id            Int                 @id @default(autoincrement())
  userId        Int                 @map("user_id")
  platform      IntegrationPlatform
  username      String?
  credentialRaw String?             @map("credential_raw") @db.Text // Encrypted session data
  syncStatus    String              @default("PENDING") @map("sync_status")
  lastSyncedAt  DateTime?           @map("last_synced_at")
  createdAt     DateTime            @default(now()) @map("created_at")
  updatedAt     DateTime            @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, platform])
  @@map("user_platform_accounts")
}

model Comment {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  chapterId Int      @map("chapter_id")
  content   String   @db.Text
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  chapter Chapter @relation(fields: [chapterId], references: [id], onDelete: Cascade)

  @@index([chapterId])
  @@map("comments")
}

model MangaMetadata {
  id        Int       @id @default(autoincrement())
  mangaId   Int       @unique @map("manga_id")
  tropes    String[]
  artStyle  String?   @map("art_style")
  pacing    String?
  embedding Unsupported("vector(1536)")? // pgvector embeddings support
  updatedAt DateTime  @updatedAt @map("updated_at")

  manga Manga @relation(fields: [mangaId], references: [id], onDelete: Cascade)

  @@map("manga_metadata")
}

model UserMangaLedger {
  id            Int      @id @default(autoincrement())
  userId        Int      @map("user_id")
  mangaId       Int      @map("manga_id")
  volumeNumber  Int      @map("volume_number")
  ownedPhysical Boolean  @default(false) @map("owned_physical")
  readDigitally Boolean  @default(false) @map("read_digitally")
  readPhysical  Boolean  @default(false) @map("read_physical")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  manga Manga @relation(fields: [mangaId], references: [id], onDelete: Cascade)

  @@unique([userId, mangaId, volumeNumber])
  @@map("user_manga_ledgers")
}

model ReadAlongRoom {
  id         Int                   @id @default(autoincrement())
  name       String
  code       String                @unique
  mangaId    Int                   @map("manga_id")
  maxChapter Float                 @default(1.0) @map("max_chapter")
  creatorId  Int                   @map("creator_id")
  createdAt  DateTime              @default(now()) @map("created_at")
  updatedAt  DateTime              @updatedAt @map("updated_at")

  manga        Manga                  @relation(fields: [mangaId], references: [id], onDelete: Cascade)
  creator      User                   @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  members      ReadAlongRoomMember[]
  chatMessages ReadAlongChatMessage[]

  @@map("read_along_rooms")
}

model ReadAlongRoomMember {
  id             Int      @id @default(autoincrement())
  roomId         Int      @map("room_id")
  userId         Int      @map("user_id")
  currentChapter Float    @default(0.0) @map("current_chapter")
  joinedAt       DateTime @default(now()) @map("joined_at")

  room ReadAlongRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  user User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([roomId, userId])
  @@map("read_along_room_members")
}

model ReadAlongChatMessage {
  id             Int      @id @default(autoincrement())
  roomId         Int      @map("room_id")
  userId         Int      @map("user_id")
  message        String   @db.Text
  chapterContext Float?   @map("chapter_context")
  createdAt      DateTime @default(now()) @map("created_at")

  room ReadAlongRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  user User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("read_along_chat_messages")
}
```

### 10.4 SQL DDL Extensions for Phase 2
```sql
CREATE TYPE "IntegrationPlatform" AS ENUM ('WEBTOON', 'MANGADEX', 'SHONEN_JUMP', 'MANGA_PLUS', 'TAPPYTOON');

CREATE TABLE "user_platform_accounts" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "platform" "IntegrationPlatform" NOT NULL,
    "username" VARCHAR(255),
    "credential_raw" TEXT,
    "sync_status" VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
    "last_synced_at" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX idx_user_platform ON "user_platform_accounts"("user_id", "platform");

CREATE TABLE "comments" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "chapter_id" INTEGER NOT NULL REFERENCES "chapters"("id") ON DELETE CASCADE,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_comments_chapter ON "comments"("chapter_id");

CREATE TABLE "manga_metadata" (
    "id" SERIAL PRIMARY KEY,
    "manga_id" INTEGER UNIQUE NOT NULL REFERENCES "manga"("id") ON DELETE CASCADE,
    "tropes" TEXT[] NOT NULL,
    "art_style" VARCHAR(255),
    "pacing" VARCHAR(255),
    "embedding" vector(1536), -- Requires pgvector extension
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user_manga_ledgers" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "manga_id" INTEGER NOT NULL REFERENCES "manga"("id") ON DELETE CASCADE,
    "volume_number" INTEGER NOT NULL,
    "owned_physical" BOOLEAN DEFAULT FALSE NOT NULL,
    "read_digitally" BOOLEAN DEFAULT FALSE NOT NULL,
    "read_physical" BOOLEAN DEFAULT FALSE NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX idx_user_manga_volume ON "user_manga_ledgers"("user_id", "manga_id", "volume_number");

CREATE TABLE "read_along_rooms" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) UNIQUE NOT NULL,
    "manga_id" INTEGER NOT NULL REFERENCES "manga"("id") ON DELETE CASCADE,
    "max_chapter" DOUBLE PRECISION DEFAULT 1.0 NOT NULL,
    "creator_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "read_along_room_members" (
    "id" SERIAL PRIMARY KEY,
    "room_id" INTEGER NOT NULL REFERENCES "read_along_rooms"("id") ON DELETE CASCADE,
    "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "current_chapter" DOUBLE PRECISION DEFAULT 0.0 NOT NULL,
    "joined_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX idx_room_member ON "read_along_room_members"("room_id", "user_id");

CREATE TABLE "read_along_chat_messages" (
    "id" SERIAL PRIMARY KEY,
    "room_id" INTEGER NOT NULL REFERENCES "read_along_rooms"("id") ON DELETE CASCADE,
    "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "message" TEXT NOT NULL,
    "chapter_context" DOUBLE PRECISION,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
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

### 11.5 Phase 2 API Endpoints

#### 11.5.1 Multi-Platform Library Aggregator
- **GET `/api/v1/integrations`**: Retrieve status of all user platform account connections.
- **POST `/api/v1/integrations/connect`**: Save and verify session credentials for an external platform.
  - **Payload**: `{ "platform": "WEBTOON", "credentialRaw": "cookie_string_or_oauth_token" }`
- **POST `/api/v1/integrations/sync`**: Manually trigger sync worker for a specific platform.

#### 11.5.2 Spoiler-Free Community Comments
- **GET `/api/v1/chapters/:chapterId/comments`**: Fetch comments for a specific chapter. Performs spoiler checks comparing target chapter index against user's progress. Returns blurs or hides comments if locked.
- **POST `/api/v1/chapters/:chapterId/comments`**: Post a comment to a chapter.
  - **Payload**: `{ "content": "Woah, what a plot twist!" }`

#### 11.5.3 Intelligent Manga Recommendation Engine
- **GET `/api/v1/recommendations/ai`**: Fetch personalized recommendations.
  - **Query Parameters**: `trope`, `artStyle`, `pacing` (options to filter by explicit trope/art embeddings)

#### 11.5.4 Physical & Digital Hybrid Ledger
- **GET `/api/v1/ledger`**: Fetch user bookshelf items and reading ledgers.
- **POST `/api/v1/ledger/volume`**: Set volume ownership or progress.
  - **Payload**: `{ "mangaId": 1, "volumeNumber": 5, "ownedPhysical": true, "readPhysical": false, "readDigitally": true }`
- **GET `/api/v1/ledger/shopping-list`**: Generate shopping list of missing volumes.

#### 11.5.5 Scan-to-Track
- **POST `/api/v1/track/scan`**: Receives an uploaded photo of a cover or screenshot, runs OCR/AI matching, and returns the suggested series/volume.
  - **Payload**: `multipart/form-data` with key `image`.

#### 11.5.6 Social "Read-Along" Rooms
- **POST `/api/v1/rooms`**: Create a new read-along room.
  - **Payload**: `{ "name": "Chainsaw Man Fan Club", "mangaId": 1, "targetChapter": 20 }`
- **POST `/api/v1/rooms/join`**: Join an existing room via code.
  - **Payload**: `{ "code": "X78Y90" }`
- **Socket.IO Event: `room:progress_update`**: Send current read progress to room.
- **Socket.IO Event: `room:chat`**: Send real-time chat message to the room.

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
|  Phase 5: Phase 2 Advanced Core Features (Weeks 17-20) |
|  * Multi-Platform Aggregator sync & credential vault   |
|  * Spoiler-Free comment restrictions on chapters      |
|  * Physical/Digital Shelf ledger & shopping list       |
|                                                        |
|  Phase 6: AI & Social Sync (Weeks 21-24)               |
|  * Scan-to-Track Vision AI cover OCR parsing           |
|  * Trope/Art/Pacing recommendation vectors (pgvector)  |
|  * Social Read-Along Socket.IO rooms & locks           |
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
