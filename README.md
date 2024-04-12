# <a href="https://www.foliohub.me"><img src="https://github.com/y-solb/foliohub-backend/assets/59462108/8f74737b-07b0-468e-aea3-acf56d8fb233" align="left" width="40" height="40"></a> Foliohub - Backend

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fy-solb%2Ffoliohub-backend&count_bg=%23607AE9&title_bg=%236A6A6A&icon=&icon_color=%23FF0202&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

나만의 포트폴리오 만드는 서비스

## 💁🏻‍♀️ 소개

![main](https://github.com/y-solb/foliohub-backend/assets/59462108/1c17f2c2-da2a-477d-b9a6-65960393bb04)
![list](https://github.com/y-solb/foliohub-backend/assets/59462108/99ca6a66-1e10-436f-87db-721045bbb44d)
![mypage](https://github.com/y-solb/foliohub-backend/assets/59462108/c5d767d8-8242-4c56-b9fb-57ab19bc45e2)
![asset1](https://github.com/y-solb/foliohub-backend/assets/59462108/d06a3055-d4b5-41b5-ba12-4afaf1ec6ac9)
![experience](https://github.com/y-solb/foliohub-backend/assets/59462108/1f2ff8a8-b5c8-4bb1-adce-7e4637ca072d)

### [🚀 서비스 보러가기](https://www.foliohub.me)

로그인 없이 체험 코드를 입력하고 체험해 볼 수 있어요

```
체험코드 : HelloWorld
```

## ⚒️ 기술 스택

- Language: Typescript
- Framework : Express
- Database : PostgreSQL
- ORM : TypeORM
- Deploy: AWS EC2, Docker

## 💿 ERD

![ERD](https://github.com/y-solb/foliohub-backend/assets/59462108/b14286e0-8239-4359-8bca-44575c81a6de)

## ✏️ 구현 사항

**로그인/인증**

- Google 소셜 로그인을 구현하였습니다.
- 사용자가 로그인하면 Google로부터 받은 정보를 확인하고, 기존 회원인 경우 accessToken과 refreshToken을 쿠키를 통해 발급합니다. 또한, AuthToken 테이블에 userId, refreshToken, 만료일을 저장하여 accessToken 재발급 시 이를 활용합니다.
- 보안을 강화하기 위해 쿠키는 httpOnly, secure, sameSite 옵션을 설정했습니다.
- accessToken은 1시간, refreshToken은 14일 뒤에 만료되며, accessToken 만료 시 refreshToken으로 재발급 받을 수 있도록 구현되었습니다. 또한, accessToken에는 userId가 포함되어 있어서 인증 middleware에서 accessToken을 decode하여 userId를 확인할 수 있습니다.
- 로그인 후 회원가입이 필요한 경우, 회원가입 페이지로 리다이렉트합니다. 이때 사용자 정보(email, provider, providerId)를 토큰으로 생성하고 쿠키에 저장하여 회원가입 시 사용할 수 있도록 구현하였습니다.
- 인증이 필요한 API의 경우 middleware를 거칩니다. 여기서 accessToken과 refreshToken을 확인하여, 모두 있는 경우에만 accessToken을 decode하여 사용자의 정보를 가져옵니다. 이 정보를 요청(req) 객체에 추가하여 이후의 작업에서도 사용할 수 있도록 했습니다.
- 로그아웃 시 accessToken과 refreshToken을 쿠키에서 삭제했습니다.

**이미지 업로드**

- 이미지를 사용 목적에 따라 폴더를 나누기 위해 이미지 업로드 시 이미지의 타입(thumbnail, asset)을 받아와 해당 타입의 폴더 안에 저장했습니다.
- 이미지는 multer를 사용하여 서버의 uploads 폴더에 저장되며 이후에는 Cloudinary를 통해 업로드됩니다. 이미지 최적화를 위해 넓이 1000px로 크롭하여 저장했습니다. 업로드 후에는 서버에서 업로드 된 이미지 파일을 삭제했습니다.
- 프론트엔드 개발 환경에서는 HTTP를 사용하고 배포된 환경에서 HTTPS를 사용하기 때문에 이미지를 상대 경로로 저장했습니다.

**직업 카테고리 테이블**

<img src="https://github.com/y-solb/foliohub-backend/assets/59462108/2a1fd219-d9ab-45ef-9ed4-d4612dba7be0" alt="직업 카테고리 테이블" width="280">

- 데이터를 구조화하여 관리하고 검색 및 필터링을 용이하게 하고자 직업을 카테고리별로 상위 카테고리(01-개발)와 하위 카테고리(01001-웹개발자)로 분류하여 테이블에 저장했습니다.

**좋아요**

- 좋아요를 누른 경우 LikePortfolio 테이블에 좋아요를 누른 사용자 id, 좋아요를 받은 포트폴리오의 id와 상태 값을 저장하고 Portfolio 테이블에서 해당 포트폴리오의 좋아요 수를 업데이트했습니다.
- 좋아요를 취소하는 경우 좋아요 여부를 false로 변경하고 Portfolio 테이블에서 해당 포트폴리오의 좋아요 수를 업데이트했습니다.

**CORS**

- cors 미들웨어로 출처가 다른 요청을 허용하고 허용된 메서드 및 헤더를 설정했습니다. 쿠키 값을 가져오기 위해 `credentials: true` 옵션을 설정했습니다.

**배포**

- Docker를 활용하여 AWS EC2에 PM2로 무중단 배포를 구현했습니다.
- AWS Certificate Manager를 사용하여 SSL 인증서를 발급받고, 이를 Route 53을 통해 설정한 Load Balancer에 연결하여 HTTPS를 구현했습니다.
- AWS EC2에서 빌드 시 인스턴스가 중단되는 문제가 발생하여, 현재 로컬에서 프로젝트를 빌드 후 Git에 업로드하고 이를 EC2에서 실행시키고 있습니다.

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

# COOKIE DOMAIN
COOKIE_DOMAIN=

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

## 🗂️ 관련 링크

- [Foliohub Front Repository](https://github.com/y-solb/foliohub-frontend)
- [1차 완성 회고](https://sollogging.tistory.com/83)
