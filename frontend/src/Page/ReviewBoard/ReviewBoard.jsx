// frontend/src/Page/ReviewBoard/ReviewBoard.jsx (전체 코드)
import React, { useState, useEffect } from 'react';
import churchBanner from '../../assets/searchImage.png';

const ReviewBoard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // 현재 로그인한 사용자 ID 상태

  useEffect(() => {
    // 로컬 스토리지에서 현재 사용자 ID 가져오기
    const userId = localStorage.getItem('user_id');
    setCurrentUserId(userId);

    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError('리뷰를 불러오는 데 실패했습니다: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // 리뷰 삭제 핸들러
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인해야 리뷰를 삭제할 수 있습니다.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰 포함
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        // 삭제된 리뷰를 목록에서 제거하여 UI 업데이트
        setReviews(reviews.filter((review) => review._id !== reviewId));
      } else {
        alert(data.message || '리뷰 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 삭제 중 오류 발생:', error);
      alert('네트워크 오류 또는 서버에 연결할 수 없습니다.');
    }
  };

  if (loading)
    return (
      <div className='container mx-auto px-4 py-40 max-w-7xl text-center'>
        리뷰를 불러오는 중입니다...
      </div>
    );
  if (error)
    return (
      <div className='container mx-auto px-4 py-40 max-w-7xl text-center text-red-600'>
        {error}
      </div>
    );

  return (
    <div className='container mx-auto px-4 py-40 max-w-7xl'>
      <h1 className='text-4xl font-extrabold text-gray-900 mb-8 text-center'>
        교회 리뷰 게시판
      </h1>
      <img
        src={churchBanner}
        alt='교회 이미지'
        className='w-full h-auto mb-8 rounded-lg shadow-lg'
      />

      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <h3 className='text-xl font-bold mb-4 text-gray-800'>최신 리뷰</h3>
        {reviews.length === 0 ? (
          <p className='text-gray-500'>아직 작성된 리뷰가 없습니다.</p>
        ) : (
          <div className='space-y-6'>
            {reviews.map((review) => (
              <div key={review._id} className='border-b pb-4 last:border-b-0'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='font-bold text-lg text-blue-700'>
                    {review.churchName}
                  </span>
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className='text-gray-700 mb-2'>{review.content}</p>
                <div className='text-gray-500 text-sm flex justify-between items-center'>
                  <span>
                    작성자: {review.username} | 날짜:{' '}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                  {/* 삭제 버튼 조건부 렌더링 */}
                  {currentUserId && review.user === currentUserId && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className='ml-4 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors duration-300'
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewBoard;
