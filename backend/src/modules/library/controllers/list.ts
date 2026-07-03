import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../utils/prisma";
import { parseUserId } from "../../../utils/auth.helpers";
import { AppError } from "../../../middlewares/error.middleware";
import type { LibraryQueryInput } from "../library.schema";

// ─── Controllers ─────────────────────────────────────────────

/**
 * GET /api/v1/library
 *
 * Retrieves the library items for the authenticated user (private view).
 * Includes sensitive settings like notification preferences.
 */
export async function getUserLibrary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = parseUserId(req.user?.sub);
    const query = req.query as unknown as LibraryQueryInput;

    const { page, limit, status, mediaType, favorite, sort, order, genres, format, country, year } = query;

    // Build the dynamic where clause
    const where: any = {
      userId,
    };

    if (status) {
      where.status = status;
    }
    if (mediaType) {
      where.mediaType = mediaType;
    }
    if (favorite !== undefined) {
      where.favorite = favorite;
    }

    // Manga-level relation filters (Task 03)
    const mangaFilter: any = {};
    if (genres && genres.length > 0) mangaFilter.genres = { hasEvery: genres };
    if (format) mangaFilter.format = format;
    if (country) mangaFilter.country = { equals: country, mode: "insensitive" };
    if (year !== undefined) mangaFilter.releaseYear = year;
    if (Object.keys(mangaFilter).length > 0) {
      where.manga = mangaFilter;
    }

    // Build the dynamic order clause
    let orderBy: any = {};
    if (sort === "title") {
      orderBy = { manga: { title: order } };
    } else if (sort === "rating") {
      orderBy = { rating: order };
    } else if (sort === "created") {
      orderBy = { createdAt: order };
    } else {
      // Default to "updated" (updatedAt)
      orderBy = { updatedAt: order };
    }

    // Run parallel queries to optimize response times
    const [items, total] = await Promise.all([
      prisma.libraryItem.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          userId: true,
          mangaId: true,
          animeId: true,
          mediaType: true,
          status: true,
          progress: true,
          favorite: true,
          enableNotifications: true,
          rating: true,
          startDate: true,
          endDate: true,
          reReadCount: true,
          createdAt: true,
          updatedAt: true,
          manga: {
            select: {
              sourceId: true,
              title: true,
              coverUrl: true,
              status: true,
            },
          },
        },
      }),
      prisma.libraryItem.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/library/users/:userId
 *
 * Retrieves the library items for a specific user (public view).
 * Excludes sensitive fields like notification preferences.
 */
export async function getPublicUserLibrary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const targetUserId = parseInt(req.params.userId, 10);
    const query = req.query as unknown as LibraryQueryInput;

    const { page, limit, status, mediaType, favorite, sort, order, genres, format, country, year } = query;

    // Check if the target user actually exists first
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new AppError(404, "User not found");
    }

    // Build the dynamic where clause for the target user
    const where: any = {
      userId: targetUserId,
    };

    if (status) {
      where.status = status;
    }
    if (mediaType) {
      where.mediaType = mediaType;
    }
    if (favorite !== undefined) {
      where.favorite = favorite;
    }

    // Manga-level relation filters (Task 03)
    const mangaFilter: any = {};
    if (genres && genres.length > 0) mangaFilter.genres = { hasEvery: genres };
    if (format) mangaFilter.format = format;
    if (country) mangaFilter.country = { equals: country, mode: "insensitive" };
    if (year !== undefined) mangaFilter.releaseYear = year;
    if (Object.keys(mangaFilter).length > 0) {
      where.manga = mangaFilter;
    }

    // Build the dynamic order clause
    let orderBy: any = {};
    if (sort === "title") {
      orderBy = { manga: { title: order } };
    } else if (sort === "rating") {
      orderBy = { rating: order };
    } else if (sort === "created") {
      orderBy = { createdAt: order };
    } else {
      orderBy = { updatedAt: order };
    }

    const [items, total] = await Promise.all([
      prisma.libraryItem.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          userId: true,
          mangaId: true,
          animeId: true,
          mediaType: true,
          status: true,
          progress: true,
          favorite: true,
          // Exclude enableNotifications for public privacy
          rating: true,
          startDate: true,
          endDate: true,
          reReadCount: true,
          createdAt: true,
          updatedAt: true,
          manga: {
            select: {
              sourceId: true,
              title: true,
              coverUrl: true,
              status: true,
            },
          },
        },
      }),
      prisma.libraryItem.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
}
