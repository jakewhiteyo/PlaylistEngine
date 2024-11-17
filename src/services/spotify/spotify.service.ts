import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";
import {
  TokenResponse,
  ErrorResponse,
  ArtistResponse,
  PlaylistResponse,
  TrackResponse,
  PlaylistTrackResponse,
  CreatePlaylistResponse,
  AddTracksResponse,
} from "./spotify.types";

dotenv.config();

export class SpotifyService {
  private static instance: SpotifyService;
  private client_id: string;
  private client_secret: string;
  private refresh_token: string;
  private user_id: string;
  private access_token: string;

  private constructor() {
    this.client_id = process.env.SPOTIFY_CLIENT_ID || "";
    this.client_secret = process.env.SPOTIFY_CLIENT_SECRET || "";
    this.refresh_token = process.env.SPOTIFY_REFRESH_TOKEN || "";
    this.user_id = process.env.SPOTIFY_USER_ID || "";
    this.access_token = "";
  }

  public static getInstance(): SpotifyService {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService();
    }
    return SpotifyService.instance;
  }

  public async initialize(): Promise<void> {
    await this.refreshAccessToken();
  }

  private async refreshAccessToken(): Promise<TokenResponse | ErrorResponse> {
    try {
      const url = "https://accounts.spotify.com/api/token";
      const auth = Buffer.from(
        `${this.client_id}:${this.client_secret}`
      ).toString("base64");

      const response = await axios.post<TokenResponse>(
        url,
        qs.stringify({
          grant_type: "refresh_token",
          refresh_token: this.refresh_token,
        }),
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      this.access_token = response.data.access_token;
      return response.data;
    } catch (error: any) {
      return {
        error: "Failed to refresh token",
        details: error.response?.data,
      };
    }
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.access_token) {
      await this.refreshAccessToken();
    }
  }

  public async searchArtists(
    query: string,
    limit: number = 10
  ): Promise<ArtistResponse | ErrorResponse> {
    await this.ensureValidToken();
    try {
      const response = await axios.get<ArtistResponse>(
        "https://api.spotify.com/v1/search",
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
          params: {
            q: encodeURIComponent(query),
            type: "artist",
            limit,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return { error: error.response?.data };
    }
  }

  public async searchPlaylists(
    query: string,
    limit: number = 3
  ): Promise<PlaylistResponse | ErrorResponse> {
    await this.ensureValidToken();
    try {
      const response = await axios.get<PlaylistResponse>(
        "https://api.spotify.com/v1/search",
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
          params: { q: query, type: "playlist", limit },
        }
      );
      return response.data;
    } catch (error: any) {
      return { error: error.response?.data };
    }
  }

  public async searchTracks(
    query: string,
    limit: number = 1
  ): Promise<TrackResponse | ErrorResponse> {
    await this.ensureValidToken();
    try {
      const response = await axios.get<TrackResponse>(
        "https://api.spotify.com/v1/search",
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
          params: { q: query, type: "track", limit },
        }
      );
      return response.data;
    } catch (error: any) {
      return { error: error.response?.data };
    }
  }

  public async getPlaylistTracks(
    playlistId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<PlaylistTrackResponse | ErrorResponse> {
    await this.ensureValidToken();
    try {
      const response = await axios.get<PlaylistTrackResponse>(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
          params: { limit, offset },
        }
      );
      return response.data;
    } catch (error: any) {
      return { error: error.response?.data };
    }
  }

  public async createPlaylist(
    name: string,
    description: string
  ): Promise<CreatePlaylistResponse | ErrorResponse> {
    await this.ensureValidToken();
    try {
      const response = await axios.post<CreatePlaylistResponse>(
        `https://api.spotify.com/v1/users/${this.user_id}/playlists`,
        {
          name,
          description,
          public: true,
        },
        {
          headers: {
            Authorization: `Bearer ${this.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return { error: error.response?.data };
    }
  }

  public async addTracksToPlaylist(
    playlistId: string,
    trackUris: string[]
  ): Promise<AddTracksResponse | ErrorResponse> {
    await this.ensureValidToken();
    try {
      const response = await axios.post<AddTracksResponse>(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: trackUris },
        {
          headers: {
            Authorization: `Bearer ${this.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return { error: error.response?.data };
    }
  }
}

export default SpotifyService.getInstance();
