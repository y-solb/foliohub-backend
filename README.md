# <a href="https://www.foliohub.me"><img src="https://github.com/y-solb/foliohub-backend/assets/59462108/8f74737b-07b0-468e-aea3-acf56d8fb233" align="left" width="40" height="40"></a> Foliohub - Backend

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fy-solb%2Ffoliohub-backend&count_bg=%23607AE9&title_bg=%236A6A6A&icon=&icon_color=%23FF0202&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

나만의 포트폴리오 만드는 서비스

### [🚀 서비스 보러가기](https://www.foliohub.me)

## 💁🏻‍♀️ 소개

![main](https://github.com/y-solb/foliohub-backend/assets/59462108/1c17f2c2-da2a-477d-b9a6-65960393bb04)
![list](https://github.com/y-solb/foliohub-backend/assets/59462108/99ca6a66-1e10-436f-87db-721045bbb44d)
![mypage](https://github.com/y-solb/foliohub-backend/assets/59462108/c5d767d8-8242-4c56-b9fb-57ab19bc45e2)
![asset](https://github.com/y-solb/foliohub-backend/assets/59462108/8be2aaf6-9b8b-4269-967b-c9393aa1a2fa)

## ⚒️ 기술 스택

- Language: Typescript
- Framework : Express
- Database : PostgreSQL
- ORM : TypeORM
- Deploy: AWS EC2, Docker

## 💿 ERD

![ERD](https://github.com/y-solb/foliohub-backend/assets/59462108/b14286e0-8239-4359-8bca-44575c81a6de)

## ✏️ 구현 사항

- Rest API 개발 및 DB 설계
- JWT와 cookie로 인증 구현
- Google 소셜 로그인 기능 구현
- AccessToken은 1시간, RefreshToken은 14일 후 만료되며 RefreshToken은 데이터베이스에 저장해 AccessToken 만료 시 cookie에 담겨진 RefreshToken을 확인하여 유효한 경우 AccessToken을 재발급
- 클라이언트에서 받아온 이미지 파일을 multer를 사용하여 처리한 후 Cloudinary에 업로드
- AWS Certificate Manager를 사용하여 SSL 인증서를 발급받고, 이를 Route 53을 통해 설정한 Load Balancer에 연결하여 HTTPS를 구현
- Docker를 활용하여 AWS EC2에 PM2로 무중단 배포

## ⛳️ 실행

### 환경변수 설정

```
# .env.development
PORT=3001
NODE_ENV=development
ORIGIN=http://localhost:3000
APP_URL=http://localhost:3001

# JWT
JWT_SECRET_KEY=

# GOOGLE
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# CLOUDINARY
CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_BASE_URL=http://res.cloudinary.com/...../image/upload
```

```
# .env
# DB
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
```

### 설치 및 시작

```
docker compose up
```

## 🗂️ Repository

- [Foliohub Front Repository](https://github.com/y-solb/foliohub-frontend)
