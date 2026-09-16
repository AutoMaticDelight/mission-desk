# Mission Desk

Automatic Delight's a.team client desk: clients, meetings, inbox, interview kits.
Static site, no build step.

| File | What it is |
| --- | --- |
| `index.html` | The app. Same source as the Claude artifact; when the artifact runtime is absent it loads `data.json` and keeps edits in the browser's localStorage. |
| `data.json` | Snapshot of the desk database: jobs, meetings, show (interview kits), emails, log. |
| `middleware.js` | Edge Middleware. HTTP Basic Auth for every request, credentials from `DESK_USER` / `DESK_PASS`. Refuses everything until both are set. |
| `vercel.json` | Clean URLs, no indexing, no caching. |

## Deploy

1. Import this repo at https://vercel.com/new (framework preset: **Other**).
2. Add environment variables `DESK_USER` and `DESK_PASS` (Production + Preview).
3. Deploy. Sign in with those credentials.

## Route it under automaticdelight.com

In the site repo's `vercel.json`, add a rewrite the same way `/bench` is routed:

```json
{ "source": "/desk", "destination": "https://<this-project>.vercel.app/" },
{ "source": "/desk/:path*", "destination": "https://<this-project>.vercel.app/:path*" }
```

## Refresh the data

The Claude artifact is the synced master. Ask Claude to export the desk database and push a new `data.json`.
