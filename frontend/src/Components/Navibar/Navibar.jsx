import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navibar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    setIsLoggedIn(!!token);
    setUsername(storedUsername || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className='fixed w-full z-50 bg-white shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
        <div>
          <Link to='/' className='text-2xl font-bold text-blue-600'>
            교회 찾기
          </Link>
        </div>

        <div className='hidden md:block'>
          <div className='ml-10 flex items-baseline space-x-4'>
            <Link
              to='/'
              className='text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium'
            >
              메인
            </Link>
            <Link
              to='/leadership'
              className='text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium'
            >
              교회 검색
            </Link>
            <Link
              to='/reviews-board'
              className='text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium'
            >
              교회 리뷰
            </Link>
            <Link
              to='/about'
              className='text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium'
            >
              소개
            </Link>
            {/* "연락처" 텍스트를 "성경"으로 변경 */}
            <Link
              to='/contact'
              className='text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium'
            >
              성경
            </Link>
          </div>
        </div>

        <div className='hidden md:flex items-center space-x-4'>
          {isLoggedIn ? (
            <>
              {username && (
                <span className='text-gray-800 text-base font-medium'>
                  {username}님 환영합니다!
                </span>
              )}
              <button
                onClick={handleLogout}
                className='px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-300'
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to='/register'
                className='px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300'
              >
                회원가입
              </Link>
              <Link
                to='/login'
                className='px-4 py-2 border border-blue-600 text-base font-medium rounded-md text-blue-600 hover:bg-blue-50 transition-colors duration-300'
              >
                로그인
              </Link>
            </>
          )}
        </div>

        <div className='-mr-2 flex md:hidden'></div>
      </div>
    </nav>
  );
};

export default Navibar;
