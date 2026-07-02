-- Replace UserFollow with LibraryItem
-- This migration drops the simple user_follows table and replaces it
-- with a comprehensive library_items table supporting status tracking,
-- progress, ratings, favorites, notification toggles, and dates.
-- Also adds the missing source_id column to manga table.

-- AlterTable: Add missing source_id column to manga
ALTER TABLE "manga" ADD COLUMN "source_id" TEXT;

-- CreateIndex: unique constraint on manga source_id
CREATE UNIQUE INDEX "manga_source_id_key" ON "manga"("source_id");

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MANGA', 'ANIME');

-- CreateEnum
CREATE TYPE "LibraryStatus" AS ENUM ('READING', 'COMPLETED', 'PLAN_TO_READ', 'DROPPED', 'PAUSED');

-- DropForeignKey
ALTER TABLE "user_follows" DROP CONSTRAINT "user_follows_manga_id_fkey";

-- DropForeignKey
ALTER TABLE "user_follows" DROP CONSTRAINT "user_follows_user_id_fkey";

-- DropTable
DROP TABLE "user_follows";

-- CreateTable
CREATE TABLE "library_items" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "manga_id" INTEGER,
    "anime_id" TEXT,
    "media_type" "MediaType" NOT NULL DEFAULT 'MANGA',
    "status" "LibraryStatus" NOT NULL DEFAULT 'READING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "enable_notifications" BOOLEAN NOT NULL DEFAULT true,
    "rating" INTEGER,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "re_read_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "library_items_user_id_idx" ON "library_items"("user_id");

-- CreateIndex
CREATE INDEX "library_items_manga_id_idx" ON "library_items"("manga_id");

-- CreateIndex
CREATE INDEX "library_items_user_id_status_idx" ON "library_items"("user_id", "status");

-- CreateIndex
CREATE INDEX "library_items_user_id_media_type_idx" ON "library_items"("user_id", "media_type");

-- CreateIndex
CREATE UNIQUE INDEX "library_items_user_id_manga_id_key" ON "library_items"("user_id", "manga_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_items_user_id_anime_id_key" ON "library_items"("user_id", "anime_id");

-- AddForeignKey
ALTER TABLE "library_items" ADD CONSTRAINT "library_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_items" ADD CONSTRAINT "library_items_manga_id_fkey" FOREIGN KEY ("manga_id") REFERENCES "manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
