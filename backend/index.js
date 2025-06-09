// backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const User = require('./models/User');
const Review = require('./models/Review');
const Note = require('./models/Note'); // Note 모델 추가

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in your .env file.');
  console.error('Please add JWT_SECRET=your_secret_key_here to your .env file.');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err, '\n연결 문자열을 확인해주세요.'));

app.use(express.json());

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id;
      next();
    } catch (error) {
      res.status(401).json({ message: '인증 실패, 토큰이 유효하지 않습니다.' });
    }
  } else {
    res.status(401).json({ message: '인증 실패, 토큰이 없습니다.' });
  }
};

// 회원가입
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({ message: '이미 존재하는 사용자 이름 또는 이메일입니다.' });
    }

    user = new User({
      username,
      password,
      email,
    });

    await user.save();
    res.status(201).json({ message: '회원가입이 성공적으로 완료되었습니다.' });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류 발생.' });
  }
});

// 로그인
app.post('/api/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: '사용자 이름/이메일과 비밀번호를 모두 입력해주세요.' });
  }

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      return res.status(400).json({ message: '잘못된 자격 증명입니다.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: '잘못된 자격 증명입니다.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      message: '로그인 성공',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ message: '서버 오류 발생.' });
  }
});

// 리뷰 작성
app.post('/api/reviews', protect, async (req, res) => {
  const { churchIdentifier, churchName, rating, content } = req.body;
  const userId = req.user;

  if (!churchIdentifier || !churchName || !rating || !content) {
    return res.status(400).json({ message: '모든 리뷰 필드를 입력해주세요.' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: '평점은 1에서 5 사이여야 합니다.' });
  }

  try {
    const user = await User.findById(userId).select('username');
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const existingReview = await Review.findOne({
      churchIdentifier: churchIdentifier,
      user: userId,
    });

    if (existingReview) {
      return res.status(409).json({ message: '이 교회에 대한 리뷰를 이미 작성하셨습니다.' });
    }

    const review = new Review({
      churchIdentifier,
      churchName,
      user: userId,
      username: user.username,
      rating,
      content,
    });

    await review.save();
    res.status(201).json({ message: '리뷰가 성공적으로 작성되었습니다.', review });
  } catch (error) {
    console.error('리뷰 작성 오류:', error);
    res.status(500).json({ message: '서버 오류 발생.' });
  }
});

// 특정 교회의 리뷰 가져오기
app.get('/api/reviews/church/:churchIdentifier', async (req, res) => {
  try {
    const reviews = await Review.find({ churchIdentifier: req.params.churchIdentifier }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('특정 교회 리뷰 가져오기 오류:', error);
    res.status(500).json({ message: '서버 오류 발생.' });
  }
});

// 모든 리뷰 가져오기
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('모든 리뷰 가져오기 오류:', error);
    res.status(500).json({ message: '서버 오류 발생.' });
  }
});

// 리뷰 삭제
app.delete('/api/reviews/:id', protect, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
    }

    if (!review.user.equals(userId)) {
      return res.status(403).json({ message: '자신이 작성한 리뷰만 삭제할 수 있습니다.' });
    }

    await review.deleteOne();
    res.json({ message: '리뷰가 삭제되었습니다.' });
  } catch (error) {
    console.error('리뷰 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류 발생.' });
  }
});

// 메모 관련 라우트 추가
// 특정 사용자의 모든 메모 가져오기
app.get('/api/notes', protect, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user });
    res.json(notes);
  } catch (error) {
    console.error('메모 가져오기 오류:', error);
    res.status(500).json({ message: '서버 오류 발생.' });
  }
});

// 메모 저장/수정
app.post('/api/notes', protect, async (req, res) => {
  try {
    const { verseKey, text } = req.body;
    
    const note = await Note.findOneAndUpdate(
      { userId: req.user, verseKey },
      { text },
      { upsert: true, new: true }
    );
    
    res.json(note);
  } catch (error) {
    console.error('메모 저장 오류:', error);
    res.status(500).json({ message: '서버 오류 발생.' });
  }
});

// 메모 삭제
app.delete('/api/notes/:verseKey', protect, async (req, res) => {
  try {
    await Note.findOneAndDelete({
      userId: req.user,
      verseKey: req.params.verseKey
    });
    res.json({ message: '메모가 삭제되었습니다.' });
  } catch (error) {
    console.error('메모 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류 발생.' });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});