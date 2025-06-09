    // backend/models/Review.js
    const mongoose = require('mongoose');

    const reviewSchema = new mongoose.Schema({
      churchIdentifier: { // 교회를 식별할 수 있는 고유 값 (예: 교회 이름 또는 ID)
        type: String,
        required: true,
        trim: true,
      },
      churchName: { // 리뷰가 작성된 교회의 이름 (표시용)
        type: String,
        required: true,
        trim: true,
      },
      user: { // 리뷰를 작성한 사용자 ID (인증 후 가져올 예정)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User 모델을 참조
        required: true,
      },
      username: { // 리뷰 작성자의 사용자 이름 (표시용)
        type: String,
        required: true,
        trim: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      content: {
        type: String,
        required: true,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    const Review = mongoose.model('Review', reviewSchema);

    module.exports = Review;