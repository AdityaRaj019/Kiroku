import "dotenv/config";
import { prisma } from "../utils/prisma";
import { getRankFromExp } from "../modules/user/user.controller";

async function runTest() {
  console.log("🚀 Running User Profile DB Queries Test...\n");

  // Query Alice (ID 1)
  const targetUserId = 1;
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      bio: true,
      exp: true,
      createdAt: true,
    },
  });

  if (!user) {
    console.error("❌ User not found!");
    return;
  }

  console.log("👤 User details retrieved:");
  console.log(`- ID: ${user.id}`);
  console.log(`- Name: ${user.name}`);
  console.log(`- Email: ${user.email}`);
  console.log(`- Bio: ${user.bio}`);
  console.log(`- EXP: ${user.exp}`);
  console.log(`- Rank: ${getRankFromExp(user.exp)}`);
  console.log(`- Avatar: ${user.avatarUrl}`);

  // Query user stats from their library items
  const libraryItems = await prisma.libraryItem.findMany({
    where: { userId: targetUserId },
    select: {
      status: true,
      progress: true,
      rating: true,
    },
  });

  const totalBooks = libraryItems.length;
  const completedCount = libraryItems.filter((item) => item.status === "COMPLETED").length;
  const readingCount = libraryItems.filter((item) => item.status === "READING").length;
  
  let chaptersRead = 0;
  let totalRatingSum = 0;
  let ratedItemsCount = 0;

  for (const item of libraryItems) {
    chaptersRead += item.progress;
    if (item.rating !== null && item.rating !== undefined) {
      totalRatingSum += item.rating;
      ratedItemsCount++;
    }
  }

  const averageScore = ratedItemsCount > 0 ? parseFloat((totalRatingSum / ratedItemsCount).toFixed(1)) : 0;

  console.log("\n📊 Stats calculated:");
  console.log(`- Total Books: ${totalBooks}`);
  console.log(`- Completed: ${completedCount}`);
  console.log(`- Reading: ${readingCount}`);
  console.log(`- Chapters Read: ${chaptersRead}`);
  console.log(`- Average Score: ${averageScore}`);

  // Test updating Alice's profile
  console.log("\n✍️ Testing Profile Update...");
  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      name: "Alice Nakamura (Manga Pro)",
      bio: "Avid shonen reader and anime enthusiast. Current favorite: One Piece!",
    },
    select: {
      name: true,
      bio: true,
    }
  });

  console.log("✅ Profile Updated successfully:");
  console.log(`- New Name: ${updatedUser.name}`);
  console.log(`- New Bio: ${updatedUser.bio}`);

  // Revert updates to preserve seed integrity
  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      name: "Alice Nakamura",
      bio: "Avid shonen reader and anime enthusiast. Looking for my next 10/10 manga!",
    }
  });
  console.log("\n🔄 Seed data restored. Test finished successfully!");
}

runTest()
  .catch((err) => console.error("❌ Test failed:", err))
  .finally(() => prisma.$disconnect());
