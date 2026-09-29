require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const { Project, Message } = require("./models");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50kb" }));
app.use(express.static(__dirname));
// Write routes need the ADMIN_KEY header; reading is public.
const admin = (req, res, next) =>
  process.env.ADMIN_KEY && req.get("x-admin-key") === process.env.ADMIN_KEY
    ? next()
    : res.status(401).json({ error: "Missing or wrong admin key." });

const wrap = (fn) => (req, res) =>
  fn(req, res).catch((e) => {
    console.error(e);
    res
      .status(e.name === "ValidationError" ? 400 : 500)
      .json({ error: e.message });
  });

app.get(
  "/api/projects",
  wrap(async (req, res) => {
    res.json(await Project.find().sort({ featured: -1, createdAt: -1 }));
  }),
);

app.post(
  "/api/projects",
  admin,
  wrap(async (req, res) => {
    res.status(201).json(await Project.create(req.body));
  }),
);

app.put(
  "/api/projects/:id",
  admin,
  wrap(async (req, res) => {
    const p = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    p ? res.json(p) : res.status(404).json({ error: "Project not found." });
  }),
);

app.delete(
  "/api/projects/:id",
  admin,
  wrap(async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }),
);

app.post(
  "/api/contact",
  wrap(async (req, res) => {
    const { name, email, body } = req.body;
    await Message.create({ name, email, body });
    res.status(201).json({ ok: true });
  }),
);

app.get(
  "/api/messages",
  admin,
  wrap(async (req, res) => {
    res.json(await Message.find().sort({ createdAt: -1 }));
  }),
);

const port = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() =>
    app.listen(port, () => console.log(`Running on http://localhost:${port}`)),
  )
  .catch((e) => {
    console.error("Database connection failed:", e.message);
    process.exit(1);
  });
