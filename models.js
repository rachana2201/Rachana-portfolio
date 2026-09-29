const mongoose = require('mongoose');

const Project = mongoose.model('Project', new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  tech: [String],
  liveUrl: String,
  repoUrl: String,
  featured: { type: Boolean, default: false },
}, { timestamps: true }));

const Message = mongoose.model('Message', new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, maxlength: 200 },
  body: { type: String, required: true, maxlength: 2000 },
}, { timestamps: true }));

module.exports = { Project, Message };
