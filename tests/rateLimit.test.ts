import { describe, expect, it } from "vitest";
import { addressKey, clientAddress, createRateLimiter } from "@/utils/rateLimit";

const req = (forwarded?: string, remote = "10.0.0.1") =>
  ({ headers: forwarded ? { "x-forwarded-for": forwarded } : {}, socket: { remoteAddress: remote } }) as never;

describe("clientAddress", () => {
  it("nimmt den letzten Eintrag, den setzt Caddy (vorne kann der Client lügen)", () => {
    expect(clientAddress(req("6.6.6.6, 203.0.113.7"))).toBe("203.0.113.7");
    expect(clientAddress(req("203.0.113.7"))).toBe("203.0.113.7");
  });

  it("ohne Header die Adresse der Verbindung", () => {
    expect(clientAddress(req())).toBe("10.0.0.1");
  });
});

describe("addressKey", () => {
  it("IPv4 einzeln, auch in IPv6-Schreibweise", () => {
    expect(addressKey("203.0.113.7")).toBe("203.0.113.7");
    expect(addressKey("::ffff:203.0.113.7")).toBe("203.0.113.7");
  });

  it("IPv6 als /64-Block, egal wie die Adresse geschrieben ist", () => {
    const key = "2001:db8:1:2::/64";
    expect(addressKey("2001:db8:1:2:aaaa:bbbb:cccc:dddd")).toBe(key);
    expect(addressKey("2001:db8:1:2::1")).toBe(key);
    expect(addressKey("2001:0db8:0001:0002:0000:0000:0000:0001")).toBe(key);
    expect(addressKey("2001:db8:1:3::1")).not.toBe(key);
    expect(addressKey("2001:db8::1")).toBe("2001:db8:0:0::/64");
  });
});

describe("createRateLimiter", () => {
  it("erlaubt das Limit pro Fenster, danach erst wieder, wenn alte Treffer herausfallen", () => {
    const allow = createRateLimiter({ limit: 3, windowMs: 60_000 });
    expect([0, 1, 2, 3].map((t) => allow("a", t))).toEqual([true, true, true, false]);
    expect(allow("b", 4)).toBe(true); // andere Adresse zählt getrennt
    expect(allow("a", 30_000)).toBe(false);
    expect(allow("a", 60_000)).toBe(true); // der erste Treffer ist herausgefallen
  });

  it("abgelehnte Versuche verlängern die Sperre nicht", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1_000 });
    allow("a", 0);
    for (let t = 1; t < 1_000; t += 100) allow("a", t);
    expect(allow("a", 1_000)).toBe(true);
  });
});
