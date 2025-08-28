# obuddy5000

A minimal, ready-to-deploy Vite + React + Tailwind app with **serverless API proxy** to keep your API key on the server.

You can deploy this to **Vercel** or **Netlify** (both free tiers). No secrets in the client – set `OPENAI_API_KEY` as an environment variable on the host.

## Local Dev (optional)
```bash
npm install
# For regular Vite dev server (frontend only):
npm run dev
# For end-to-end (frontend + functions) use one of these CLIs:
# Vercel:  npm i -g vercel && vercel dev
# Netlify: npm i -g netlify-cli && netlify dev
```

## Where the magic happens

- Frontend calls `POST /api/chat` with `{ messages }`.
- On **Vercel**, the serverless function is at `api/chat.js`.
- On **Netlify**, the function is at `netlify/functions/chat.js` and a redirect maps `/api/chat` to it in production.
- Your secret is read from `process.env.OPENAI_API_KEY` on the server only.

## Environment Variables
Create a `.env` file **only for local function dev** (never commit it):
```
OPENAI_API_KEY=sk-...
```
For production, set the same variable in your host's dashboard.

---

## 🚀 Option A: Deploy to Vercel

1. Push this folder to a new GitHub repo (or import it directly on Vercel).
2. Go to Vercel → **New Project** → **Import** your repo.
3. Framework preset: **Vite** (detected automatically). Build command: `npm run build`, Output dir: `dist`.
4. In **Settings → Environment Variables**, add:
   - `OPENAI_API_KEY` → your key
5. **Deploy**. After it builds, open the production URL.
6. (Optional) To run locally with functions: `npm i -g vercel && vercel dev`.

> The included `vercel.json` keeps client-side routing working and leaves `/api/*` to serverless functions.

---

## 🌐 Option B: Deploy to Netlify

1. Push this folder to a new GitHub repo.
2. Go to Netlify → **Add new site** → **Import an existing project**.
3. Build command: `npm run build`  
   Publish directory: `dist`
4. In **Site settings → Environment variables**, add:
   - `OPENAI_API_KEY` → your key
5. **Deploy**. Your frontend calls `/api/chat`, which is redirected to `/.netlify/functions/chat` (see `netlify.toml`).

> To dev locally with functions: `npm i -g netlify-cli && netlify dev`.

---

## Notes
- Never put API keys in client code. Only the serverless function reads `OPENAI_API_KEY`.
- If you use a different provider than OpenAI, just modify the fetch in the function files to match their API.
