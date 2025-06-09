// frontend/src/Page/ChurchSearch/ChurchSearch.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import
import churchBanner from '../../assets/searchImage.png';

const ChurchSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [churches, setChurches] = useState([]);
  const [filteredChurches, setFilteredChurches] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 초기화

  useEffect(() => {
    fetch('/church-list.json')
      .then((res) => res.json())
      .then((data) => {
        const realData = data
          .slice(2)
          .filter(
            (row) =>
              row['Column5'] &&
              row['Column5'].includes('개신교') &&
              typeof row['디비리아( http://dbria.kr )'] === 'string'
          );
        setChurches(realData);
        setFilteredChurches(realData);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    let results = [...churches];
    const keyword = searchTerm.replace(/\s/g, '').toLowerCase();

    if (keyword) {
      results = results.filter(
        (church) =>
          (church['디비리아( http://dbria.kr )'] &&
            church['디비리아( http://dbria.kr )']
              .replace(/\s/g, '')
              .toLowerCase()
              .includes(keyword)) ||
          (church['Column2'] &&
            church['Column2']
              .replace(/\s/g, "'")
              .toLowerCase()
              .includes(keyword)) ||
          (church['Column3'] &&
            church['Column3']
              .replace(/\s/g, "'")
              .toLowerCase()
              .includes(keyword))
      );
    }
    if (location) {
      results = results.filter(
        (church) => church['Column6'] && church['Column6'].includes(location)
      );
    }
    setFilteredChurches(results);
  };

  // 리뷰 작성 버튼 클릭 핸들러
  const handleWriteReview = (churchIdentifier, churchName) => {
    // 교회 식별자를 URL 파라미터로 넘겨줍니다.
    // URL에 특수 문자가 포함될 수 있으므로 encodeURIComponent를 사용합니다.
    navigate(`/review-submission/${encodeURIComponent(churchIdentifier)}`, {
      state: { churchName },
    });
  };

  return (
    <div className='container mx-auto px-4 py-40 max-w-7xl'>
      <h1 className='text-4xl font-extrabold text-gray-900 mb-8 text-center'>
        교회 검색
      </h1>
      <img
        src={churchBanner}
        alt='교회 이미지'
        className='w-full h-auto mb-8 rounded-lg shadow-lg'
      />
      <div className='bg-white p-6 rounded-lg shadow-lg mb-8'>
        <h2 className='text-2xl font-bold mb-6 text-gray-800'>교회 찾기</h2>
        <form onSubmit={handleSearch} className='space-y-4'>
          <input
            type='text'
            placeholder='교회명 또는 주소로 검색'
            className='w-full p-3 border border-gray-300 rounded-lg'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className='w-full p-3 border border-gray-300 rounded-lg'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value=''>전체 지역</option>
            <option value='서울'>서울</option>
            <option value='경기도'>경기도</option>
            <option value='부산'>부산</option>
            <option value='대구'>대구</option>
            <option value='인천'>인천</option>
            <option value='광주'>광주</option>
            <option value='대전'>대전</option>
            <option value='울산'>울산</option>
            <option value='세종'>세종</option>
            <option value='강원도'>강원도</option>
            <option value='충청북도'>충청북도</option>
            <option value='충청남도'>충청남도</option>
            <option value='전라북도'>전라북도</option>
            <option value='전라남도'>전라남도</option>
            <option value='경상북도'>경상북도</option>
            <option value='경상남도'>경상남도</option>
            <option value='제주도'>제주도</option>
          </select>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-3 rounded-lg font-bold'
          >
            검색하기
          </button>
        </form>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <h3 className='text-xl font-bold mb-4 text-gray-800'>검색 결과</h3>
        {filteredChurches.length === 0 ? (
          <p className='text-gray-500'>검색 결과가 없습니다.</p>
        ) : (
          <ul>
            {filteredChurches.map((church, idx) => (
              <li key={idx} className='mb-4 border-b pb-2'>
                <div className='font-bold text-lg'>
                  {church['디비리아( http://dbria.kr )']}
                </div>
                <div className='text-gray-700'>
                  주소: {church['Column2']}
                  {church['Column3'] ? ` (${church['Column3']})` : ''}
                </div>
                {church['Column4'] && (
                  <div className='text-gray-700'>
                    전화번호: {church['Column4']}
                  </div>
                )}
                <div className='text-gray-500 text-sm'>
                  지역: {church['Column6']} {church['Column7']}
                </div>
                <button
                  onClick={() =>
                    handleWriteReview(
                      church['디비리아( http://dbria.kr )'],
                      church['디비리아( http://dbria.kr )']
                    )
                  }
                  className='mt-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300'
                >
                  리뷰 작성
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChurchSearch;
