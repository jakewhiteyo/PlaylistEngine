/*
  Warnings:

  - You are about to drop the `submissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "submission_status" DROP CONSTRAINT "submission_status_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_playlist_id_fkey";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_submitting_user_id_fkey";

-- DropTable
DROP TABLE "submissions";

-- CreateTable
CREATE TABLE "submission" (
    "id" SERIAL NOT NULL,
    "curator_id" INTEGER NOT NULL,
    "submitting_user_id" INTEGER NOT NULL,
    "spotify_song_id" TEXT NOT NULL,
    "message" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_playlist" (
    "id" SERIAL NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_playlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "submission_playlist_submission_id_playlist_id_key" ON "submission_playlist"("submission_id", "playlist_id");

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_curator_id_fkey" FOREIGN KEY ("curator_id") REFERENCES "curator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_submitting_user_id_fkey" FOREIGN KEY ("submitting_user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_playlist" ADD CONSTRAINT "submission_playlist_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_playlist" ADD CONSTRAINT "submission_playlist_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_status" ADD CONSTRAINT "submission_status_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
