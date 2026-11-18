import type { IncomingMessage } from "node:http";

// Begrenzt, wie oft eine Adresse in einem Zeitfenster etwas darf (gleitendes Fenster, im Speicher).
// Reicht für einen einzelnen Server-Prozess; nach einem Neustart beginnt die Zählung von vorn.

// Die Adresse des Clients. Caddy hängt die echte Adresse an X-Forwarded-For an, der letzte
// Eintrag stammt also von Caddy selbst und lässt sich vom Client nicht fälschen.
export const clientAddress = (req: Pick<IncomingMessage, "headers" | "socket">): string => {
  const forwarded = req.headers["x-forwarded-for"];
  const list = (Array.isArray(forwarded) ? forwarded.join(",") : forwarded ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.at(-1) ?? req.socket?.remoteAddress ?? "unknown";
};

// Schlüssel für die Zählung: IPv4 einzeln, IPv6 als /64-Block (so viel bekommt ein Anschluss)
export const addressKey = (address: string): string => {
  const mapped = address.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped) return mapped[1];
  if (!address.includes(":")) return address;

  const [head, tail = ""] = address.toLowerCase().split("::");
  const left = head ? head.split(":") : [];
  const right = address.includes("::") && tail ? tail.split(":") : [];
  const missing = 8 - left.length - right.length;
  const groups = address.includes("::") ? [...left, ...Array(missing).fill("0"), ...right] : left;
  return `${groups
    .slice(0, 4)
    .map((g) => g.replace(/^0+(?=.)/, ""))
    .join(":")}::/64`;
};

export const createRateLimiter = ({ limit, windowMs }: { limit: number; windowMs: number }) => {
  const hits = new Map<string, number[]>();

  return (key: string, now = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    const allowed = recent.length < limit;
    if (allowed) recent.push(now);
    hits.set(key, recent);

    // Gelegentlich alte Einträge wegräumen, damit die Map nicht wächst
    if (hits.size > 10_000) {
      for (const [k, times] of hits) {
        if (times.every((t) => now - t >= windowMs)) hits.delete(k);
      }
    }
    return allowed;
  };
};
