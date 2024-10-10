FROM python:3.10

WORKDIR /app

COPY . .

RUN pip install --upgrade pip \
    && pip install --upgrade setuptools \
    && pip install --no-cache-dir -r requirements.txt

RUN mkdir -p ./iden_img \
    && mkdir -p ./insurance_docs \
    && chmod 755 ./iden_img \
    && chmod 755 ./insurance_docs

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]