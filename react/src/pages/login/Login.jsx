import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import http from '../../api/medisave'
import './Login.css'


function Login() {
    const navigate = useNavigate();
    const [id, setId] = useState(null);
    const [password, setPassword] = useState(null);
    const signIn = async (e) => {
        e.preventDefault(); 
        const params = {
          memberId: id,
          memberPw: password,
        }
        try {
          const response = await http.post(
            '/api/members/login',
            params,  // 데이터를 JSON 형식으로 전송
            {
              headers: {
                'Content-Type': 'application/json',  // JSON 형식 요청임을 명시
                Accept: 'application/json',
              },
            }
          );
          const data = await response.data;
          localStorage.setItem('user', JSON.stringify(data));
          navigate('/', { state: { user: data } });
        } catch (error) {
            console.error("로그인 오류:", error);
        } 
      }
    return (
      <div className="h-[65vh] flex items-center justify-center bg-[#E2F2EF]">
      <div className="bg-white shadow-lg rounded-lg flex overflow-hidden max-w-4xl w-full">
        {/* Left Side - Welcome Back Section */}
        <div className=" w-1/2 bg-gradient-to-bl from-[#1febc2] to-[#009275] p-10 flex flex-col justify-start text-white relative">
          <h2 className="text-4xl font-bold mb-4">로그인하고</h2>
          <h2 className="text-4xl font-bold mb-4">당신의 치료비를</h2>
          <h2 className="text-4xl font-bold mb-4">모아보세요!</h2>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#009178]">로그인</h2>
          <form onSubmit={signIn} className="space-y-5">
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="id"
                id="floating_id"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#009178] peer"
                onChange={(e) => setId(e.target.value)}
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_id"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 peer-focus:font-medium peer-focus:text-[#009178] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                아이디
              </label>
            </div>

            <div className="relative z-0 w-full group">
              <input
                type="password"
                name="password"
                id="floating_password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#009178] peer"
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_password"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 peer-focus:font-medium peer-focus:text-[#009178] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                비밀번호
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#009178] text-white font-bold rounded-lg shadow-md hover:bg-[#007b63] transition duration-300"
            >
              로그인
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm">
              아직 하나메디세이브 계정이 없으신가요?{' '}
              <a href="/signup" className="text-[#009178] hover:underline">
                회원가입
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    );
}

export default Login;