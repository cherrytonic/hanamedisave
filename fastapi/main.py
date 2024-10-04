from typing import Union, Optional
import os
import uuid
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from identification import detect_text_uri, detect_text
from identification import plus2
from insurance import parse_confirmation_document, parse_receipt_document, parse_detail_document

# uvicorn main:app --reload
# app = FastAPI(root_path="/api/fast")
app = FastAPI()
origins = [

    "*"  # private 영역에서 사용한다면 *로 모든 접근을 허용할 수 있다.
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Content(BaseModel):
    content: str


@app.post("/api/fast/idenimg")
async def upload_photo(inputname: str = Form(...), inputresident1: int = Form(...), inputresident2: int = Form(...), file: UploadFile = Form(...)):
    UPLOAD_DIR = "./iden_img"  # 이미지를 저장할 서버 경로
    print(f"Received inputname: {inputname}, inputresident1: {inputresident1}, inputresident2: {inputresident2}")
    print(f"Received file: {file.filename}")
    content = await file.read()
    print(f"File size: {len(content)} bytes")
    filename = f"{str(uuid.uuid4())}.jpg"  # uuid로 유니크한 파일명으로 변경
    with open(os.path.join(UPLOAD_DIR, filename), "wb") as fp:
        fp.write(content)  # 서버 로컬 스토리지에 이미지 저장 (쓰기)

    result = detect_text('./iden_img', inputname, inputresident1, inputresident2)
    return detect_text('./iden_img', inputname, inputresident1, inputresident2)


class OcrResponse(BaseModel):
    hospitalName: Optional[str] = None
    patientName: Optional[str] = None
    treatmentPeriod: Optional[str] = None
    doctorOpinion: Optional[str] = None
    totalAmount: Optional[str] = None
    paidAmount: Optional[str] = None

@app.post("/api/fast/insurance-ocr")
async def insurance_ocr(file: UploadFile, file_type: str = Form(...)):
    UPLOAD_DIR = "./insurance_docs"
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    if file_type == "confirmation":
        result = parse_confirmation_document(file_path)
    elif file_type == "receipt":
        result = parse_receipt_document(file_path)
    elif file_type == 'detail':
        result = parse_detail_document(file_path)
    else:
        return {"message": "Invalid file type", "valid": False}
    # 분석 후 파일 삭제
    if os.path.exists(file_path):
        os.remove(file_path)
    return result

@app.get('/')
def index():
    # return detect_text_uri('https://ifh.cc/g/yfWH3y.jpg')
    return detect_text('./iden_img')


@app.post('/plus')
async def index(num: int):
    return plus2(num)


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


# @app.post('/ocr')

# async def detect(uri: str):
#     result = detect_text_uri(uri)
#     print(result)

#     return result


@app.post('/ocr')
async def detect(path: str):
    result = detect_text(path)
    print(result)

    return result

# 얼굴 정보 올리기


@app.post("/api/fast/photo")
async def upload_photo(file: UploadFile):
    UPLOAD_DIR = "./knowns"  # 이미지를 저장할 서버 경로

    content = await file.read()
    filename = f"{file.filename}"  # 파일명 변경
    with open(os.path.join(UPLOAD_DIR, filename), "wb") as fp:
        fp.write(content)  # 서버 로컬 스토리지에 이미지 저장 (쓰기)

    return {"filename": filename}

# 얼굴 이미지 불러오기


@app.get("/get/photo/{name}")
async def get_photo(name: str):
    file_path = f'./knowns/{name}.jpg'
    return FileResponse(path=file_path, filename=name)
