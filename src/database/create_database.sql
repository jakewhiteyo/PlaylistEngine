-- Drop tables in reverse order to handle dependencies
DROP TABLE IF EXISTS submission_status;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS playlist_song_history;
DROP TABLE IF EXISTS playlist_song;
DROP TABLE IF EXISTS playlist_history;
DROP TABLE IF EXISTS curator_playlist;
DROP TABLE IF EXISTS playlist;
DROP TABLE IF EXISTS curator_spotify_sync;
DROP TABLE IF EXISTS curator;
DROP TABLE IF EXISTS users;

-- Create the 'users' table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,                -- Unique ID for each user
    email VARCHAR(255) UNIQUE NOT NULL,        -- User's email address (must be unique)
    google_id VARCHAR(255) UNIQUE,             -- Google OAuth ID (unique to Google account)
    first_name VARCHAR(255),                   -- User's first name
    last_name VARCHAR(255),                    -- User's last name
    profile_picture_url TEXT,                  -- URL to user's Google profile picture
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the record is created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Timestamp when the record is updated
);

-- Index for faster lookups on Google ID
CREATE INDEX idx_google_id ON users(google_id);

-- Create the 'curator' table
CREATE TABLE curator (
    id SERIAL PRIMARY KEY,                         -- Primary key for the curator
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Foreign key referencing 'users'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Record update timestamp
);

-- Index for faster lookups on user_id in curator table
CREATE INDEX idx_curator_user_id ON curator(user_id);

-- Create the 'curator_spotify_sync' table
CREATE TABLE curator_spotify_sync (
    id SERIAL PRIMARY KEY,                         -- Primary key for the sync data
    curator_id INT NOT NULL REFERENCES curator(id) ON DELETE CASCADE,
    spotify_user_id VARCHAR(255) NOT NULL,         -- Spotify user ID
    refresh_token TEXT NOT NULL,                   -- Spotify OAuth refresh token
    access_token TEXT,                             -- Spotify OAuth access token
    last_sync_timestamp TIMESTAMP,                 -- Timestamp of the last sync
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Record update timestamp
);

-- Create the 'playlist' table
CREATE TABLE playlist (
    id SERIAL PRIMARY KEY,                         -- Primary key for the playlist
    curator_id INT NOT NULL REFERENCES curator(id) ON DELETE CASCADE, -- Foreign key referencing 'curator'
    name VARCHAR(255) NOT NULL,                    -- Playlist name
    num_followers INT DEFAULT 0,                   -- Number of followers for the playlist
    description TEXT,                              -- Internal description for the playlist
    is_deleted BOOLEAN DEFAULT FALSE,              -- Soft delete flag
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Record update timestamp
);

-- Index for faster lookups on curator_id in playlist table
CREATE INDEX idx_playlist_curator_id ON playlist(curator_id);

-- Create the 'curator_playlist' table
CREATE TABLE curator_playlist (
    id SERIAL PRIMARY KEY,                         -- Primary key for curator playlist relationship
    playlist_id INT NOT NULL REFERENCES playlist(id) ON DELETE CASCADE, -- Foreign key referencing 'playlist'
    curator_id INT NOT NULL REFERENCES curator(id) ON DELETE CASCADE, -- Foreign key referencing 'curator'
    accepts_submissions BOOLEAN DEFAULT TRUE,      -- Whether the curator accepts submissions
    num_songs_added INT DEFAULT 0,                 -- Number of songs added
    num_songs_rejected INT DEFAULT 0,              -- Number of songs rejected
    submission_price NUMERIC(10, 2) DEFAULT 0.00,  -- Price for submissions (if applicable)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- Record update timestamp
    CONSTRAINT check_positive_price CHECK (submission_price >= 0),
    CONSTRAINT check_positive_counts CHECK (num_songs_added >= 0 AND num_songs_rejected >= 0)
);

-- Create the 'playlist_history' table
CREATE TABLE playlist_history (
    id SERIAL PRIMARY KEY,                         -- Primary key for playlist history
    playlist_id INT NOT NULL REFERENCES playlist(id) ON DELETE CASCADE, -- Foreign key referencing 'playlist'
    followers INT NOT NULL,                        -- Number of followers
    date_followers_changed TIMESTAMP NOT NULL,     -- Date when followers count changed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Record creation timestamp
);

-- Create the 'playlist_song' table
CREATE TABLE playlist_song (
    id SERIAL PRIMARY KEY,                         -- Primary key for playlist song relationship
    playlist_id INT NOT NULL REFERENCES playlist(id) ON DELETE CASCADE, -- Foreign key referencing 'playlist'
    spotify_song_id VARCHAR(255) NOT NULL,         -- Spotify song ID
    date_added_to_playlist TIMESTAMP,              -- Date the song was added to the playlist
    date_removed_from_playlist TIMESTAMP,          -- Date the song was removed from the playlist
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Record update timestamp
);

-- Create the 'playlist_song_history' table
CREATE TABLE playlist_song_history (
    id SERIAL PRIMARY KEY,                         -- Primary key for song position history
    playlist_song_id INT NOT NULL REFERENCES playlist_song(id) ON DELETE CASCADE, -- Foreign key referencing 'playlist_song'
    position_number INT NOT NULL,                  -- Position number in the playlist
    date_started_position TIMESTAMP NOT NULL,      -- Date when the song started at this position
    date_left_position TIMESTAMP,                  -- Date when the song left this position
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Record creation timestamp
);

-- Create the 'submissions' table
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,                         -- Primary key for song submissions
    playlist_id INT NOT NULL REFERENCES playlist(id) ON DELETE CASCADE, -- Foreign key referencing 'playlist'
    submitting_user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Foreign key referencing 'users'
    spotify_song_id VARCHAR(255) NOT NULL,         -- Spotify song ID for the submission
    message TEXT,                                  -- Submission message
    is_deleted BOOLEAN DEFAULT FALSE,              -- Soft delete flag
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Record update timestamp
);

-- Create the 'submission_status' table
CREATE TABLE submission_status (
    id SERIAL PRIMARY KEY,                         -- Primary key for submission status
    submission_id INT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE, -- Foreign key referencing 'submissions'
    status VARCHAR(50) CHECK (status IN ('pending', 'accepted', 'rejected', 'added')) NOT NULL, -- Status of the submission
    review_date TIMESTAMP,                         -- Date the submission was reviewed
    curator_comments TEXT,                         -- Optional comments from the curator
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when status was updated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Record creation timestamp
);
