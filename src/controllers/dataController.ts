import { Request, Response } from "express";

export const testGetData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.json({ data: "Test Successful" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
