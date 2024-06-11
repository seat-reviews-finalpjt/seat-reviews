# Dockerfile
# 베이스 이미지를 지정합니다.
FROM python:3.10-slim

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# git 설치를 실행합니다 
RUN apt-get update && apt-get install -y git

# 필요 라이브러리 파일을 복사합니다.
COPY requirements.txt /app/

# 라이브러리들을 설치합니다.
RUN pip install --no-cache-dir -r requirements.txt

# 모든 소스 파일들을 복사합니다.
COPY . /app/

# 환경변수를 설정합니다.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Django 프로젝트의 포트를 설정합니다.
EXPOSE 8000

# 명령어를 실행합니다.
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "seat_reviews.wsgi:application"]