import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../utils/prisma";
import { parseUserId } from "../../../utils/auth.helpers";
import { AppError } from "../../../middlewares/error.middleware";

// ─── Controllers ─────────────────────────────────────────────

/**
 * DELETE /api/v1/library/:itemId
 *
 * Deletes a library item from the authenticated user's library.
 * The :itemId param is the integer primary key of the LibraryItem.
 */
export async function removeLibraryItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = parseUserId(req.user?.sub);
    const itemId = parseInt(req.params.itemId, 10);

    if (isNaN(itemId)) {
      throw new AppError(400, "Invalid library item ID");
    }

    // Lookup the item to check ownership
    const item = await prisma.libraryItem.findUnique({
      where: { id: itemId },
      select: { userId: true },
    });

    if (!item) {
      throw new AppError(404, "Library item not found");
    }

    // Ensure users can only delete their own library items
    if (item.userId !== userId) {
      throw new AppError(403, "You do not have permission to delete this item");
    }

    // Delete the library item
    await prisma.libraryItem.delete({
      where: { id: itemId },
    });

    res.status(200).json({ message: "Item removed from library successfully" });
  } catch (err) {
    next(err);
  }
}
