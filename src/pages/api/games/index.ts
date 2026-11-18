import type { NextApiRequest, NextApiResponse } from "next";
import { createGame, GameError } from "@/utils/games";
import { isColor } from "@/utils/constants";
import { addressKey, clientAddress, createRateLimiter } from "@/utils/rateLimit";

// Ein Mensch schafft wegen 5 Sekunden Spielzeit und Ladebildschirm höchstens etwa 7 Spiele pro
// Minute. 20 lassen also viel Luft und bremsen trotzdem Skripte, die die Datenbank füllen wollen.
const allowGame = createRateLimiter({ limit: 20, windowMs: 60_000 });

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }
  const color = req.body?.color;
  if (!isColor(color)) return res.status(400).json({ error: "Unknown color" });

  if (!allowGame(addressKey(clientAddress(req)))) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Too many games, take a short break" });
  }

  try {
    res.status(201).json(createGame(color));
  } catch (err) {
    if (err instanceof GameError) return res.status(err.status).json({ error: err.message });
    throw err;
  }
}
