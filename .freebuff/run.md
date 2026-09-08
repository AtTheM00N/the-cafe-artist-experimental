# Run — The Cafe Artist (Next.js 15 + Tailwind v4)

## Reproduce artifacts

```bash
npm install          # npm only (package-lock.json present); no .env files needed — all content lives in lib/content.ts
```

- No environment variables are required. Photos are optional: drop files into `public/photos/{slotId}.jpg` and rebuild; missing slots render as designed "unexposed frames".
- **CRITICAL: `next dev` and `next start` fight over `.next`.** Running dev clobbers the production build in `.next`, and a stale production `.next` makes dev serve intermittent 500s (`SyntaxError: Unexpected end of JSON input` in the server log; truncated scripts client-side). Always `rm -rf .next` (or rebuild) when switching between dev and production servers.
- The production server (`npm start`) is the stable choice for preview/QA: identical chunks every load, no compile windows. Dev works too, but the first loads during compile can 500 — reload once if the page fails to hydrate.

## Run the server

```bash
npm run build && npm start -- --port 3000   # production — preferred for preview/QA
# or
npm run dev -- --port 3000                  # dev — reload once if first load fails to hydrate
```

- Default port is 3000; if taken, Next auto-picks a free port — read the actual URL from the server log.
- Windows detach recipe (used for this thread's preview):

```powershell
(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','start','--','-p','3000' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id
```

- stdout and stderr must go to two DIFFERENT files. Confirm with `Get-Process -Id <pid>` and wait for `✓ Ready` in the log before registering the preview.
- The `Start-Process` wrapper can make the calling shell hang until timeout even though the server started fine — check the log and the port instead of trusting the command's exit.
- The first `Start-Process` after a server kill sometimes dies silently (pid vanishes); if the port never comes up, launch again and use the second pid.
