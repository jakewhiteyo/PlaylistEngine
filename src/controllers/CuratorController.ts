import prisma from "../lib/prisma";
import { Request, Response } from "express";

export class CuratorController {
  async createUpdateCurator(req: Request, res: Response) {
    try {
      const {
        curatorId,
        userId,
        spotifyUserId,
        refreshToken,
        accessToken,
        userName,
      } = req.body;
      console.log(`Creating/updating curator ${userId}`);

      const curator = await prisma.curator.upsert({
        where: {
          id: Number(curatorId) ?? 0,
        },
        update: {
          userId: Number(userId),
          userName: userName,
          updatedAt: new Date(),
        },
        create: {
          userName: userName,
          userId: Number(userId),
        },
      });

      // Create or update the spotify sync information
      await prisma.curatorSpotifySync.upsert({
        where: {
          curatorId: curator.id,
        },
        update: {
          spotifyUserId,
          refreshToken,
          accessToken,
          updatedAt: new Date(),
        },
        create: {
          curatorId: curator.id,
          spotifyUserId,
          refreshToken,
          accessToken,
        },
      });

      return res.status(200).json({ curator });
    } catch (error) {
      console.error("Error creating/updating curator:", error);
      return res.status(500).json({ error: "Failed to create/update curator" });
    }
  }

  async getCurator(req: Request, res: Response) {
    try {
      const curatorId = Number(req.params.id);

      const curator = await prisma.curator.findUnique({
        where: {
          id: curatorId,
        },
        include: {
          spotifySync: true,
        },
      });

      if (!curator) {
        return res.status(404).json({ error: "Curator not found" });
      }

      return res.status(200).json({ curator });
    } catch (error) {
      console.error("Error fetching curator:", error);
      return res.status(500).json({ error: "Failed to fetch curator" });
    }
  }

  async saveCuratorPlaylist(req: Request, res: Response) {
    try {
      const {
        curatorId,
        playlistId,
        name,
        description,
        spotifyPlaylistId,
        acceptsSubmissions,
        submissionPrice,
      } = req.body;

      // Create or update the playlist
      const playlist = await prisma.playlist.upsert({
        where: {
          id: Number(playlistId || 0),
        },
        update: {
          name,
          description,
          spotifyPlaylistId,
          updatedAt: new Date(),
        },
        create: {
          name,
          description,
          spotifyPlaylistId,
          curatorId: Number(curatorId),
        },
      });

      // Create or update the curator playlist relationship
      const curatorPlaylist = await prisma.curatorPlaylist.upsert({
        where: {
          id: Number(playlistId || 0),
        },
        update: {
          acceptsSubmissions,
          submissionPrice,
          updatedAt: new Date(),
        },
        create: {
          playlistId: playlist.id,
          curatorId: Number(curatorId),
          acceptsSubmissions,
          submissionPrice,
        },
      });

      return res.status(200).json({
        playlist,
        curatorPlaylist,
      });
    } catch (error) {
      console.error("Error saving curator playlist:", error);
      return res.status(500).json({ error: "Failed to save curator playlist" });
    }
  }

  async getCuratorPlaylists(req: Request, res: Response) {
    try {
      const curatorId = Number(req.params.id);

      const playlists = await prisma.playlist.findMany({
        where: {
          curatorId: curatorId,
        },
        include: {
          curatorPlaylists: true,
        },
      });

      if (!playlists.length) {
        return res.status(200).json({ playlists: [] });
      }

      return res.status(200).json({ playlists });
    } catch (error) {
      console.error("Error fetching curator playlists:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch curator playlists" });
    }
  }
}
