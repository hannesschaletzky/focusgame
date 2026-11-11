import type { FinishedGame, LeaderboardEntry, NewGame } from "@/utils/types";

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body as T;
};

export const createGame = (color: string) =>
  request<NewGame>("/api/games", { method: "POST", body: JSON.stringify({ color }) });

export const finishGame = (id: string, name: string, clicks: number[]) =>
  request<FinishedGame>(`/api/games/${encodeURIComponent(id)}/finish`, {
    method: "POST",
    body: JSON.stringify({ name, clicks }),
  });

export const getLeaderboard = () => request<LeaderboardEntry[]>("/api/leaderboard");
