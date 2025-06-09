import React from 'react';
import Hero from './Hero';
// import Forum from './Forum'; // 기존 Forum 컴포넌트 임포트 제거 또는 주석 처리
import ReviewBoard from '../ReviewBoard/ReviewBoard'; // ReviewBoard 컴포넌트 임포트
import Contact from './Contact';

const MainPage = () => {
  return (
    <div className='py-12'>
      <Hero />
      {/* 기존 Forum 컴포넌트 대신 ReviewBoard 컴포넌트를 렌더링합니다. */}
      <ReviewBoard />
      <Contact />
    </div>
  );
};

export default MainPage;
