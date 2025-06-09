// models/Bible.js
const mongoose = require('mongoose');

const bibleSchema = new mongoose.Schema({
  verseKey: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Bible', bibleSchema);