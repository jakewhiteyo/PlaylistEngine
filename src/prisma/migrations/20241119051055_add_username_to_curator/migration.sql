-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "google_id" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "profile_picture_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "curator" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curator_spotify_sync" (
    "id" SERIAL NOT NULL,
    "curator_id" INTEGER NOT NULL,
    "spotify_user_id" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "access_token" TEXT,
    "last_sync_timestamp" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curator_spotify_sync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist" (
    "id" SERIAL NOT NULL,
    "curator_id" INTEGER NOT NULL,
    "spotify_playlist_id" TEXT,
    "name" TEXT NOT NULL,
    "num_followers" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curator_playlist" (
    "id" SERIAL NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "curator_id" INTEGER NOT NULL,
    "accepts_submissions" BOOLEAN NOT NULL DEFAULT true,
    "num_songs_added" INTEGER NOT NULL DEFAULT 0,
    "num_songs_rejected" INTEGER NOT NULL DEFAULT 0,
    "submission_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curator_playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_history" (
    "id" SERIAL NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "followers" INTEGER NOT NULL,
    "date_followers_changed" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_song" (
    "id" SERIAL NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "spotify_song_id" TEXT NOT NULL,
    "date_added_to_playlist" TIMESTAMP(3),
    "date_removed_from_playlist" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_song_history" (
    "id" SERIAL NOT NULL,
    "playlist_song_id" INTEGER NOT NULL,
    "position_number" INTEGER NOT NULL,
    "date_started_position" TIMESTAMP(3) NOT NULL,
    "date_left_position" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_song_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" SERIAL NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "submitting_user_id" INTEGER NOT NULL,
    "spotify_song_id" TEXT NOT NULL,
    "message" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_status" (
    "id" SERIAL NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "review_date" TIMESTAMP(3),
    "curator_comments" TEXT,
    "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "curator_userName_key" ON "curator"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "curator_spotify_sync_curator_id_key" ON "curator_spotify_sync"("curator_id");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_spotify_playlist_id_key" ON "playlist"("spotify_playlist_id");

-- CreateIndex
CREATE UNIQUE INDEX "submission_status_submission_id_key" ON "submission_status"("submission_id");

-- AddForeignKey
ALTER TABLE "curator" ADD CONSTRAINT "curator_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curator_spotify_sync" ADD CONSTRAINT "curator_spotify_sync_curator_id_fkey" FOREIGN KEY ("curator_id") REFERENCES "curator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist" ADD CONSTRAINT "playlist_curator_id_fkey" FOREIGN KEY ("curator_id") REFERENCES "curator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curator_playlist" ADD CONSTRAINT "curator_playlist_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curator_playlist" ADD CONSTRAINT "curator_playlist_curator_id_fkey" FOREIGN KEY ("curator_id") REFERENCES "curator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_history" ADD CONSTRAINT "playlist_history_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_song" ADD CONSTRAINT "playlist_song_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_song_history" ADD CONSTRAINT "playlist_song_history_playlist_song_id_fkey" FOREIGN KEY ("playlist_song_id") REFERENCES "playlist_song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_submitting_user_id_fkey" FOREIGN KEY ("submitting_user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_status" ADD CONSTRAINT "submission_status_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
