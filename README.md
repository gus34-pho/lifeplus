# Life Plus Support Services — Website

A full website for Life Plus Support Services with:
- 🌿 Professional NDIS-focused frontend
- 🤖 Lila AI chatbot (powered by Claude)
- 📩 Contact enquiry form
- 📅 Client booking system
- 🔒 Secure backend API (Node.js/Express)

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Then open `.env` and replace `your_anthropic_api_key_here` with your real key.

Get your API key from: https://console.anthropic.com/

### 3. Run the server
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

### 4. Open the website
Visit: **http://localhost:3000**

---

## Project Structure
```
life-plus-website/
├── server.js          ← Backend API (Express)
├── package.json
├── .env               ← Your API key (create from .env.example)
├── .env.example       ← Template
└── public/
    └── index.html     ← Frontend website
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Lila AI chatbot |
| POST | `/api/contact` | Contact form submission |
| POST | `/api/booking` | Booking form submission |

---

## Deploying to Production

### Option A — Render (free)
1. Push this folder to GitHub
2. Go to render.com → New Web Service
3. Connect your repo, set `npm start` as the start command
4. Add `ANTHROPIC_API_KEY` as an environment variable

### Option B — Railway
1. Push to GitHub
2. Go to railway.app → New Project from GitHub
3. Add `ANTHROPIC_API_KEY` in the Variables tab

### Option C — VPS (DigitalOcean, Vultr, etc.)
1. Upload files, run `npm install`
2. Use PM2 to keep it running: `pm2 start server.js`
3. Point your domain with Nginx as a reverse proxy

---

## Adding Email Notifications (Production)
To receive contact/booking submissions by email, install Nodemailer or Resend:

```bash
npm install nodemailer
```

Then add to `server.js` inside the `/api/contact` and `/api/booking` routes.

---

## Customise
- **Phone/email/ABN**: Update in `public/index.html` footer
- **Chatbot personality**: Edit `SYSTEM_PROMPT` in `server.js`
- **Colours**: Change CSS variables in `public/index.html`
