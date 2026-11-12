import type { NextApiRequest, NextApiResponse } from "next";
import { leaderboard } from "@/utils/games";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(leaderboard());
}
