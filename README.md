A game to practice your focus and compete against your friends.
Act quick and get the highest points.

[Click to play](https://focus.hschaletzky.com)

Stack: Next.js, React, TypeScript, Tailwind, styled-components, SQLite (`node:sqlite`)

## How it works

- `POST /api/games` creates a game: the server generates 100 boards and keeps the solutions to itself.
- The client sends every clicked cell to `POST /api/games/:id/finish`. The server replays the clicks,
  counts the score and checks that the game ended within the time window.
- `GET /api/leaderboard` returns the top 10, best run per name.

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

## Screenshots

![0](https://github.com/hannesschaletzky/focusgame/assets/29574225/a39d0aee-4070-4a95-87f6-f0963618f203)

![1](https://github.com/hannesschaletzky/focusgame/assets/29574225/234b4850-213a-4ee2-83d3-16e5862469c3)

![2](https://github.com/hannesschaletzky/focusgame/assets/29574225/4e1422c2-fdfe-49b6-a924-c992df419e6a)

![image](https://github.com/hannesschaletzky/focusgame/assets/29574225/e509aa03-558a-4328-945b-5d9b4871765e)
