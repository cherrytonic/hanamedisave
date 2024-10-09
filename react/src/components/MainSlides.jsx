import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import Clipboard from '../assets/images/clipboard.svg'
import Donut from '../assets/images/donut.svg'
import Piggy from '../assets/images/Piggy bank.svg'
import Talk from '../assets/images/talk.svg'
import Marker from '../assets/images/marker.svg'
import './MainSlides.css';

const slides = [
    {
      image: Donut,
      text1: "자산 분석",
      text2: "내 보유 자산, 확인해보세요!",
      text3: "보유 하나은행 예금, 적금을 분석합니다.",
      bgColor: "#F5F5F5"
    },
    {
      image: Piggy,
      text1: "건강 저축",
      text2: "의료비, 목표만큼 모아보세요!",
      text3: "목표하는 치료비를 건강 저축합니다.",
      bgColor: "#E6E6FA"
    },
    {
      image: Talk,
      text1: "메디포인트 신청",
      text2: "포인트 받고 건강 더해보세요!",
      text3: "목표한 치료 받으면 포인트를 받습니다.",
      bgColor: "#FFE4E1"
    },
    {
      image: Marker,
      text1: "진료비 비교",
      text2: "알뜰하게 병원을 비교해보세요!",
      text3: "병원 비급여 진료비를 보여드립니다.",
      bgColor: "#F5F5F5"
    },
    {
      image: Clipboard,
      text1: "진료 예약",
      text2: "병원 진료 예약도 한번에!",
      text3: "제휴 병원 비대면 상담 예약을 제공합니다.",
      bgColor: "#FFE4E1"
    }
  ];

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};


export const MainSlides = () => {
  //   useEffect(() => {
  //     // 컴포넌트가 마운트될 때 body에 스타일 적용
  //     document.body.style.overflow = 'hidden';

  //     // 컴포넌트가 언마운트될 때 스타일 제거
  //     return () => {
  //         document.body.style.overflow = 'auto';
  //     };
  // }, []);
    const [[page, direction], setPage] = useState([0, 0]);
  
    const slideIndex = wrap(0, slides.length, page);
  
    const paginate = (newDirection) => {
      setPage([page + newDirection, newDirection]);
    };
    useEffect(() => {
      const interval = setInterval(() => {
        paginate(1);
      }, 3000); // Change slide every 3 seconds
    
      return () => clearInterval(interval); // Clean up the interval on component unmount
    }, [page]);
  return (
    <div className="slider-container rounded-lg overflow-x-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          className="w-full h-full"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        >
        <div className="flex items-start justify-center h-full" style={{ backgroundColor: slides[slideIndex].bgColor, borderRadius: '20px'}}>
          <div
            className="flex items-center w-full h-full py-8 pl-8 "
            
          >
            {/* Text Section */}
            <div className="">
              <p className="ml-10 text-2xl mb-10">{slides[slideIndex].text1}</p>
              <h2 className="ml-10 text-4xl font-bold text-left">{slides[slideIndex].text2}</h2>
              <p className="ml-10 text-xl my-10">{slides[slideIndex].text3}</p>
            </div>
          </div>
          <div className="flex items-center justify-center w-full h-[50vh] p-8 ">
            {/* Image Section */}
            <div className="w-[350px] flex justify-end items-center">
              <img
                src={slides[slideIndex].image}
                alt={`Slide ${slideIndex + 1}`}
                className=""
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>

    {/* 슬라이드 네비게이션 버튼 */}
    <div className="next" onClick={() => paginate(1)}>
      {"‣"}
    </div>
    <div className="prev" onClick={() => paginate(-1)}>
      {"‣"}
    </div>
  </div>
  );
};

export default MainSlides;
