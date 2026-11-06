# Distraction Removal

> **Study 15 minutes. Heal your focus. Repeat.**

<p align="center">
  <a href="https://distraction-removal.onrender.com/"><img src="https://img.shields.io/badge/Live_Demo-Visit_Site-7c4dff?style=for-the-badge&logo=render&logoColor=white" alt="Live demo"></a>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

**Live demo:** [distraction-removal.onrender.com](https://distraction-removal.onrender.com/)

Distraction Removal is a calm, simple focus app for students who are tired of losing hours to their phone. You complete one short study sprint, earn a small break-time game, and build a streak that reflects the work you actually did.

There are no feeds, no notifications and no infinite scroll. Once the timer starts, the app stays out of your way.

---

## Contents

- [What it does](#what-it-does)
- [Quick start](#quick-start)
- [How it's put together](#how-its-put-together)
- [API](#api)
- [Things to know](#things-to-know)
- [Ideas for next steps](#ideas-for-next-steps)
- [License](#license)

---

## What it does

- **Focus sprints.** A glowing ring counts down one sprint at a time. Choose 15, 25 or 45 minutes (15 is the default), and pause, resume or reset whenever you need to.
- **Earned rewards.** Finish a sprint and a short "bubble pop" mini-game unlocks for 60 seconds, giving you a calm break instead of a doom-scroll.
- **Real streaks.** Study today and your streak goes up. Miss a day and it resets to 1 the next time you finish a sprint. The app also tracks your total sessions and the sprints you've done today.
- **AI study buddy.** A chat box for quick questions or a motivation nudge. Answers stay short (under about 70 words) so you can get straight back to work.
- **Simple login.** Type a name and you're in, with no password or email. This is a prototype.

---

## Quick start

You only need [Node.js](https://nodejs.org) version 16 or newer. The project has **zero dependencies**, so there is nothing to install.

```bash
cd Distraction-removal-main
node server.js
```

Then open **http://localhost:5050** in your browser.

To use a different port:

```bash
PORT=3000 node server.js
```

`npm start` works too.

---

## How it's put together

```
Distraction-removal-main/
├── server.js        # Tiny Node server: serves the page and a small JSON API
├── package.json     # Project info and the "start" script
├── public/
│   └── index.html   # The entire frontend (HTML, CSS and JS in one file)
└── data.json        # Created automatically on first login; stores user profiles
```

**Frontend** (`public/index.html`): a single self-contained page with three screens: a landing page, a login screen and the app itself. It has a dark theme with animated aurora and starfield backgrounds, a custom cursor, the timer ring, and a particle orb that tightens while you focus and bursts when you finish.

**Backend** (`server.js`): plain Node using only built-in modules. It serves the page and saves each user's profile to a local `data.json` file.

---

## API

| Method | Endpoint | What it does |
|--------|----------|--------------|
| `GET`  | `/api/profile?username=name` | Fetch a user's profile |
| `POST` | `/api/login` with `{ "username": "name" }` | Log in, creating the profile if it's new |
| `POST` | `/api/session/complete` with `{ "username": "name" }` | Record a finished sprint and update the streak |

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

Usernames are matched case-insensitively, so "Aman" and "aman" are the same person.

### If the server is down

The frontend tries the backend first. If it can't reach it, it falls back to saving your profile in the browser and working out streaks locally. A small badge in the nav bar shows which mode you're in.

---

## Things to know

- **The AI chat calls the Anthropic API directly from the browser** (model `claude-sonnet-4-6`), with no API key in the code. That works inside Claude's artifact environment, but **it won't work when you run the app locally with `node server.js`**. To get chat working on your own machine, add a `/api/chat` route to `server.js` that keeps your API key in an environment variable and forwards the request, then point the frontend at it. Never put the key in `index.html`.
- **Login is not secure.** Anyone can type any name and see or add to that person's streak. That's fine for a prototype but not for real users.
- **The browser fallback uses `window.storage`**, which also comes from the Claude artifact environment. In a normal browser it fails silently, so the backend must be running for your progress to be saved.
- **Dates are in UTC**, so "today" can roll over at an odd hour depending on your timezone (for India, that's 5:30 AM).
- **`data.json` is a plain file.** It's fine for a few users, but it isn't built for heavy or simultaneous use.
- **Fonts load from Google Fonts**, so you need an internet connection for the page to look right.

---

## Ideas for next steps

- Add a `/api/chat` proxy so the study buddy works locally
- Real accounts, with passwords or Google sign-in
- Use each user's local timezone for streaks
- Let users choose how long the reward game lasts
- More reward games and a weekly history view

---

## License

No license is specified yet. If you plan to share the project, add one (MIT is a common choice).
