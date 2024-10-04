/* eslint-disable */

import React, { useState, useEffect } from 'react';
import CloseBtn from '../../assets/images/CloseBtn.svg';
import './IdenModal.css';
import { useSelector, useDispatch } from 'react-redux';
import { idInfo } from '../../store/userSlice';
import http from '../../api/fastapi';
import Check from '../../assets/images/check.png'

function IdenModal({
  setIdenModal,
  setIdenComplete,
  inputname,
  inputResident1,
  inputResident2,
}) {
  const [imageSrc, setImageSrc] = useState('');
  const [imgfile, setFile] = useState('');
  const [name, setName] = useState('');
  const [resident1, setResident1] = useState('');
  const [resident2, setResident2] = useState('');
  const [msg, setmessage] = useState('');
  const dispatch = useDispatch();

  // fastapi의 idening를 실행시키기 위한 코드
  async function sendImg() {
    const formData = new FormData();  
    formData.append('inputname', inputname);
    formData.append('inputresident1', inputResident1);
    formData.append('inputresident2', inputResident2);
    formData.append('file', imgfile);
    await http({
      method: 'post',
      url: '/idenimg',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => {
        console.log(res);
        setmessage(res.data.message);
        setName(res.data.personalId.name);
        setResident1(res.data.personalId.resident1);
        setResident2(res.data.personalId.resident2);
        dispatch(idInfo(res.data));
      })
      .catch((err) => {
        console.log(err);
        console.log('fastapi로 이미지를 보내는데 실패했습니다.');
      });
  }

  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    setFile(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImageSrc(reader.result);
        resolve();
      };
    });
  };
  // 데이터가 변경되면 재렌더링 되게 하는 코드
  useEffect(() => {
    if (imgfile) {
      sendImg();
    }
  }, [imgfile]);
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    await encodeFileToBase64(file);
    const formData = new FormData();
    formData.append('file', file);
  };

  return (
    <div className="flex-col mx-auto">
      <p className="flex justify-end">
        <img
          onClick={() => setIdenModal(false)}
          src={CloseBtn}
          className="w-8 h-8"
          alt="닫기"
        />
      </p>
      <br />
      <br />
      <div>
        <p className="text-3xl text-left ml-9 leading-relaxed" style={{ marginLeft: '1rem' }}>
          본인
        </p>
      </div>
      <div>
        <p className="text-3xl text-left ml-9 leading-relaxed" style={{ marginLeft: '1rem' }}>
          확인
        </p>
        <h4 className="ml-3 mt-5">주민등록증 또는 운전면허증 사진을 올려주세요.</h4>
        <br />
      </div>
      <div className="mx-auto text-center flex">
        <div className="mx-auto mt-3">
          {!imageSrc && (
            <label htmlFor="imginput">
              <div className="fileinput" />
            </label>
          )}
          <input
            id="imginput"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
        </div>
      </div>
      <div>
        {imageSrc && <img src={imageSrc} alt="preview-img"  className="max-w-xs mx-auto mt-3" />}
      </div>
      <br />
      <div className='mx-auto'>
        {imageSrc && (
          <Result
            data={{
              name,
              resident1,
              resident2,
              msg
            }}
            setIdenModal={setIdenModal}
            setIdenComplete={setIdenComplete}
          />
        )}
      </div>
    </div>
  );
}

function Result({ data, setIdenModal, setIdenComplete }) {
  let { name, resident1, resident2, msg } = data;
  const storeName = useSelector((state) => state.user.name) || '';
  const storeResident1 = useSelector((state) => state.user.resident1) || '';
  const storeResident2 = useSelector((state) => state.user.resident2) || '';
  // 일치 여부 확인
  let nameCheck = false;
  let resident1Check = false;
  let resident2Check = false;
  if (name == storeName) {
    nameCheck = true;
  }
  if (resident1 == storeResident1) {
    resident1Check = true;
  }
  if (resident2 == storeResident2) {
    resident2Check = true;
  }
  // 모두 일치하면 확인 완료 버튼 활성화
  let complete = false;
  if (nameCheck && resident1Check && resident2Check) {
    complete = true;
  }
  return (
    <div className="max-w-xs mx-auto mt-3">
      <div className="flex mx-5 justify-between">
        <div>
          <div className='mx-auto text-center'>
            <p className='ml-12 text-center'>{msg}</p>
          </div>
          <span className="keys">이름</span>
        </div>
        <div>
          <span>{name}</span>
          {nameCheck && <img src={Check} alt="#" className="ml-3 inline size-5" />}
        </div>
      </div>
      <div className="flex mx-5 justify-between">
        <div>
          <span className="keys">앞자리</span>
        </div>
        <div>
          <span>{resident1}</span>
          {resident1Check && <img src={Check} alt="#" className="ml-3 inline size-5" />}
        </div>
      </div>
      <div className="flex mx-5 justify-between">
        <div>
          <span className="keys">뒷자리</span>
        </div>
        <div>
        <span>
          {resident2.charAt(0) + "••••••"}
        </span>
          {resident2Check && <img src={Check} alt="#" className="ml-3 inline size-5" />}
        </div>
      </div>
      <div className="mx-auto text-center">
        <div>
          {complete && (
            <button
              className="btn-active"
              onClick={() => {
                setIdenComplete(true);
                setIdenModal(false);
              }}
            >
              확인 완료
            </button>
          )}
        </div>
        <div>{!complete && <button className="btn-inactive">확인 완료</button>}</div>
      </div>
    </div>
  );
}

export default IdenModal;
