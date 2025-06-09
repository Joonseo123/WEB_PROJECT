import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import churchBanner from '../../assets/searchImage.png';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const ReviewSubmission = () => {
  const { churchIdentifier } = useParams();
  const { state } = useLocation();
  const churchName = state?.churchName || decodeURIComponent(churchIdentifier);
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 컴포넌트 마운트 시 URL 파라미터에서 넘어온 교회 이름 디코딩 확인
  useEffect(() => {
    console.log(
      '교회 식별자 (디코딩됨):',
      decodeURIComponent(churchIdentifier)
    );
    console.log('교회 이름 (state에서):', state?.churchName);
    console.log('최종 사용할 교회 이름:', churchName);
  }, [churchIdentifier, state, churchName]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    setMessage('');
    setIsSuccess(false);
    setIsLoading(true); // 로딩 시작

    console.log('리뷰 제출 시도...');
    console.log('현재 평점:', rating);
    console.log('현재 리뷰 내용:', reviewContent);

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('리뷰를 작성하려면 로그인해야 합니다.');
      setIsSuccess(false);
      setIsLoading(false); // 로딩 종료
      return;
    }

    if (rating === 0 || !reviewContent.trim()) {
      setMessage('평점과 리뷰 내용을 입력해주세요.');
      setIsSuccess(false);
      setIsLoading(false); // 로딩 종료
      return;
    }

    // 최소 글자 수 유효성 검사 (예시: 10자 미만이면 제출 안 함)
    if (reviewContent.trim().length < 10) {
      setMessage('리뷰 내용은 최소 10자 이상이어야 합니다.');
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      // 프록시 설정을 사용하고 있다면, '/api/reviews'로 변경
      // 프록시 설정이 안 되어 있거나 문제가 있다면 'http://localhost:5000/api/reviews' 유지
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // JWT 토큰 포함
        },
        body: JSON.stringify({
          churchIdentifier: decodeURIComponent(churchIdentifier), // 디코딩하여 전송
          churchName,
          rating,
          content: reviewContent,
        }),
      });

      const data = await response.json();
      console.log('API 응답:', data); // 응답 데이터 로깅

      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setRating(0); // 폼 초기화
        setReviewContent(''); // 폼 초기화
        // 리뷰 작성 후 리뷰 게시판으로 이동
        setTimeout(() => {
          // 메시지를 잠시 보여준 후 이동
          navigate('/reviews-board');
        }, 1500); // 1.5초 후 이동
      } else {
        setMessage(data.message || '리뷰 작성에 실패했습니다.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('리뷰 작성 중 오류 발생:', error);
      setMessage('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false); // 로딩 종료 (성공이든 실패든)
    }
  };

  return (
    <div className='container mx-auto px-4 py-40 max-w-7xl'>
      <h1 className='text-4xl font-extrabold text-gray-900 mb-8 text-center'>
        리뷰 작성
      </h1>
      <img
        src={churchBanner}
        alt='교회 이미지'
        className='w-full h-auto mb-8 rounded-lg shadow-lg'
      />
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <h3 className='text-xl font-bold mb-4'>
          <span className='text-blue-600'>{churchName}</span>에 대한 리뷰 작성
        </h3>

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
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder='교회에 대한 경험을 공유해주세요 (최소 10자)'
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300'
            disabled={isLoading} // 로딩 중일 때 버튼 비활성화
          >
            {isLoading ? '등록 중...' : '리뷰 등록하기'}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              isSuccess ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmission;
