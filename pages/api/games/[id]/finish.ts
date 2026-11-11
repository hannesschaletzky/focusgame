import type { NextApiRequest, NextApiResponse } from "next";
import { finishGame, GameError } from "@/utils/games";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }
  try {
    res.status(200).json(finishGame(String(req.query.id), req.body?.name, req.body?.clicks));
  } catch (err) {
    if (err instanceof GameError) return res.status(err.status).json({ error: err.message });
    throw err;
  }
}
