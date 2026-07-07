import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma";
import { parseUserId } from "../../utils/auth.helpers";
import { AppError } from "../../middlewares/error.middleware";
import "../../middlewares/auth.middleware";
import type { UpdateProfileInput } from "./user.schema";

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Calculates user rank based on experience points (EXP)
 */
export function getRankFromExp(exp: number): string {
  if (exp >= 1500) return "S-Rank Otaku";
  if (exp >= 1000) return "A-Rank Reader";
  if (exp >= 500) return "B-Rank Fan";
  if (exp >= 200) return "C-Rank Novice";
  return "D-Rank Beginner";
}

/**
 * Returns mock comments for a user based on their ID/Name to enrich profile pages.
 */
function getMockComments(userId: number, userName: string | null) {
  const name = userName || "User";
  return [
    {
      id: 1,
      mangaTitle: "One Piece",
      chapterNumber: "1080",
      body: `This chapter was absolute peak fiction! Luffy's gear shifts are getting legendary.`,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString(), // 2 days ago
    },
    {
      id: 2,
      mangaTitle: "Jujutsu Kaisen",
      chapterNumber: "236",
      body: `I'm still shocked by the ending. Gege's writing keeps me on edge every single week.`,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 5).toISOString(), // 5 days ago
    },
  ];
}

// ─── Controllers ─────────────────────────────────────────────

/**
 * GET /api/v1/users/:id
 *
 * Protected endpoint — retrieves user profile by ID.
 * Returns public user attributes if querying a different user,
 * and includes full info (like email) if querying self.
 */
export async function getUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const targetUserId = parseInt(req.params.id, 10);
    if (isNaN(targetUserId)) {
      throw new AppError(400, "Invalid user ID parameter");
    }

    if (!req.user?.sub) {
      throw new AppError(401, "Authentication required");
    }
    const currentUserId = parseUserId(req.user.sub);
    const isSelf = currentUserId === targetUserId;

    // Fetch user details
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
      throw new AppError(404, "User not found");
    }

    // Fetch user stats from their library items
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

    const rank = getRankFromExp(user.exp);

    res.status(200).json({
      user: {
        id: user.id,
        email: isSelf ? user.email : undefined, // privacy safeguard
        name: user.name,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        exp: user.exp,
        rank,
        createdAt: user.createdAt,
        stats: {
          totalBooks,
          completedCount,
          readingCount,
          chaptersRead,
          averageScore,
        },
        recentComments: getMockComments(user.id, user.name),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/users/profile
 *
 * Protected endpoint — updates name, avatarUrl, and bio for the currently logged-in user.
 */
export async function updateUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?.sub) {
      throw new AppError(401, "Authentication required");
    }
    const currentUserId = parseUserId(req.user.sub);
    const body = req.body as UpdateProfileInput;

    const dataToUpdate: any = {};
    if (body.name !== undefined) dataToUpdate.name = body.name;
    if (body.avatarUrl !== undefined) dataToUpdate.avatarUrl = body.avatarUrl;
    if (body.bio !== undefined) dataToUpdate.bio = body.bio;

    if (Object.keys(dataToUpdate).length === 0) {
      throw new AppError(400, "Provide at least one field to update (name, avatarUrl, or bio)");
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUserId },
      data: dataToUpdate,
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

    const rank = getRankFromExp(updatedUser.exp);

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatarUrl: updatedUser.avatarUrl,
        bio: updatedUser.bio,
        exp: updatedUser.exp,
        rank,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}
