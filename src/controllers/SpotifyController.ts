import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';

dotenv.config();

interface TokenResponse {
    access_token: string;
    [key: string]: any;
}

interface ErrorResponse {
    error: string;
    details?: any;
}

export class SpotifyAPI {
    private client_id: string;
    private client_secret: string;
    private refresh_token: string;
    private user_id: string;
    private access_token: string;

    constructor(
        client_id: string,
        client_secret: string,
        refresh_token: string,
        user_id: string
    ) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.refresh_token = refresh_token;
        this.user_id = user_id;
        this.access_token = '';
    }

    async refreshAccessToken(): Promise<TokenResponse | ErrorResponse> {
        try {
            const url = "https://accounts.spotify.com/api/token";
            const auth = Buffer.from(`${this.client_id}:${this.client_secret}`).toString('base64');
            
            const response = await axios.post(url, 
                qs.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: this.refresh_token
                }), {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

            this.access_token = response.data.access_token;
            return response.data;
        } catch (error: any) {
            return { error: 'Failed to refresh token', details: error.response?.data };
        }
    }

    async getArtists(query: string, limit: number = 10) {
        if (!this.access_token) {
            return { error: 'Access token undefined' };
        }

        try {
            const response = await axios.get('https://api.spotify.com/v1/search', {
                headers: { 'Authorization': `Bearer ${this.access_token}` },
                params: {
                    q: encodeURIComponent(query),
                    type: 'artist',
                    limit
                }
            });
            return response.data;
        } catch (error: any) {
            return { error: error.response?.data };
        }
    }

    async getPlaylists(query: string, limit: number = 3) {
        if (!this.access_token) {
            return { error: 'Access token undefined' };
        }

        try {
            const response = await axios.get('https://api.spotify.com/v1/search', {
                headers: { 'Authorization': `Bearer ${this.access_token}` },
                params: { q: query, type: 'playlist', limit }
            });
            return response.data;
        } catch (error: any) {
            return { error: error.response?.data };
        }
    }

    async getArtistId(artist_name: string): Promise<string> {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: { 'Authorization': `Bearer ${this.access_token}` },
            params: { q: artist_name, type: 'artist', limit: 1 }
        });
        return response.data.artists.items[0].id;
    }

    async getArtistSongs(artist_id: string): Promise<string[]> {
        const headers = { 'Authorization': `Bearer ${this.access_token}` };
        const albums = await axios.get(`https://api.spotify.com/v1/artists/${artist_id}/albums`, {
            headers,
            params: { include_groups: 'album,single', limit: 50 }
        });

        const tracks: string[] = [];
        
        for (const album of albums.data.items) {
            const tracksResponse = await axios.get(
                `https://api.spotify.com/v1/albums/${album.id}/tracks`,
                { headers }
            );
            tracks.push(...tracksResponse.data.items.map((track: any) => track.name));
        }

        return tracks;
    }

    async getSong(query: string, limit: number = 1) {
        if (!this.access_token) {
            return { error: 'Access token undefined' };
        }

        try {
            const response = await axios.get('https://api.spotify.com/v1/search', {
                headers: { 'Authorization': `Bearer ${this.access_token}` },
                params: { q: query, type: 'track', limit }
            });
            return response.data;
        } catch (error: any) {
            return { error: error.response?.data };
        }
    }

    async getPlaylistTracks(playlist_id: string, limit: number = 50, offset: number = 0) {
        try {
            const response = await axios.get(
                `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
                {
                    headers: { 'Authorization': `Bearer ${this.access_token}` },
                    params: { limit, offset }
                }
            );
            return response.data;
        } catch (error: any) {
            return { error: error.response?.data };
        }
    }

    async createPlaylist(playlist_name: string, playlist_description: string) {
        console.log(`creating playlist ${playlist_name}`);
        try {
            const response = await axios.post(
                `https://api.spotify.com/v1/users/${this.user_id}/playlists`,
                {
                    name: playlist_name,
                    description: playlist_description,
                    public: true
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.access_token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            return { error: error.response?.data };
        }
    }

    async addPlaylistTracks(playlist_id: string, uris: string[]) {
        try {
            const response = await axios.post(
                `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
                { uris },
                {
                    headers: {
                        'Authorization': `Bearer ${this.access_token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            return { error: error.response?.data };
        }
    }
}
