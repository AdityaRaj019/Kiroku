-- CreateEnum
CREATE TYPE "MangaFormat" AS ENUM ('MANGA', 'MANHWA', 'MANHUA', 'COMIC', 'ONE_SHOT', 'DOUJINSHI');

-- AlterTable
ALTER TABLE "manga" ADD COLUMN     "chapter_count" INTEGER,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "episode_count" INTEGER,
ADD COLUMN     "format" "MangaFormat",
ADD COLUMN     "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "is_recommended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reading_sources" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "release_year" INTEGER,
ADD COLUMN     "source_material" TEXT,
ADD COLUMN     "streaming_sources" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "exp" INTEGER NOT NULL DEFAULT 0;
