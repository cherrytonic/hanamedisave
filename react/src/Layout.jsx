// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Layout = () => {
  return (
    <div className="">
      <Navbar />  {/* 항상 표시될 Navbar */}
      <Outlet />  {/* 현재 경로에 해당하는 자식 컴포넌트를 렌더링 */}
      <Footer />
    </div>
  );
};

export default Layout;
