import './App.css';
import Navibar from './Components/Navibar/Navibar';

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import MainPage from './Page/MainPage/MainPage';
import About from './Page/About/About';
import ReviewSubmission from './Page/ChurchReview/ReviewSubmission'; // ReviewSubmission 컴포넌트
import ReviewBoard from './Page/ReviewBoard/ReviewBoard'; // ReviewBoard 컴포넌트 import
import Contact from './Page/Contact/Contact';
import ChurchDetail from './Page/ChurchDetail/ChurchDetail';
import ChurchSearch from './Page/ChurchSearch/ChurchSearch';
import Register from './Page/Register/Register';
import Login from './Page/Login/Login';

function Layout() {
  return (
    <>
      <Navibar />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/leadership', // 교회 검색 페이지
        element: <ChurchSearch />,
      },
      {
        path: '/reviews-board', // 기존 교회 리뷰 게시판 라우트
        element: <ReviewBoard />,
      },
      {
        path: '/review-submission/:churchIdentifier', // 리뷰 작성 페이지
        element: <ReviewSubmission />,
      },
      {
        path: '/our-services',
        element: <ChurchDetail />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      // 메인 페이지에 직접 연결되는 'board' 라우트가 현재 보이지 않습니다.
      // 만약 메인 페이지의 어떤 섹션에서 '/board' 경로로 이동한다면,
      // 그 부분의 Link to="/board"를 ReviewBoard로 변경해야 합니다.
      // 또는 기존 /board 경로의 컴포넌트를 ReviewBoard로 대체하는 것이 목표라면,
      // 아래와 같이 변경할 수 있습니다.
      // 예시: 기존에 /board가 Board 컴포넌트였다면,
      // {
      //   path: '/board',
      //   element: <ReviewBoard />, // Board 대신 ReviewBoard 연결
      // },
      // 이 경우, Navibar의 "교회 리뷰" 링크가 이미 "/reviews-board"로 변경되었으므로
      // 이 변경은 메인 페이지에서 "게시판"이라는 이름으로 Link가 있다면 해당 Link를 의미합니다.
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
