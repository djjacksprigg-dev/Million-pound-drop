# The Million Pound Drop: Console Market Edition

A phone game for teams plus a live classroom scoreboard.

- `public/index.html` is the game students play on their phones.
- `public/scoreboard.html` is the scoreboard for the classroom screen.
- `netlify/functions/scores.mjs` stores scores using Netlify Blobs (built in, free, no setup).

## Deploying

The scoreboard needs Netlify Functions, so **drag-and-drop (Netlify Drop) will not work**:
it uploads the pages but not the scoreboard function. Use one of these instead.

**Option A: GitHub (easiest to update later)**
1. Put this folder in a GitHub repository.
2. In Netlify: Add new site → Import an existing project → pick the repo.
3. Leave the build settings as they are (they come from `netlify.toml`) and deploy.

**Option B: Netlify CLI**
1. Install Node.js, then run `npm install -g netlify-cli`.
2. In this folder run `npm install`, then `netlify deploy --prod`.

## Running a lesson

1. Open `your-site.netlify.app/scoreboard.html` on the board. It creates a 4-character room code and a QR code.
2. Teams scan the QR code (or go to the site and type the code), enter a team name and play.
3. The leaderboard updates every few seconds as teams answer.
4. Press **New room** for the next class, or **Clear scores** to reset the current room.

Teams can play without a room code too. Their score just isn't sent anywhere.


