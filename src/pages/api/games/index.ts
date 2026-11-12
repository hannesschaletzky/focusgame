import type { NextApiRequest, NextApiResponse } from "next";
import { createGame } from "@/utils/games";
import { isColor } from "@/utils/constants";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }
  const color = req.body?.color;
  if (!isColor(color)) return res.status(400).json({ error: "Unbekannte Farbe" });
  res.status(201).json(createGame(color));
}
