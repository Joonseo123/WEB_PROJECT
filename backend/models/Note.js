// backend/models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verseKey: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

// userId와 verseKey의 조합이 유니크하도록 설정
noteSchema.index({ userId: 1, verseKey: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);