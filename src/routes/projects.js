const express = require("express");
const { pool } = require("../config/db");
const requireAdmin = require("../middleware/adminAuth");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, title, description, technologies, project_url, github_url, image_url, featured, created_at FROM projects ORDER BY featured DESC, created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load projects." });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  const { title, description, technologies, project_url, github_url, image_url, featured } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required." });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO projects
       (title, description, technologies, project_url, github_url, image_url, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        String(title).trim(),
        String(description).trim(),
        Array.isArray(technologies) ? technologies.join(", ") : (technologies || ""),
        project_url || null,
        github_url || null,
        image_url || null,
        featured ? 1 : 0
      ]
    );
    res.status(201).json({ message: "Project created.", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create project." });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, technologies, project_url, github_url, image_url, featured } = req.body;
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Invalid project ID." });
  if (!title || !description) return res.status(400).json({ message: "Title and description are required." });

  try {
    const [result] = await pool.execute(
      `UPDATE projects SET title=?, description=?, technologies=?, project_url=?,
       github_url=?, image_url=?, featured=? WHERE id=?`,
      [
        String(title).trim(),
        String(description).trim(),
        Array.isArray(technologies) ? technologies.join(", ") : (technologies || ""),
        project_url || null,
        github_url || null,
        image_url || null,
        featured ? 1 : 0,
        id
      ]
    );
    if (!result.affectedRows) return res.status(404).json({ message: "Project not found." });
    res.json({ message: "Project updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update project." });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Invalid project ID." });

  try {
    const [result] = await pool.execute("DELETE FROM projects WHERE id=?", [id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Project not found." });
    res.json({ message: "Project deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to delete project." });
  }
});

module.exports = router;
