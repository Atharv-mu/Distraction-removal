# Distraction Removal — backend

A tiny zero-dependency Node.js server that stores real user accounts:
username, streak, total sessions, and today's sprint count — in a local
`data.json` file (created automatically on first run).

## Run it

You need Node.js installed (v16+). No `npm install` needed — it uses
only Node's built-in `http` and `fs` modules.

```bash
cd backend
node server.js
```

You should see:

```
Distraction Removal backend running at http://localhost:5050
```

Leave that terminal running, then open `distraction-removal.html`
(the frontend file) in your browser as a local file, or serve it with
any static server. The frontend automatically talks to
`http://localhost:5050`.

## Endpoints

| Method | Path                     | Body               | Returns              |
|--------|--------------------------|---------------------|-----------------------|
| GET    | `/api/profile?username=` | —                   | profile object        |
| POST   | `/api/login`              | `{ "username": "" }` | profile (creates if new) |
| POST   | `/api/session/complete`   | `{ "username": "" }` | updated profile (streak/session logic) |

## Notes

- Data lives in `backend/data.json` — delete it to reset everyone's data.
- If the frontend can't reach this server (e.g. you're viewing the page
  inside a sandboxed preview instead of a real browser), it automatically
  falls back to the built-in local storage so the app still works —
  you just won't get a real shared backend until this server is running.
- To deploy for real users (not just local testing), host this on any
  Node-capable server (Render, Railway, a VPS, etc.) and swap the
  `API_BASE` constant near the top of the frontend's `<script>` to your
  deployed URL. For production you'd also want real password auth and a
  proper database instead of a JSON file — this is a prototype backend.
