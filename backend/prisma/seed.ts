/**
 * Prisma Database Seed Script
 *
 * Creates realistic development data for local testing:
 * - 3 test users with hashed passwords
 * - 5 manga series with MangaDex-style slugs
 * - 5-10 chapters per manga with sequential numbering
 * - Follow relations between users and manga
 * - Unread notifications for testing the notification feed
 *
 * Idempotent: uses upsert() so it can be re-run safely without
 * duplicate key conflicts.
 *
 * Usage: npx prisma db seed
 */

import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashSync } from "bcryptjs";

// ─── Prisma Client (standalone for seed context) ────────────

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set in the environment.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ─── Seed Data Definitions ──────────────────────────────────

const TEST_PASSWORD = "Test@1234";
const HASHED_PASSWORD = hashSync(TEST_PASSWORD, 10);

const usersData = [
  { email: "alice@mangapulse.dev", name: "Alice Nakamura", passwordHash: HASHED_PASSWORD },
  { email: "bob@mangapulse.dev", name: "Bob Tanaka", passwordHash: HASHED_PASSWORD },
  { email: "carol@mangapulse.dev", name: "Carol Suzuki", passwordHash: HASHED_PASSWORD },
];

const mangaData = [
  {
    title: "One Piece",
    slug: "one-piece-a1c7fceb",
    coverUrl: "https://uploads.mangadex.org/covers/a1c7fceb-f80e-4e3b-8e1f-ae6c1d3e6c7f/cover.jpg",
    synopsis: "Monkey D. Luffy sets off on an adventure to find the legendary One Piece treasure and become King of the Pirates.",
    author: "Eiichiro Oda",
    status: "ONGOING" as const,
    sourceUrl: "https://mangadex.org/title/a1c7fceb-f80e-4e3b-8e1f-ae6c1d3e6c7f",
  },
  {
    title: "Jujutsu Kaisen",
    slug: "jujutsu-kaisen-c52b2ce3",
    coverUrl: "https://uploads.mangadex.org/covers/c52b2ce3-7f95-469c-96b0-479524fb7a1a/cover.jpg",
    synopsis: "Yuji Itadori joins a secret organization of Jujutsu Sorcerers to fight curses after swallowing a powerful cursed object.",
    author: "Gege Akutami",
    status: "COMPLETED" as const,
    sourceUrl: "https://mangadex.org/title/c52b2ce3-7f95-469c-96b0-479524fb7a1a",
  },
  {
    title: "Chainsaw Man",
    slug: "chainsaw-man-a77742b1",
    coverUrl: "https://uploads.mangadex.org/covers/a77742b1-befd-49a4-bff5-1f4e6bbf1c34/cover.jpg",
    synopsis: "Denji merges with his pet devil-dog Pochita to become Chainsaw Man, a devil-human hybrid fighting for the Public Safety Bureau.",
    author: "Tatsuki Fujimoto",
    status: "ONGOING" as const,
    sourceUrl: "https://mangadex.org/title/a77742b1-befd-49a4-bff5-1f4e6bbf1c34",
  },
  {
    title: "Spy x Family",
    slug: "spy-x-family-6e3553b9",
    coverUrl: "https://uploads.mangadex.org/covers/6e3553b9-ddb5-4d37-b7a3-99998044774e/cover.jpg",
    synopsis: "A spy must build a fake family to execute a mission, not realizing that the girl he adopts is a telepath and his wife is an assassin.",
    author: "Tatsuya Endo",
    status: "ONGOING" as const,
    sourceUrl: "https://mangadex.org/title/6e3553b9-ddb5-4d37-b7a3-99998044774e",
  },
  {
    title: "Dandadan",
    slug: "dandadan-7f30dfc3",
    coverUrl: "https://uploads.mangadex.org/covers/7f30dfc3-de40-46c3-8302-18907390aa80/cover.jpg",
    synopsis: "Two high schoolers—one who believes in aliens and the other in ghosts—team up to prove each other wrong, only to discover both are real.",
    author: "Yukinobu Tatsu",
    status: "ONGOING" as const,
    sourceUrl: "https://mangadex.org/title/7f30dfc3-de40-46c3-8302-18907390aa80",
  },
];

/**
 * Generates a set of chapter entries for a manga.
 * Each manga gets between 5 and 10 chapters with staggered release dates.
 */
function generateChapters(mangaId: number, count: number) {
  const chapters = [];
  const baseDate = new Date("2025-01-01T00:00:00Z");

  for (let i = 1; i <= count; i++) {
    const releasedAt = new Date(baseDate.getTime() + i * 7 * 24 * 60 * 60 * 1000); // weekly releases
    chapters.push({
      number: i,
      title: `Chapter ${i}`,
      sourceUrl: `https://mangadex.org/chapter/fake-${mangaId}-ch-${i}`,
      mangaId,
      releasedAt,
    });
  }

  return chapters;
}

/** Chapter counts per manga (index-matched to mangaData) */
const chapterCounts = [10, 8, 7, 6, 5];

/** Follow mapping: which user indices follow which manga indices */
const followMap: Array<{ userIdx: number; mangaIdx: number }> = [
  { userIdx: 0, mangaIdx: 0 }, // Alice follows One Piece
  { userIdx: 0, mangaIdx: 1 }, // Alice follows Jujutsu Kaisen
  { userIdx: 0, mangaIdx: 4 }, // Alice follows Dandadan
  { userIdx: 1, mangaIdx: 0 }, // Bob follows One Piece
  { userIdx: 1, mangaIdx: 2 }, // Bob follows Chainsaw Man
  { userIdx: 1, mangaIdx: 3 }, // Bob follows Spy x Family
  { userIdx: 2, mangaIdx: 1 }, // Carol follows Jujutsu Kaisen
  { userIdx: 2, mangaIdx: 3 }, // Carol follows Spy x Family
  { userIdx: 2, mangaIdx: 4 }, // Carol follows Dandadan
];

// ─── Main Seed Function ─────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── 1. Users ───────────────────────────────────────────────
  console.log("👤 Upserting users...");
  const users = [];
  for (const data of usersData) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: { name: data.name, passwordHash: data.passwordHash },
      create: data,
    });
    users.push(user);
    console.log(`   ✓ ${user.email} (id: ${user.id})`);
  }

  // ── 2. Manga ───────────────────────────────────────────────
  console.log("\n📚 Upserting manga...");
  const mangaRecords = [];
  for (const data of mangaData) {
    const manga = await prisma.manga.upsert({
      where: { slug: data.slug },
      update: {
        title: data.title,
        coverUrl: data.coverUrl,
        synopsis: data.synopsis,
        author: data.author,
        status: data.status,
        sourceUrl: data.sourceUrl,
      },
      create: data,
    });
    mangaRecords.push(manga);
    console.log(`   ✓ ${manga.title} (id: ${manga.id})`);
  }

  // ── 3. Chapters ────────────────────────────────────────────
  console.log("\n📖 Upserting chapters...");
  for (let i = 0; i < mangaRecords.length; i++) {
    const manga = mangaRecords[i];
    const count = chapterCounts[i];
    const chapters = generateChapters(manga.id, count);

    for (const ch of chapters) {
      await prisma.chapter.upsert({
        where: {
          mangaId_number: { mangaId: ch.mangaId, number: ch.number },
        },
        update: {
          title: ch.title,
          sourceUrl: ch.sourceUrl,
          releasedAt: ch.releasedAt,
        },
        create: ch,
      });
    }
    console.log(`   ✓ ${manga.title}: ${count} chapters`);
  }

  // ── 4. Follows ─────────────────────────────────────────────
  console.log("\n🔔 Upserting follow relations...");
  for (const { userIdx, mangaIdx } of followMap) {
    const userId = users[userIdx].id;
    const mangaId = mangaRecords[mangaIdx].id;

    await prisma.userFollow.upsert({
      where: {
        userId_mangaId: { userId, mangaId },
      },
      update: {},
      create: { userId, mangaId },
    });
    console.log(`   ✓ ${users[userIdx].name} → ${mangaRecords[mangaIdx].title}`);
  }

  // ── 5. Notifications ──────────────────────────────────────
  console.log("\n🔔 Creating sample notifications...");

  const notificationData = [
    {
      userId: users[0].id,
      type: "NEW_CHAPTER" as const,
      title: "One Piece Chapter 10 Released!",
      body: "A new chapter of One Piece has been released. Read it now!",
      read: false,
    },
    {
      userId: users[0].id,
      type: "NEW_CHAPTER" as const,
      title: "Jujutsu Kaisen Chapter 8 Released!",
      body: "A new chapter of Jujutsu Kaisen has been released. Read it now!",
      read: true,
    },
    {
      userId: users[1].id,
      type: "NEW_CHAPTER" as const,
      title: "Chainsaw Man Chapter 7 Released!",
      body: "A new chapter of Chainsaw Man has been released. Read it now!",
      read: false,
    },
    {
      userId: users[1].id,
      type: "STATUS_CHANGE" as const,
      title: "Jujutsu Kaisen Status Changed",
      body: "Jujutsu Kaisen has been marked as COMPLETED.",
      read: false,
    },
    {
      userId: users[2].id,
      type: "NEW_CHAPTER" as const,
      title: "Dandadan Chapter 5 Released!",
      body: "A new chapter of Dandadan has been released. Read it now!",
      read: false,
    },
    {
      userId: users[2].id,
      type: "SYSTEM" as const,
      title: "Welcome to MangaPulse!",
      body: "Thanks for joining MangaPulse. Start following your favorite manga to get notified about new chapters.",
      read: false,
    },
  ];

  // For notifications, we use createMany to bulk-insert (no upsert needed since
  // they don't have natural unique keys — we delete existing seed notifications first).
  // To keep it idempotent, we check if notifications already exist for seed users.
  for (const notif of notificationData) {
    // Check if a notification with the same title already exists for this user
    const existing = await prisma.notification.findFirst({
      where: { userId: notif.userId, title: notif.title },
    });

    if (!existing) {
      await prisma.notification.create({ data: notif });
      console.log(`   ✓ [${notif.type}] ${notif.title}`);
    } else {
      console.log(`   ⊘ [${notif.type}] ${notif.title} (already exists)`);
    }
  }

  // ── Summary ────────────────────────────────────────────────
  const totalUsers = await prisma.user.count();
  const totalManga = await prisma.manga.count();
  const totalChapters = await prisma.chapter.count();
  const totalFollows = await prisma.userFollow.count();
  const totalNotifs = await prisma.notification.count();

  console.log("\n─── Seed Summary ─────────────────────────────");
  console.log(`   Users:         ${totalUsers}`);
  console.log(`   Manga:         ${totalManga}`);
  console.log(`   Chapters:      ${totalChapters}`);
  console.log(`   Follows:       ${totalFollows}`);
  console.log(`   Notifications: ${totalNotifs}`);
  console.log("──────────────────────────────────────────────\n");
  console.log("✅ Seeding complete!");
  console.log(`\n   Test credentials: any seed user email + password "${TEST_PASSWORD}"\n`);
}

main()
  .catch((error: unknown) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
