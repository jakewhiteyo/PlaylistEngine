import prisma from "../lib/prisma";
import { Request, Response } from "express";

export class CuratorController {
  async createUpdateCurator(req: Request, res: Response) {
    try {
      const { curatorId, userId, spotifyUserId, refreshToken, accessToken } =
        req.body;
      console.log(`Creating/updating curator ${userId}`);

      const curator = await prisma.curator.upsert({
        where: {
          id: Number(curatorId) || 0,
        },
        update: {
          userId: Number(userId),
          updatedAt: new Date(),
        },
        create: {
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
}
