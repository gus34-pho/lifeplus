require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const CONTENT_FILE = path.join(__dirname, "data/content.json");
const SUBMISSIONS_FILE = path.join(__dirname, "data/submissions.json");

function readJSON(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }

// ── ADMIN AUTH ──────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lifeplus2026";
const sessions = new Set();

function requireAuth(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (!token || !sessions.has(token)) return res.status(401).json({ error: "Unauthorised." });
  next();
}

app.post("/admin/login", (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString("hex");
    sessions.add(token);
    res.json({ success: true, token });
  } else res.status(401).json({ error: "Incorrect password." });
});

app.post("/admin/logout", (req, res) => {
  sessions.delete(req.headers["x-admin-token"]);
  res.json({ success: true });
});

// ── CONTENT API ─────────────────────────────────────────────────────────────
app.get("/admin/content", requireAuth, (req, res) => res.json(readJSON(CONTENT_FILE)));

app.put("/admin/content/hero", requireAuth, (req, res) => {
  const c = readJSON(CONTENT_FILE);
  c.hero = { ...c.hero, ...req.body };
  writeJSON(CONTENT_FILE, c); res.json({ success: true });
});

app.put("/admin/content/services/:index", requireAuth, (req, res) => {
  const c = readJSON(CONTENT_FILE); const i = parseInt(req.params.index);
  if (i < 0 || i >= c.services.length) return res.status(400).json({ error: "Invalid index" });
  c.services[i] = { ...c.services[i], ...req.body };
  writeJSON(CONTENT_FILE, c); res.json({ success: true });
});

app.post("/admin/content/services", requireAuth, (req, res) => {
  const c = readJSON(CONTENT_FILE);
  c.services.push({ icon: "⭐", title: "New Service", description: "Description.", ...req.body });
  writeJSON(CONTENT_FILE, c); res.json({ success: true });
});

app.delete("/admin/content/services/:index", requireAuth, (req, res) => {
  const c = readJSON(CONTENT_FILE);
  c.services.splice(parseInt(req.params.index), 1);
  writeJSON(CONTENT_FILE, c); res.json({ success: true });
});

app.put("/admin/content/contact", requireAuth, (req, res) => {
  const c = readJSON(CONTENT_FILE);
  c.contact = { ...c.contact, ...req.body };
  writeJSON(CONTENT_FILE, c); res.json({ success: true });
});

app.put("/admin/content/chatbot", requireAuth, (req, res) => {
  const c = readJSON(CONTENT_FILE);
  c.chatbot = { ...c.chatbot, ...req.body };
  writeJSON(CONTENT_FILE, c); res.json({ success: true });
});

// ── SUBMISSIONS ─────────────────────────────────────────────────────────────
app.get("/admin/submissions", requireAuth, (req, res) => res.json(readJSON(SUBMISSIONS_FILE)));

app.delete("/admin/submissions/contacts/:index", requireAuth, (req, res) => {
  const d = readJSON(SUBMISSIONS_FILE);
  d.contacts.splice(parseInt(req.params.index), 1);
  writeJSON(SUBMISSIONS_FILE, d); res.json({ success: true });
});

app.delete("/admin/submissions/bookings/:index", requireAuth, (req, res) => {
  const d = readJSON(SUBMISSIONS_FILE);
  d.bookings.splice(parseInt(req.params.index), 1);
  writeJSON(SUBMISSIONS_FILE, d); res.json({ success: true });
});

// ── PUBLIC CONTENT ───────────────────────────────────────────────────────────
app.get("/api/content", (req, res) => res.json(readJSON(CONTENT_FILE)));

// ── CHATBOT ──────────────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "messages array required" });
  const content = readJSON(CONTENT_FILE);
  const systemPrompt = content.chatbot?.prompt || "You are a helpful assistant for Life Plus Support Services.";
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemPrompt, messages }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "Chatbot error." });
    res.json({ reply: data.content?.map(b => b.text || "").join("") || "" });
  } catch { res.status(500).json({ error: "Unable to connect to chatbot." }); }
});

// ── CONTACT FORM ─────────────────────────────────────────────────────────────
app.post("/api/contact", (req, res) => {
  const { firstName, lastName, email, phone, role, message } = req.body;
  if (!firstName || !email) return res.status(400).json({ error: "Name and email required." });
  const d = readJSON(SUBMISSIONS_FILE);
  d.contacts.unshift({ firstName, lastName, email, phone, role, message, date: new Date().toISOString() });
  writeJSON(SUBMISSIONS_FILE, d);
  console.log(`📩 Contact: ${firstName} ${lastName} <${email}>`);
  res.json({ success: true });
});

// ── BOOKING FORM ──────────────────────────────────────────────────────────────
app.post("/api/booking", (req, res) => {
  const { firstName, lastName, email, phone, date, time, format, service } = req.body;
  if (!firstName || !email || !date || !time) return res.status(400).json({ error: "Required fields missing." });
  const d = readJSON(SUBMISSIONS_FILE);
  d.bookings.unshift({ firstName, lastName, email, phone, date, time, format, service, submittedAt: new Date().toISOString() });
  writeJSON(SUBMISSIONS_FILE, d);
  console.log(`📅 Booking: ${firstName} ${lastName} — ${date} at ${time}`);
  res.json({ success: true });
});

// ── STATIC FILES ──────────────────────────────────────────────────────────────
app.use("/admin", express.static(path.join(__dirname, "admin")));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Life Plus running at http://localhost:${PORT}`);
  console.log(`   Frontend: http://localhost:${PORT}`);
  console.log(`   Admin:    http://localhost:${PORT}/admin\n`);
});

// ── LOGO UPLOAD ───────────────────────────────────────────────────────────────
const multer = require("multer");
const upload = multer({
  dest: path.join(__dirname, "public/"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Images only"));
  }
});

app.post("/admin/upload-logo", requireAuth, upload.single("logo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const ext = req.file.originalname.split(".").pop();
  const newPath = path.join(__dirname, "public/logo." + ext);
  fs.renameSync(req.file.path, newPath);
  res.json({ success: true, url: "/logo." + ext });
});
