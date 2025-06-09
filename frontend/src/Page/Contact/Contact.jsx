// frontend/src/Page/Contact/Contact.jsx
import React, { useState, useEffect } from 'react';
import churchBanner from '../../assets/searchImage.png';

const Bible = () => {
  const [bibleData, setBibleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const versesPerPage = 20;
  const [notes, setNotes] = useState({});
  const [editingNote, setEditingNote] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  // 로그인 상태 확인 및 메모 불러오기
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // 토큰에서 사용자 ID 추출
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id);
        // 사용자별 저장된 페이지 불러오기
        const savedPage = localStorage.getItem(`lastReadPage_${payload.id}`);
        if (savedPage) {
          setCurrentPage(parseInt(savedPage));
        }
      } catch (error) {
        console.error('토큰 파싱 중 오류 발생:', error);
      }
      fetchNotes();
    }
  }, []);

  // 로그인한 사용자의 경우에만 페이지 저장
  useEffect(() => {
    if (isAuthenticated && userId) {
      localStorage.setItem(`lastReadPage_${userId}`, currentPage.toString());
    }
  }, [currentPage, isAuthenticated, userId]);

  // 성경 데이터 로드
  useEffect(() => {
    const fetchBibleData = async () => {
      try {
        const response = await fetch('/bible.json');
        if (!response.ok) {
          throw new Error('성경 데이터를 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setBibleData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBibleData();
  }, []);

  // 메모 불러오기
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const notesMap = {};
        data.forEach((note) => {
          notesMap[note.verseKey] = note.text;
        });
        setNotes(notesMap);
      }
    } catch (error) {
      console.error('메모를 불러오는데 실패했습니다:', error);
    }
  };

  // 현재 페이지의 구절들만 가져오기
  const getCurrentVerses = () => {
    const verses = Object.entries(bibleData);
    const startIndex = (currentPage - 1) * versesPerPage;
    const endIndex = startIndex + versesPerPage;
    return verses.slice(startIndex, endIndex);
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(Object.keys(bibleData).length / versesPerPage);

  // 메모 저장
  const saveNote = async (verseKey, text) => {
    if (!isAuthenticated) {
      alert('메모를 저장하려면 로그인이 필요합니다.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ verseKey, text }),
      });

      if (response.ok) {
        setNotes((prev) => ({
          ...prev,
          [verseKey]: text,
        }));
        setEditingNote(null);
      } else {
        alert('메모 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('메모 저장 중 오류 발생:', error);
      alert('메모 저장에 실패했습니다.');
    }
  };

  // 메모 삭제
  const deleteNote = async (verseKey) => {
    if (!isAuthenticated) {
      alert('메모를 삭제하려면 로그인이 필요합니다.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/notes/${verseKey}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotes((prev) => {
          const newNotes = { ...prev };
          delete newNotes[verseKey];
          return newNotes;
        });
      } else {
        alert('메모 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('메모 삭제 중 오류 발생:', error);
      alert('메모 삭제에 실패했습니다.');
    }
  };

  if (loading)
    return (
      <div className='container mx-auto px-4 py-40 max-w-7xl text-center'>
        성경 데이터를 불러오는 중입니다...
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
        온라인 성경
      </h1>
      <img
        src={churchBanner}
        alt='성경 이미지'
        className='w-full h-auto mb-8 rounded-lg shadow-lg'
      />

      <div className='bg-white p-6 rounded-lg shadow-lg max-h-[70vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-xl font-bold text-gray-800'>성경 구절</h3>
          {isAuthenticated && (
            <span className='text-sm text-gray-500'>
              마지막으로 읽은 페이지: {currentPage}페이지
            </span>
          )}
        </div>
        <div className='space-y-6'>
          {getCurrentVerses().map(([verseKey, text], index) => (
            <div key={index} className='border-b pb-4'>
              <p className='text-gray-700 mb-2'>
                <span className='font-semibold text-blue-700'>{verseKey}</span>{' '}
                - {text}
              </p>

              {/* 메모 섹션 */}
              <div className='mt-2'>
                {editingNote === verseKey ? (
                  <div className='flex flex-col gap-2'>
                    <textarea
                      value={notes[verseKey] || ''}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [verseKey]: e.target.value,
                        }))
                      }
                      className='w-full p-2 border rounded'
                      rows='3'
                      placeholder='메모를 입력하세요...'
                    />
                    <div className='flex gap-2'>
                      <button
                        onClick={() => saveNote(verseKey, notes[verseKey])}
                        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingNote(null)}
                        className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col gap-2'>
                    {notes[verseKey] && (
                      <div className='bg-yellow-50 p-3 rounded border border-yellow-200'>
                        <p className='text-gray-700'>{notes[verseKey]}</p>
                      </div>
                    )}
                    {isAuthenticated ? (
                      <div className='flex gap-2'>
                        <button
                          onClick={() => setEditingNote(verseKey)}
                          className='text-sm text-blue-500 hover:text-blue-700'
                        >
                          {notes[verseKey] ? '메모 수정' : '메모 추가'}
                        </button>
                        {notes[verseKey] && (
                          <button
                            onClick={() => deleteNote(verseKey)}
                            className='text-sm text-red-500 hover:text-red-700'
                          >
                            메모 삭제
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className='text-sm text-gray-500'>
                        메모를 작성하려면 로그인이 필요합니다.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className='mt-8 flex justify-center gap-2'>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'
          >
            이전
          </button>
          <span className='px-4 py-2'>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bible;
