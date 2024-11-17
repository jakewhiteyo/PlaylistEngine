export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface ErrorResponse {
  error: string;
  details?: any;
}

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  uri: string;
}

export interface ArtistResponse {
  artists: {
    items: Artist[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface Track {
  id: string;
  name: string;
  uri: string;
  artists: Artist[];
  album: {
    id: string;
    name: string;
  };
}

export interface TrackResponse {
  tracks: {
    items: Track[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  uri: string;
  tracks: {
    total: number;
  };
}

export interface PlaylistResponse {
  playlists: {
    items: Playlist[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface PlaylistTrackResponse {
  items: {
    track: Track;
    added_at: string;
  }[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreatePlaylistResponse {
  id: string;
  name: string;
  description: string;
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface AddTracksResponse {
  snapshot_id: string;
}
