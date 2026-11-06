# Distraction Removal

> **Study 15 minutes. Heal your focus. Repeat.**

<p align="center">
  <a href="https://distraction-removal.onrender.com/"><img src="https://img.shields.io/badge/Live_Demo-Visit_Site-7c4dff?style=for-the-badge&logo=render&logoColor=white" alt="Live demo"></a>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

**Live demo:** [distraction-removal.onrender.com](https://distraction-removal.onrender.com/)

Distraction Removal is a calm focus app for students who are tired of losing hours to their phone. You complete one short study sprint, unlock a one-minute break game, and build a streak that reflects the work you actually did.

There are no feeds, no notifications and no infinite scroll. Once the timer starts, the app stays out of your way.

It is a small prototype: a single Node.js server with no dependencies, serving one HTML page and a tiny JSON API.

---

## Contents

- [Features](#features)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [API](#api)
- [Known limitations](#known-limitations)
- [Ideas for next steps](#ideas-for-next-steps)
- [License](#license)

---

## Features

- **Focus sprints.** A glowing ring counts down one sprint at a time. Choose 15, 25 or 45 minutes (15 is the default), then start, pause, resume or reset. The length can only be changed while the timer isn't running.
- **Earned break game.** Finishing a sprint unlocks a "bubble pop" game for 60 seconds, with a live score. When it ends, the game locks again until your next sprint.
- **Streaks and stats.** The app tracks your current streak, total sprints and sprints completed today. A row of eight dots fills up as you finish sprints during the day.
- **AI study buddy.** A chat panel with three quick prompts ("motivate me", "phone habit", "what's pomodoro?"). Replies are limited to 180 tokens and the assistant is asked to keep answers under about 70 words. Each message is answered on its own, with no memory of earlier ones.
- **Simple login.** Type a name and you're in. There is no password or email.
- **Atmosphere.** A dark theme with animated aurora and starfield backgrounds, a custom cursor, and a particle orb that tightens while you focus and bursts when a sprint ends.

---

## Quick start

You need [Node.js](https://nodejs.org) 16 or newer. There are no dependencies to install.

```bash
cd Distraction-removal-main
node server.js
```

Open **http://localhost:5050** in your browser.

To use another port:

```bash
PORT=3000 node server.js
```

`npm start` runs the same command.

---

## Project structure

```
Distraction-removal-main/
├── server.js        # Node server: serves the page and the JSON API
├── package.json     # Project info and the "start" script
├── public/
│   └── index.html   # The whole frontend: HTML, CSS and JavaScript
├── README.md
└── data.json        # Created automatically on first login (not in the repo)
```

---

## How it works

**Backend (`server.js`).** It uses only Node's built-in `http`, `fs` and `path` modules. It serves files from `public/` and stores every user's profile in a local `data.json` file. Usernames are matched case-insensitively, so "Aman" and "aman" are the same profile.

**Streak rules.** When a sprint is completed:

- If you already finished a sprint today, the streak stays the same and the counters go up.
- If your last sprint was yesterday, the streak goes up by one.
- Otherwise, the streak resets to 1.

"Today" and "yesterday" are calculated in UTC.

**Frontend (`public/index.html`).** One self-contained page with three screens: a landing page, a login screen and the app itself. Fonts (Space Grotesk, Inter and JetBrains Mono) load from Google Fonts.

**Offline fallback.** The frontend tries the backend first. If the request fails, it keeps your profile in `window.storage` and works out streaks locally. A badge in the app header shows either "live backend" or "offline mode (local)".

---

## API

| Method | Endpoint | What it does |
|--------|----------|--------------|
| `GET`  | `/api/profile?username=name` | Return a user's profile. For an unknown user it returns an empty profile without saving it. |
| `POST` | `/api/login` with `{ "username": "name" }` | Log in, creating and saving the profile if it's new. |
| `POST` | `/api/session/complete` with `{ "username": "name" }` | Record a finished sprint, update the streak and save. |

A profile looks like this:

```json
{
  "username": "Aman",
  "streak": 3,
  "sessionsTotal": 12,
  "lastStudyDate": "2026-10-28",
  "todayCount": 2
}
```

A missing username returns `400` with `{ "error": "username required" }`. Unknown routes return `404` with `{ "error": "not found" }`.

---

## Known limitations

- **The AI chat only works inside Claude's artifact environment.** It calls the Anthropic API directly from the browser (model `claude-sonnet-4-6`) with no API key in the code. When you run the app with `node server.js`, or on the hosted demo, those requests fail and the chat shows "Connection hiccup" or a fallback message. To make it work, add a `/api/chat` route to `server.js` that keeps your API key in an environment variable and forwards the request, then point the frontend at it. Never put the key in `index.html`.
- **Login is not secure.** Anyone can enter any name and read or change that person's streak. This is fine for a prototype but not for real users.
- **The offline fallback needs Claude's environment too.** `window.storage` only exists there. In a normal browser the fallback can't save anything, so your progress lasts only until you refresh the page. Keep the backend running to save it.
- **The timer lives in the page.** Refreshing or closing the tab loses the sprint in progress.
- **`data.json` is a plain file** that is fully rewritten on every login and every completed sprint. That is fine for a handful of users, but not for heavy or simultaneous use. On hosts with a temporary filesystem, such as Render's default setup, it can also be reset when the app redeploys or restarts.
- **The server is minimal.** CORS allows any origin, request bodies have no size limit, and there is no rate limiting or username validation.
- **UTC dates.** "Today" rolls over at midnight UTC, which is 5:30 AM in India.
- **An internet connection is needed** for the Google Fonts to load.

---

## Ideas for next steps

- Add a `/api/chat` proxy so the study buddy works locally and on the hosted site
- Real accounts, with passwords or Google sign-in
- Use each user's local timezone for streaks
- Save data in a real database instead of `data.json`, and add `data.json` to `.gitignore`
- Let users choose how long the reward game lasts
- More reward games and a weekly history view

---

## License

No license is specified yet. If you plan to share the project, add one (MIT is a common choice).
