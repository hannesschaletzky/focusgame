A game to practice your focus and compete against your friends.
Act quick and get the highest points.

**[Play it at focus.hschaletzky.com](https://focus.hschaletzky.com)**

No screenshots here on purpose: it takes five seconds to understand and five seconds to play.
Just open the link, pick a name and see if you make it onto the leaderboard.

Stack: Next.js, React, TypeScript, Tailwind, styled-components, SQLite (`node:sqlite`)

## How it works

- `POST /api/games` creates a game: the server generates 100 boards and keeps the solutions to itself.
- `POST /api/games/:id/begin` marks the first tap. The 5 seconds start there, not when the board appears.
- The client sends every clicked cell to `POST /api/games/:id/finish`. The server replays the clicks,
  counts the score and checks that the game ended within the time window.
- `GET /api/leaderboard` returns the top 10 (best run per name, with games played per name) and the total
  number of games.

The SQLite file lives at `DB_PATH` (default `./data/focus.db`). `PRAGMA user_version` tracks one-time data migrations (see `src/utils/db.ts`).

## Development

```sh
npm install
npm run dev
npm test   # server game logic: scoring, time window, leaderboard, migrations
```

## Deployment

Pushes to `main` build an image to `ghcr.io/hannesschaletzky/focusgame` and deploy it via
[hschaletzky-infra](https://github.com/hannesschaletzky/hschaletzky-infra) (service `focus`, volume `/data`).
