// router.jsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';  // 위에서 만든 Layout 컴포넌트
import Index from './pages/index/Index';
import Cost from './pages/cost/Cost';
import Insurance from './pages/insurance/Insurance';
import Account from './pages/account/Account';
import Price from './pages/price/Price';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import Family from './pages/family/Family';
import MyPage from './pages/mypage/MyPage';
import Reward from './pages/reward/Reward';
import Hospital from './pages/hospital/Hospital'
import VideoRoomComponent from './pages/video/components/VideoRoomComponent';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,  // Layout이 공통적으로 사용됨
    children: [
      {
        path: '/',
        element: <Index />,  // 기본 페이지
      },
      {
        path: '/account',
        element: <Account/>, 
      },
      {
        path: '/cost',
        element: <Cost/>, 
      },
      {
        path: '/insurance',
        element: <Insurance/>, 
      },
      {
        path: '/price',
        element: <Price/>, 
      },
      {
        path: '/family',
        element: <Family/>, 
      },
      {
        path: '/signup',
        element: <Signup/>, 
      },
      {
        path: '/login',
        element: <Login/>, 
      },
      {
        path: '/mypage',
        element: <MyPage/>, 
      },
      {
        path: '/reward',
        element: <Reward/>, 
      },
      {
        path: '/join/:medAccountId',
        element: <Family />
      },
      {
        path: '/hospital/:reservationId',
        element: <Hospital />
      },
      // {
      //   path: '/hospital/:reservationId',
      //   element: <VideoRoomComponent />
      // },
    ],
  },
]);

export default router;
