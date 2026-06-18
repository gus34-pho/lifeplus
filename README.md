# Life Plus Support Services

Official website for **Life Plus Support Services** — a compassionate disability support provider operating across Darwin and remote NT (Alice Springs, Katherine), launching soon in Queensland.

## 🌐 Live Website
[www.lifeplus-services.com](https://www.lifeplus-services.com)

## 📋 About
Life Plus Support Services provides person-centred NDIS disability support to participants across the Northern Territory. Founded by Richu and Augustine, we walk beside you in your journey toward independence, connection, and a life you choose.

## 📞 Contact
- **Phone:** 0432 692 261 — Augustine Antony
- **Email:** info@lifeplus-services.com
- **Address:** Muirhead NT, Darwin
- **Hours:** Mon–Sat 9am–5pm ACST
- **ABN:** 70 683 015 581

## 🩺 Our Services
- Personal Care
- Daily Living Support
- Community Participation
- Transport Assistance

## 🎨 Brand Colours
| Colour | Hex | Usage |
|--------|-----|-------|
| Blue | `#1A4FA0` | Primary buttons, headings, nav |
| Teal | `#2BBFBF` | Hero gradient, accents |
| Orange | `#F47920` | Highlights, nav call button |
| Dark | `#1C1C1C` | Body text |

## 📁 File Structure
```
├── index.html          ← Main homepage (self-contained, ready to deploy)
├── about.html          ← About Us page
├── services.html       ← Services page
├── ndis.html           ← NDIS Information page
├── careers.html        ← Careers & job applications
├── contact.html        ← Contact page
├── css/
│   └── style.css       ← Stylesheet
└── js/
    └── main.js         ← JavaScript
```

> **Note:** `index.html` has CSS and JS fully embedded — it works as a single file with no dependencies.

## 🚀 Deployment
- **Hosting:** GitHub Pages
- **Custom Domain:** www.lifeplus-services.com
- **DNS:** Managed via GoDaddy (CNAME pointing to GitHub Pages)

## ✏️ How to Update the Live Site

### Update index.html
1. Go to your GitHub repo
2. Click `index.html` → click ✏️ pencil icon
3. Select all (Ctrl+A) → delete → paste new code
4. Click **Commit changes** → site updates in ~30 seconds

### Add new pages
1. Click **Add file** → **Upload files**
2. Drag in the HTML files + `css/` and `js/` folders
3. Commit changes

## ⚙️ Backend (Coming Soon)
Node.js/Express backend with admin panel — to be deployed on Render.com.
- Contact form submissions
- Booking form submissions
- Admin dashboard

When ready, find this line in `index.html` and update:
```js
window.API_BASE = 'https://your-backend.onrender.com';
```
