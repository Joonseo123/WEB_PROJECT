import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // 성공 여부를 추적하는 새로운 상태 추가
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // 메시지 초기화
    setIsSuccess(false); // 상태 초기화

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true); // 성공 시 true로 설정
        // 회원가입 성공 후 로그인 페이지 또는 메인 페이지로 리디렉션
        navigate('/login'); // 예를 들어, 로그인 페이지로 이동
      } else {
        setMessage(data.message || '회원가입에 실패했습니다.');
        setIsSuccess(false); // 실패 시 false로 설정
      }
    } catch (error) {
      console.error('회원가입 요청 중 오류 발생:', error);
      setMessage('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      setIsSuccess(false); // 오류 발생 시 false로 설정
    }
  };

  return (
    <div className='container mx-auto px-4 py-40 max-w-md'>
      <div className='bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-3xl font-bold mb-6 text-gray-800 text-center'>
          회원가입
        </h2>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='username'
            >
              사용자 이름
            </label>
            <input
              type='text'
              id='username'
              className='shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              placeholder='사용자 이름을 입력하세요'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='email'
            >
              이메일
            </label>
            <input
              type='email'
              id='email'
              className='shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              placeholder='이메일을 입력하세요'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            회원가입
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              isSuccess ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {' '}
            {/* isSuccess 상태 사용 */}
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
