# NEDAAS HealthCare (Offline-first PWA)

A lightweight **offline-first** web app for **rural & hill regions** of Bangladesh to capture medical help requests on-device, share them later (JSON export / WhatsApp), and provide a simple **Admin Dashboard** for triage plus an offline contact directory.

> **Disclaimer:** This app provides general guidance and workflow support only. It is not a medical device, is not a substitute for licensed clinicians, and should not be used for diagnosis.

## ✨ Key Features

### User Portal (`user.html`)
- **Danger Signs Checklist** (pregnancy, child, breathing/severe). If any danger sign is selected, **urgency auto-switches to “Emergency.”**
- **Medical Help Request form** (patient details, location, problem type, urgency, symptoms).
- **GPS capture** (optional) using browser geolocation.
- **Offline storage**: requests are stored locally on the device.
- **Queue viewer**: view saved requests.
- **Export**: download JSON exports to share later.
- **Live consulting via WhatsApp**
  - Free: opens WhatsApp with a pre-filled message.
  - Premium: doctor call flow (demo-gated by the Tier selector).
- **Premium tools (demo)**
  - Lab test suggestion helper (general guidance).
  - Prescription review request flagging.
  - “AI Doctor” button that opens ChatGPT.

### Admin Portal (`admin.html`)
- **Admin lock screen** (demo credentials).
- **Offline Directory** management (store verified contacts for offline use).
- **Case list management**
  - Import cases JSON exported from the User Portal.
  - Export case list JSON.
  - Clear case list.
- **Export Admin database** (directory + cases).

### Offline-first / PWA
- Includes a **service worker** that caches core assets for offline use.
- Includes a **web app manifest** so it can be installed to home screen as a standalone app.

### Language + Theme
- **Bangla (default) / English** toggle.
- **Light / Dark mode** toggle.

## 🧰 Tech Stack

- Plain **HTML + CSS + JavaScript (ES Modules)**
- **LocalStorage / SessionStorage** for persistence
- **Service Worker** caching for offline support

No build step required.

## 📁 Project Structure

```
.
├── user.html            # User portal UI
├── user.js              # User portal logic
├── admin.html           # Admin portal UI
├── admin.js             # Admin portal logic
├── common.js            # i18n strings, helpers, local storage stores
├── style.css            # Styles
├── manifest.json        # PWA manifest
├── service-worker.js    # Offline caching
└── LogoMain*.png        # App icons/logo
```

## ▶️ Run Locally

Because the app uses ES modules (`<script type="module">`), you should run it from a local HTTP server (not by double-clicking the HTML file).

### Option A: Python
```bash
cd nedaashealthcare
python -m http.server 8000
```
Open:
- `http://localhost:8000/user.html`
- `http://localhost:8000/admin.html`

### Option B: Node (serve)
```bash
cd nedaashealthcare
npx serve .
```

## 🔐 Demo Admin Credentials

Both the User-side Admin popup and the Admin portal lock screen use demo credentials:

- **Username:** `admin`
- **Password:** `admin`

## ⚙️ Configuration

In `user.js`:
- WhatsApp numbers:
  - `WHATSAPP_BASIC_NUMBER`
  - `WHATSAPP_PREMIUM_NUMBER`
- ChatGPT link:
  - `CHATGPT_LINK`

## 🗃️ Data Storage

All data is stored locally in the browser:
- Requests (user) are saved in **localStorage**.
- Admin session login is stored in **sessionStorage**.
- Theme and language preferences are stored in **localStorage**.
