import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthController {
  // Temporary method to create/update a user (will be replaced with Google SSO later)
  async createOrUpdateUser(req: Request, res: Response) {
    try {
      const { email, firstName, lastName, googleId, curatorId } = req.body;
      console.log(`Creating user ${email}`);
      
      const user = await prisma.user.upsert({
          where: { 
            id: curatorId,
           },
          update: {
            email,
            firstName,
            lastName,
            googleId,
          },
          create: {
            email,
            firstName,
            lastName,
            googleId,
          },
        });

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error creating/updating user:', error);
      return res.status(500).json({ error: 'Failed to create/update user' });
    }
  }

  // Get user by email (useful for testing)
  async getUserByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      
      console.log(`Fetching user with email: ${email}`);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
  }
}
