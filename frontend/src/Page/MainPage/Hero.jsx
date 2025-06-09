// frontend/src/Page/MainPage/Hero.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChurchImage from '../../assets/ChatGPT Image Jun 4, 2025, 10_09_42 PM.png';

const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(''); // 사용자 이름을 위한 상태

  const navigate = useNavigate();

  // 컴포넌트 마운트 시 또는 로컬 스토리지 변경 시 로그인 상태 및 사용자 이름 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username'); // 로컬 스토리지에서 사용자 이름 가져오기

    setIsLoggedIn(!!token);
    // storedUsername이 null이거나 undefined일 경우 빈 문자열로 설정하여 오류 방지
    setUsername(storedUsername || '');
  }, []);

  const handleSignUpClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className='relative min-h-[110vh] bg-gradient-to-b from-gray-50 to-white pb-0'>
      <div className='container mx-0 px-4 sm:px-6 lg:px-8 py-16 lg:py-44'>
        <div className='flex lg:flex-row items-center justify-between gap-12 min-h-screen'>
          <div className='flex-1 text-center lg:text-left'>
            <h1 className='text-3xl font-bold text-gray-900 leading-tight mb-6'>
              교회 웹사이트입니다.
              <span className='block text-blue-600 mt-2 lg:mt-6'>
                마음의 평안을 찾길 기원합니다.
              </span>
            </h1>
            <p className='text-lg text-gray-800 font-semibold mb-8 max-w-2xl mx-auto'>
              주변의 교회를 검색 및 리뷰할 수 있습니다.
            </p>
            <div className='flex flex-row gap-4 justify-center lg:justify-start'>
              {isLoggedIn ? (
                <span className='text-xl font-bold text-gray-800 py-4 px-8 bg-transparent'>
                  {username}님 환영합니다!
                </span>
              ) : (
                <>
                  <button
                    className='px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold shadow-lg hover:shadow-xl'
                    onClick={handleSignUpClick}
                  >
                    회원가입하기
                  </button>
                  <button
                    className='px-8 py-4 bg-white text-blue-600 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-300 text-lg font-semibold'
                    onClick={handleLoginClick}
                  >
                    로그인하기
                  </button>
                </>
              )}
            </div>
          </div>
          <div className='flex-1 w-full max-w-2xl lg:max-w-none'>
            <div className='relative'>
              <img
                src={ChurchImage}
                className='relatie rounded-2xl shadow-2xl w-full object-cover transform hover:scale-[1.02] transition-transform duration-300'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
