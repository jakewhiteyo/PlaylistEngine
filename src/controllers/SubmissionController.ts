import prisma from "../lib/prisma";
import { Request, Response } from "express";

export class SubmissionController {
  async submitSongToCurator(req: Request, res: Response) {
    try {
      const {
        curatorId,
        spotifySongId,
        message,
        playlistIds,
        submittingUserId,
      } = req.body;

      console.log(`Submitting song ${spotifySongId} to curator ${curatorId}`);

      // Create the submission
      const submission = await prisma.submission.create({
        data: {
          curatorId: Number(curatorId),
          submittingUserId: Number(submittingUserId),
          spotifySongId,
          message,
          status: {
            create: {
              status: "pending",
            },
          },
          submissionPlaylist: {
            create: playlistIds.map((playlistId: number) => ({
              playlistId: Number(playlistId),
            })),
          },
        },
        include: {
          status: true,
          submissionPlaylist: {
            include: {
              playlist: true,
            },
          },
        },
      });

      return res.status(200).json({ submission });
    } catch (error) {
      console.error("Error submitting song to curator:", error);
      return res
        .status(500)
        .json({ error: "Failed to submit song to curator" });
    }
  }

  async getCuratorSubmissions(req: Request, res: Response) {
    try {
      const curatorId = Number(req.params.curatorId);

      const submissions = await prisma.submission.findMany({
        where: {
          curatorId: curatorId,
        },
        include: {
          status: true,
          submissionPlaylist: {
            include: {
              playlist: true,
            },
          },
          submittingUser: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({ submissions });
    } catch (error) {
      console.error("Error fetching curator submissions:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch curator submissions" });
    }
  }
}
