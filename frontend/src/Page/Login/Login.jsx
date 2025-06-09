// frontend/src/Page/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // 프록시 설정을 사용하고 있다면, '/api/login'으로 변경
      // 프록시 설정이 안 되어 있거나 문제가 있다면 'http://localhost:5000/api/login' 유지
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('user_id', data.user.id); // 사용자의 고유 ID 저장
        navigate('/');
        window.location.reload();
      } else {
        setMessage(data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      setMessage('네트워크 오류 또는 서버에 연결할 수 없습니다.');
    }
  };

  return (
    <div className='container mx-auto px-4 py-40 max-w-md'>
      <div className='bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-3xl font-bold mb-6 text-gray-800 text-center'>
          로그인
        </h2>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='usernameOrEmail'
            >
              사용자 이름 또는 이메일
            </label>
            <input
              type='text'
              id='usernameOrEmail'
              className='shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              placeholder='사용자 이름 또는 이메일을 입력하세요'
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='password'
            >
              비밀번호
            </label>
            <input
              type='password'
              id='password'
              className='shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
              placeholder='비밀번호를 입력하세요'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300'
          >
            로그인
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes('성공') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
