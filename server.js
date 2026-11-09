require("dotenv").config();

const express = require("express");
const path = require("path");
const projectRoutes = require("./src/routes/projects");
const contactRoutes = require("./src/routes/contact");
const { testConnection } = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", async (_req, res) => {
  res.json({ status: "ok", service: "personal-portfolio-api" });
});

app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function start() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Portfolio running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to MySQL. Check your .env settings.");
    console.error(error.message);
    process.exit(1);
  }
}

start();
