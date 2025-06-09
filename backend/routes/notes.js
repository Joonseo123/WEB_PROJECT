// backend/routes/notes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// 모든 라우트에 인증 미들웨어 추가
router.use(auth);

// 특정 사용자의 모든 메모 가져오기
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 메모 저장/수정
router.post('/', async (req, res) => {
  try {
    const { verseKey, text } = req.body;
    
    const note = await Note.findOneAndUpdate(
      { userId: req.userId, verseKey },
      { text },
      { upsert: true, new: true }
    );
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 메모 삭제
router.delete('/:verseKey', async (req, res) => {
  try {
    await Note.findOneAndDelete({
      userId: req.userId,
      verseKey: req.params.verseKey
    });
    res.json({ message: '메모가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;