// routes/bible.js
const express = require('express');
const router = express.Router();
const Bible = require('../models/Bible');

// 특정 구절 검색
router.get('/verse/:book/:chapter/:verse', async (req, res) => {
  try {
    const { book, chapter, verse } = req.params;
    const verseKey = `${book}${chapter}:${verse}`;
    
    const verseData = await Bible.findOne({ verseKey });
    
    if (!verseData) {
      return res.status(404).json({ message: '구절을 찾을 수 없습니다.' });
    }
    
    res.json(verseData);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 장 전체 검색
router.get('/chapter/:book/:chapter', async (req, res) => {
  try {
    const { book, chapter } = req.params;
    const regex = new RegExp(`^${book}${chapter}:`);
    
    const verses = await Bible.find({ verseKey: regex });
    
    if (verses.length === 0) {
      return res.status(404).json({ message: '장을 찾을 수 없습니다.' });
    }
    
    res.json(verses);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;