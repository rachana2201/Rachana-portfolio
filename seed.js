require("dotenv").config();

const mongoose = require("mongoose");
const { Project } = require("./models");

const projects = [
  {
    title: "Student Management System",
    description:
      "A Django-based student management application for managing students, teachers and academic information through a simple web interface.",
    tech: ["Python", "Django", "SQLite", "HTML", "CSS"],
    liveUrl: "",
    repoUrl: "https://github.com/rachana2201/Student-Management-System",
    featured: true,
  },

  {
    title: "Finance Tracker",
    description:
      "A personal finance management application designed to track income, expenses and overall spending in an organized way.",
    tech: ["JavaScript", "HTML", "CSS", "Django"],
    liveUrl: "",
    repoUrl: "https://github.com/rachana2201/Finance-Tracker",
    featured: false,
  },

  {
    title: "Pulse Gallery",
    description:
      "A responsive image gallery with search and infinite scrolling for continuously loading and exploring images.",
    tech: ["JavaScript", "HTML", "CSS", "API"],
    liveUrl: "",
    repoUrl: "https://github.com/rachana2201/pulse-gallery-infinite",
    featured: false,
  },
];

mongoose
  .connect(process.env.MONGODB_URI)

  .then(async () => {
    await Project.deleteMany({});

    await Project.insertMany(projects);

    console.log(`Seeded ${projects.length} projects successfully.`);
  })

  .catch((error) => {
    console.error("Seed error:", error.message);
  })

  .finally(() => {
    mongoose.disconnect();
  });
