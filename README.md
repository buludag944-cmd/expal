# EXPal web

Public website for **EXPal** — your friend away from home.

This is the web landing page. Anyone can open it and read the journal **without logging in**. That is what helps search engines send people here.

App id: `com.yourbrandexpal`

## What you get

- Public landing page with a blog section
- Individual article URLs with titles, descriptions, sitemap, RSS, and Open Graph
- Writer desk at `/admin` so you can publish new posts yourself

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page and `/blog` do not ask for an account.

### Publish a post

1. Set `ADMIN_PASSWORD` in `.env.local`
2. Visit `/admin`
3. Write the article in Markdown
4. Tick **Publish on the public landing page**

Posts are stored in `data/posts.json`. After you publish locally, commit that file so the stories stay on the server you deploy to.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for sitemap and social cards |
| `NEXT_PUBLIC_APP_URL` | Optional link to the signed-in EXPal app |
| `NEXT_PUBLIC_APP_ID` | `com.yourbrandexpal` |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `ADMIN_SECRET` | Optional extra secret for the admin cookie |

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
