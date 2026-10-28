# Distraction Removal

**Study 15 minutes. Heal your focus. Repeat.**

A calm little focus app for students who are tired of losing hours to their phone. You do one short study sprint, you earn a tiny break-time game, and you build a streak that actually reflects the work you did.

No feeds. No notifications. No infinite scroll. The app is built to get out of your way once the timer starts.

---

## What it does

- **Focus sprints.** A glowing ring counts down one sprint at a time. Pick 15, 25 or 45 minutes (15 is the default). You can pause, resume or reset.
- **Earned rewards.** Finish a sprint and a short "bubble pop" mini-game unlocks for 60 seconds. A small, calming break instead of a doom-scroll.
- **Real streaks.** Study today and your streak goes up. Miss a day and it resets to 1 the next time you finish a sprint. The app also tracks total sessions and sprints done today.
- **AI study buddy.** A chat box where you can ask a quick question or get a motivation nudge. Answers are kept short (under ~70 words) so you can get back to work.
- **Simple login.** Type a name and you're in. No password, no email. This is a prototype.

---

## Quick start

You only need [Node.js](https://nodejs.org) version 16 or newer. There is nothing to install: the project has **zero dependencies**.

```bash
cd Distraction-removal-main
node server.js
```

Then open **http://localhost:5050** in your browser.

Want a different port?

```bash
PORT=3000 node server.js
```

(`npm start` works too.)

---

## How it's put together

```
Distraction-removal-main/
├── server.js        # Tiny Node server: serves the page + a small JSON API
├── package.json     # Project info and the "start" script
├── public/
│   └── index.html   # The entire frontend (HTML, CSS and JS in one file)
└── data.json        # Created automatically on first login; stores user profiles
```

**Frontend** (`public/index.html`): one self-contained page with three screens: landing page, login, and the app itself. It has a dark theme with animated aurora and starfield backgrounds, a custom cursor, a particle orb that tightens while you focus and bursts when you finish, and the timer ring.

**Backend** (`server.js`): plain Node, built-in modules only. It serves the page and saves each user's profile to a local `data.json` file.

### API

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

The frontend tries the backend first. If it can't reach it, it falls back to storing your profile in the browser and calculating streaks locally. A small badge in the nav bar shows which mode you're in.

---

## Things to know

- **The AI chat calls the Anthropic API straight from the browser** (model `claude-sonnet-4-6`), with no API key in the code. That works inside Claude's artifact environment, but **it will not work when you run the app locally with `node server.js`**. To make chat work on your own machine, add a `/api/chat` route to `server.js` that holds your API key in an environment variable and forwards the request, then point the frontend at it. Never put the key in `index.html`.
- **Login is not secure.** Anyone can type any name and see or add to that person's streak. Fine for a prototype, not for real users.
- **Browser fallback uses `window.storage`**, which also comes from the Claude artifact environment. In a normal browser, that fallback will quietly fail, so the backend needs to be running for your progress to be saved.
- **Dates are in UTC**, so "today" can roll over at an odd hour depending on your timezone (for India, at 5:30 AM).
- **`data.json` is a plain file.** Simple and fine for a few users, but it isn't built for heavy or simultaneous use.
- The page loads fonts from Google Fonts, so you need an internet connection for it to look right.

---

## Ideas for next steps

- Add a `/api/chat` proxy so the study buddy works locally
- Real accounts (passwords or Google sign-in)
- Use the user's local timezone for streaks
- Let the user choose how long the reward game lasts
- More reward games, and a weekly history view

---

## License

None specified yet. Add one (MIT is a common choice) if you plan to share this.
