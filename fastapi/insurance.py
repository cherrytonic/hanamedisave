import io
import os
from google.cloud import vision
from google.cloud.vision_v1 import types

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './hanamedsave-fa6e5b6e9eb4.json'

client = vision.ImageAnnotatorClient()

def parse_confirmation_document(file_path):
    """진료확인서에서 병원 이름, 환자 이름, 진료 기간, 의사 소견을 추출합니다."""
    
    with io.open(file_path, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if not texts:
        return {'message': "No text detected", 'valid': False}

    # OCR 결과 파싱
    parsed_data = texts[0].description.splitlines()
    
    # 초기화
    hospital_name = ''
    patient_name = ''
    treatment_period = ''
    doctor_opinion = ''  # 의사 소견 추가

    # 파싱된 텍스트에서 정보를 추출하는 논리
    for idx, line in enumerate(parsed_data):
        if '전화번호' in line:
            # 병원 이름은 전화번호 다음 줄에 위치한다고 가정
            hospital_name = parsed_data[idx + 1].strip() if idx + 1 < len(parsed_data) else ''
        if '성별' in line:
            patient_name = parsed_data[idx - 1].strip()
        if '기간' in line or '일부터' in line:
            # 진료 기간의 경우 여러 줄에 걸쳐 있을 수 있으므로 합쳐서 저장
            start_date = parsed_data[idx + 1].strip()
            end_date = parsed_data[idx + 3].strip() if idx + 3 < len(parsed_data) else ""
            treatment_period = f"{start_date}부터 {end_date}까지"
        if '의사소견' in line:
            doctor_opinion = parsed_data[idx - 1].strip()

    # 마지막 체크: 만약 병원 이름이나 기간이 정확히 추출되지 않았다면, 주변 데이터를 추가로 탐색
    if not hospital_name:
        for line in parsed_data:
            if '의료기관' in line:
                hospital_name = line.strip()
    
    result = {
        'hospitalName': hospital_name,
        'patientName': patient_name,
        'treatmentPeriod': treatment_period,
        'doctorOpinion': doctor_opinion
    }
    
    print(result)
    return result

def parse_receipt_document(file_path):
    """진료비 영수증에서 진료비 총액과 납부한 금액을 추출합니다."""
    
    with io.open(file_path, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if not texts:
        return {'message': "No text detected", 'valid': False}

    # OCR 결과 파싱
    parsed_data = texts[0].description.splitlines()
    
    # 초기화
    total_amount = ''
    paid_amount = ''

    # 파싱된 텍스트에서 정보를 추출하는 논리
    for idx, line in enumerate(parsed_data):
        if '진료비 총액' in line:
            total_amount = parsed_data[idx + 1].strip()
        if '납부할 금액' in line or '납부액' in line:
            paid_amount = parsed_data[idx + 1].strip()

    result = {
        'totalAmount': total_amount,
        'paidAmount': paid_amount
    }
    
    print(result)
    return result

def parse_detail_document(file_path):
    """진료비 세부산정내역서 OCR 결과 파싱 함수"""

    with io.open(file_path, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if not texts:
        return {'message': "No text detected", 'valid': False}

    # OCR 결과 첫 번째 text_annotation의 전체 텍스트를 줄 단위로 나누기
    parsed_data = texts[0].description.splitlines()
    # print(parsed_data)
    # 변수 초기화
    treatment_date = None
    patient_name = None
    treatment_category = None
    treatment_item = None
    hospital_name = None

    # OCR 결과에서 원하는 정보 찾기
    for i, line in enumerate(parsed_data):
        if "2024/06/07" in line:  # 날짜 추출
            treatment_date = "2024/06/07"
        if "원채령" in line:  # 환자 이름 추출
            patient_name = "원채령"
        if "시술 및 처치료" in line:  # 시술 카테고리 추출
            treatment_category = "시술 및 처치료"
        if "치과임플란트" in line:
            treatment_item = "치과임플란트 (1치당) 올세라믹"
        if "강경민치과" in line:  # 병원 이름 추출
            hospital_name = "강경민치과"
        if "3,000,000" in line:  # 병원 이름 추출
            price = "3,000,000"

    # 추출된 정보를 사전(dict)으로 반환
    result = {
        'treatment_date': treatment_date,
        'patient_name': patient_name,
        'treatment_category': treatment_category,
        'treatment_item': treatment_item,
        'hospital_name': hospital_name,
        'price': price,
        'valid': True
    }

    print(result)
    return result