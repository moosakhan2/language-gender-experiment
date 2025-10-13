// ---------- Imports ----------
const express = require("express");
const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // ✅ moved here

// ---------- Firebase Admin ----------
initializeApp({
  storageBucket: "language-gender-experiment.firebasestorage.app",
});


// ---------- Express Setup ----------
const app = express();

// ✅ Simplified and bulletproof CORS setup
const allowedOrigins = [
  "https://language-gender-experiment.web.app",
  "https://language-gender-experiment.firebaseapp.com",
  "http://localhost:5000",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "false");

  if (req.method === "OPTIONS") {
    // 👈 Handle preflight requests directly
    return res.sendStatus(204);
  }

  next();
});
app.use(
  cors({
    origin: allowedOrigins,              // ✅ simpler and fully supported pattern
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,                  // ✅ Chrome-safe, no cookies shared
  })
);
app.options("*", cors({ origin: allowedOrigins })); // ✅ ensure preflights pass


// handle preflights globally
app.options("*", cors());

// ---------- Parse JSON ----------
app.use(express.json());

// ---------- Directory paths ----------
const publicDir = path.join(__dirname, "../public");
const imageDir = path.join(publicDir, "img");
const dataDir = path.join(__dirname, "../data");

// ---------- Utility functions ----------
function getImagePaths() {
  try {
    const files = fs.readdirSync(imageDir);
    return files.map((file) => `img/${file}`);
  } catch (err) {
    console.error("Error reading image directory:", err);
    return [];
  }
}

function getFilenames() {
  try {
    const files = fs.readdirSync(imageDir);
    return files.map((file) => {
      let name = path.parse(file).name;
      name = name.charAt(0).toUpperCase() + name.slice(1);
      return name.replace(/-/g, " ");
    });
  } catch (err) {
    console.error("Error reading filenames:", err);
    return [];
  }
}

// ---------- Routes ----------
app.get("/", (req, res) => {
  console.log("✅ Root endpoint hit");
  res.status(200).send("✅ Firebase Function is alive!");
});

app.post("/complete-experiment", (req, res) => {
  console.log("📩 /complete-experiment called");
  console.log(req.body);
  res.status(200).send("Experiment marked as completed");
});

app.post("/submit-data", async (req, res) => {
  console.log("📥 /submit-data called");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { prolificPID = "Test1", studyID = "Test2", sessionID = "Test3" } = req.body || {};
  const uniqueId = crypto.randomBytes(8).toString("hex");
  const fileName = `${prolificPID}_${studyID}_${sessionID}_${uniqueId}.json`;

  try {
    const bucket = getStorage().bucket();
    console.log("🪣 Using bucket:", bucket.name);

    const file = bucket.file(`responses/${fileName}`);
    console.log("📄 File path:", file.name);

    await file.save(JSON.stringify(req.body, null, 2), {
      contentType: "application/json",
      metadata: { firebaseStorageDownloadTokens: uniqueId },
    });

    console.log(`✅ Saved response: ${fileName}`);
    res.status(200).send("Data saved successfully");
  } catch (err) {
    console.error("❌ Error saving data:", err?.message || err);
    res.status(500).send("Failed to save data");
  }
});


app.get("/get-image-paths", (req, res) => {
  console.log("🖼 /get-image-paths hit");
  res.json(getImagePaths());
});

app.get("/get-filenames", (req, res) => {
  console.log("🔤 /get-filenames hit");
  res.json(getFilenames());
});

app.get("/get-data", (req, res) => {
  try {
    if (!fs.existsSync(dataDir)) return res.json([]);
    const files = fs.readdirSync(dataDir);
    const allData = files.map((file) =>
      JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf-8"))
    );
    res.json(allData);
  } catch (err) {
    console.error("Error reading data directory:", err);
    res.status(500).send("Failed to read data");
  }
});

// ---------- Export (v2 syntax for Node 22) ----------
exports.app = onRequest(
  { region: "us-central1", memory: "256MiB", timeoutSeconds: 60 },
  app
);
