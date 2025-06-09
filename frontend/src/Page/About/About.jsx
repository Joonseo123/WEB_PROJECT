import React from 'react';
import ChurchImage2 from '../../assets/ChatGPT Image Jun 5, 2025, 12_16_22 AM.png';

const About = () => {
  return (
    <div className='container mx-auto px-4 py-40 max-w-7xl'>
      <div className='relative rounded-2xl overflow-hidden shadow-2xl mb-24'>
        <img src={ChurchImage2} className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900'></div>
        <div className='absolute bottom-8 left-8 text-white'>
          <h3 className='text-2xl font-bold mb-2'>교회 찾기</h3>
          <p className='text-base font-light'>안전한 교회를 찾아드립니다.</p>
        </div>
      </div>
      <div className='mb-24 max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold mb-8 text-slate-800 text-center'>
          웹 페이지 소개
        </h1>
        <div className='text-lg leading-relaxed text-gray-600 space-y-6'>
          <p>
            이 웹페이지는 신뢰할 수 있는 교회를 쉽게 찾을 수 있도록 돕기 위해
            만들어졌습니다. 교회를 처음 찾는 분들부터 새로운 신앙 공동체를 찾는
            분들까지, 모두에게 유용한 정보를 제공합니다. 안전하고 건강한
            신앙생활을 위한 첫걸음을 이곳에서 시작해보세요. 여러분의 교회 선택이
            더 이상 막막하지 않도록, 저희가 함께하겠습니다.
          </p>
          <p>
            우리는 지역사회와 신앙 공동체의 안전과 건강한 영적 성장을 최우선으로
            생각합니다. 교회의 투명성, 안전한 환경, 그리고 공동체 중심의 활동
            여부를 종합적으로 고려하여 정보를 제공합니다. 신뢰할 수 있는 교회를
            찾는 여정에 이 웹사이트가 좋은 길잡이가 되길 바랍니다.
          </p>
          <p>
            또한, 각 교회의 리뷰나 실제 방문자의 평가도 함께 제공되어 객관적인
            시각에서 교회를 선택하는 데 도움이 됩니다. 단순한 정보 전달을 넘어,
            신뢰 기반의 연결을 추구합니다.
          </p>
          <p>
            ‘안전한 교회 찾기’는 단순한 서비스가 아니라, 신앙의 여정을 함께하는
            동반자입니다. 누구나 안심하고 예배드릴 수 있는 교회를 찾는 데 이
            페이지가 작지만 의미 있는 도움이 되기를 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
