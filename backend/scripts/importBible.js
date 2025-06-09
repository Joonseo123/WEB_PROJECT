// scripts/importBible.js
const mongoose = require('mongoose');
const fs = require('fs');
const Bible = require('../models/Bible');

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/bible', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// bible.json 파일 읽기
const bibleData = JSON.parse(fs.readFileSync('./frontend/public/bible.json', 'utf8'));

// 데이터 변환 및 저장
async function importBibleData() {
  try {
    // 기존 데이터 삭제 (선택사항)
    await Bible.deleteMany({});

    // 데이터 변환 및 저장
    const bibleEntries = Object.entries(bibleData).map(([verseKey, text]) => ({
      verseKey,
      text
    }));

    await Bible.insertMany(bibleEntries);
    console.log('성경 데이터가 성공적으로 저장되었습니다.');
  } catch (error) {
    console.error('데이터 저장 중 오류 발생:', error);
  } finally {
    mongoose.connection.close();
  }
}

importBibleData();