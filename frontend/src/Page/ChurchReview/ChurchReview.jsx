import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import churchBanner from '../../assets/reviewImage.png'; // 이미지 import

const ChurchReview = ({ churchId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 리뷰 제출 로직 구현
  };

  return (
    <div className='container mx-auto px-4 py-40 max-w-7xl'>
      {' '}
      {/* 부모 div 추가 */}
      {/* "교회 리뷰" 문구 추가 */}
      <h1 className='text-4xl font-extrabold text-gray-900 mb-8 text-center'>
        교회 리뷰
      </h1>
      {/* 최상단 이미지 추가 및 크기 조정 */}
      <img
        src={churchBanner}
        alt='교회 이미지'
        className='w-full h-auto mb-8 rounded-lg shadow-lg'
      />
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        {' '}
        {/* 기존 div */}
        <h3 className='text-xl font-bold mb-4'>교회 리뷰 작성</h3>{' '}
        {/* 기존 제목은 h3 유지 */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-700 mb-2'>평점</label>
            <div className='flex gap-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`text-2xl cursor-pointer ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className='block text-gray-700 mb-2'>리뷰 내용</label>
            <textarea
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              rows='4'
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder='교회에 대한 경험을 공유해주세요'
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300'
          >
            리뷰 등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChurchReview;
