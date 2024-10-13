import React from "react";
import Logo from '../assets/images/gradientLogo.png'

const Footer = () => {
  return (
    <div className="bg-[#009178] text-white">
      <div className="mx-10 pt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div className="col-span-1">
          <div className="flex justify-start items-center">
            {/* <img
              src={Logo} // 로고 이미지 경로
              alt="Logo"
              className="h-14"
            /> */}
            <div className="ml-2 text-white">하나메디세이브</div>
          </div>
          {/* <h4 className="font-semibold text-xl mb-4">Company</h4>
          <ul>
            <li className="mb-2">
              <a href="#" className="hover:text-[#009178]">About Us</a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-[#009178]">Careers</a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-[#009178]">Contact</a>
            </li>
            <li>
              <a href="#" className="hover:text-[#009178]">Blog</a>
            </li>
          </ul> */}
        </div>

        {/* Column 2 */}
        <div className="col-span-1">
          <h4 className="font-semibold text-xl mb-4">서비스</h4>
          <ul>
            <li className="mb-2">
              <a href="/mypage" className="">내 적금</a>
            </li>
            <li className="mb-2">
              <a href="/account" className="">목표 적금</a>
            </li>
            <li className="mb-2">
              <a href="/reward" className="">메디포인트</a>
            </li>
            <li className="mb-2">
              <a href="/price" className="">병원 예약</a>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="col-span-1">
          <h4 className="font-semibold text-xl mb-4">정책</h4>
          <ul>
            <li className="mb-2">
              <a href="#" className="hover:text-[#009178]">사생활 보호 정책</a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-[#009178]">이용 약관</a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-[#009178]">쿠키 정책</a>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="col-span-1">
          <h4 className="font-semibold text-xl mb-4">Follow Us</h4>
          <div className="flex space-x-4">
          인천 서구 에코로 167 하나금융그룹 통합데이터센터 비전센터 5층
          </div>
        </div>
      </div>
      <div className="bg-[#009178] py-4 text-center text-sm">
        <p>&copy; 2024 하나메디세이브. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
