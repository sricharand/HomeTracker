# Home Base — setup guide

## 1. Central storage (Google Sheets)
1. Create a new Google Sheet (any name).
2. Extensions → Apps Script. Delete the default code and paste in `Code.gs`.
3. Click **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone with the link** (needed so family members' phones can reach it without logging into your Google account)
4. Click Deploy, authorize the permissions prompt, and copy the **Web app URL** (ends in `/exec`).
5. That URL is your "central storage" endpoint — you'll paste it into the app's Settings tab.

## 2. Hosting the app (so it has a real installable address)
Pick one (both are free):

**GitHub Pages**
1. Create a new GitHub repo, upload `index.html`, `manifest.json`, `sw.js`.
2. Repo → Settings → Pages → set source to the main branch.
3. Your app is live at `https://<username>.github.io/<repo>/`.

**Netlify (drag-and-drop, no git needed)**
1. Go to app.netlify.com → "Add new site" → "Deploy manually".
2. Drag the folder containing `index.html`, `manifest.json`, `sw.js` into the upload box.
3. Netlify gives you a live URL immediately.

## 3. Connect the app to the Sheet
1. Open your hosted URL.
2. Go to **Settings** → paste the Apps Script Web App URL from step 1 → **Connect**.
3. Do this once per family member's phone — they all point at the same Sheet, so everyone sees the same lists.

## 4. Install on phones
- **Android (Chrome):** open the site → menu (⋮) → "Add to Home screen" / "Install app".
- **iPhone (Safari):** open the site → Share icon → "Add to Home Screen".
Once added, it opens full-screen like a normal app, no browser bar.

## 5. Notifications — what you get out of the box
- Opening Settings → "Enable reminders on this device" turns on local notifications for overdue tasks and pending helper payments *whenever the app is opened*.
- This works on every device without any extra setup.

## 6. If you want true background push later (optional, bigger lift)
Real push (notified even with the app fully closed) needs:
- VAPID keys generated once
- A small push-sending step (can still be Apps Script, triggered by a time-based trigger, e.g. "check every morning at 8am and push reminders")
- The frontend subscribing via `PushManager` and sending that subscription to your backend
Happy to build this out if the in-app reminders aren't enough for your use case.

## Notes
- Data sync is poll-based (every 20 seconds) rather than instant — fine for a family to-do/grocery list, not built for rapid simultaneous editing.
- The whole state is one JSON blob per Sheet — you can also open the Sheet directly and glance at the raw JSON in cell A1 if you ever want to eyeball or back up the data.
