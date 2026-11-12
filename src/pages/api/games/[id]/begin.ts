import type { NextApiRequest, NextApiResponse } from "next";
import { beginGame, GameError } from "@/utils/games";

// Erster Tipp im Spiel: ab jetzt läuft der Countdown
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }
  try {
    beginGame(String(req.query.id));
    res.status(204).end();
  } catch (err) {
    if (err instanceof GameError) return res.status(err.status).json({ error: err.message });
    throw err;
  }
}
