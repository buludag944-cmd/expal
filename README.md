# EXPal web

Public website for **EXPal** — your friend away from home.

Live app: [https://expalapp.netlify.app](https://expalapp.netlify.app)

Anyone can open this landing page and read the journal **without logging in**. Sign up or log in with Google when you want an account.

App id: `com.yourbrandexpal`

## What you get

- Public landing page with a blog section
- **Sign up / set up account** and **Log in with Google** (Firebase Gmail — same project as the EXPal app)
- Account setup after the first Google sign-in
- Individual article URLs with titles, descriptions, sitemap, RSS, and Open Graph
- Writer desk at `/admin` so you can publish new posts yourself

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page and `/blog` do not ask for an account. **Sign up** and **Log in** use Firebase Google sign-in.

### Create or open an account

1. Open `/signup` (new) or `/login` (returning)
2. Choose **Set up account with Google** or **Log in with Google**
3. New accounts continue to `/setup` to finish profile details
4. Then open the full web app at [expalapp.netlify.app](https://expalapp.netlify.app) with the same Gmail

### Publish a post

1. Set `ADMIN_PASSWORD` in `.env.local`
2. Visit `/admin`
3. Write the article in Markdown
4. Tick **Publish on the public landing page**

Posts are stored in `data/posts.json`. After you publish locally, commit that file so the stories stay on the server you deploy to.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL. Production: `https://expalapp.netlify.app` |
| `NEXT_PUBLIC_APP_URL` | Full web app. Production: `https://expalapp.netlify.app` |
| `NEXT_PUBLIC_API_URL` | Backend for Google account create / login |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web config (`expalapp-a6422`) |
| `NEXT_PUBLIC_APP_ID` | `com.yourbrandexpal` |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `ADMIN_SECRET` | Optional extra secret for the admin cookie |

If you host this site on a new domain, add that domain in Firebase → Authentication → Settings → Authorized domains.

## Deploy on Netlify

This repo includes `netlify.toml` pointed at `expalapp.netlify.app`. Set `ADMIN_PASSWORD` as a Netlify environment variable (not in git).

## SEO

- `sitemap.xml` and `robots.txt`
- `/feed.xml` RSS
- JSON-LD for the site and each article
- Android App Links at `/.well-known/assetlinks.json` for `com.yourbrandexpal`

## Scripts

```bash
npm test
npm run build
npm start
```
