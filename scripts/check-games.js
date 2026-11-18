// Prüft gespielte Spiele auf Schummeln. Liest die Datenbank nur, ändert nichts.
//
// Auf dem Server (aus diesem Repo heraus):
//   ssh hschaletzky_com 'cd /opt/infra && docker compose exec -T focus node -' < scripts/check-games.js
//     -> alle als verdächtig markierten Spiele
//   ssh hschaletzky_com 'cd /opt/infra && docker compose exec -T focus node - Fettfinger' < scripts/check-games.js
//     -> alle Spiele dieses Namens mit Klickverlauf
// Lokal: DB_PATH=./data/focus.db node scripts/check-games.js [Name]
const { DatabaseSync } = require("node:sqlite");

const name = process.argv.slice(2).find((a) => a !== "-");
const db = new DatabaseSync(process.env.DB_PATH || "/data/focus.db", { readOnly: true });

const time = (ms) => new Date(ms).toISOString().slice(0, 19).replace("T", " ");

// Klickverlauf lesbar machen: Zeit seit dem ersten Tipp, Abstand, Feld, Echtheit
const describeLog = (clicklog) => {
  let entries;
  try {
    entries = JSON.parse(clicklog ?? "[]");
  } catch {
    return "    (Protokoll nicht lesbar)";
  }
  if (!entries.length) return "    (keine Klicks)";
  if (!Array.isArray(entries[0])) return `    (nur Felder ohne Zeiten: ${entries.join(", ")})`;
  return entries
    .map(([t, cell, trusted, inside], i) => {
      const gap = i ? `+${t - entries[i - 1][0]} ms` : "";
      const notes = [trusted ? "" : "NICHT ECHT", inside ? "" : "AUSSERHALB"].filter(Boolean).join(" ");
      return `    ${String(t).padStart(5)} ms ${gap.padStart(10)}  Feld ${String(cell).padStart(2)}  ${notes}`;
    })
    .join("\n");
};

const rows = name
  ? db
      .prepare(
        `SELECT name, rounds, flags, clicklog, started_at, begun_at, finished_at FROM games
         WHERE finished_at IS NOT NULL AND lower(name) = lower(?) ORDER BY finished_at`
      )
      .all(name)
  : db
      .prepare(
        `SELECT name, rounds, flags, clicklog, started_at, begun_at, finished_at FROM games
         WHERE flags IS NOT NULL ORDER BY finished_at DESC LIMIT 50`
      )
      .all();

if (!rows.length) {
  console.log(name ? `Keine Spiele von "${name}".` : "Keine verdächtigen Spiele.");
} else {
  console.log(name ? `Spiele von "${name}":` : "Verdächtige Spiele (neueste zuerst, höchstens 50):");
  for (const g of rows) {
    const look = g.begun_at ? `${((g.begun_at - g.started_at) / 1000).toFixed(2)} s geschaut` : "";
    console.log(`\n${time(g.finished_at)} UTC  ${g.name}  ${g.rounds} Punkte  ${look}`);
    console.log(`  Vermerk: ${g.flags ?? "keiner"}`);
    if (name) console.log(describeLog(g.clicklog));
  }
}
