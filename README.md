# Next.js for Beginners Study

(https://nomadcoders.co/nextjs-for-beginners) 
#### Next.js를 처음 배우면서 실습한 코드와 배운 내용을 기록함.

---

## Summary
- Next.js App Router 기본 개념 이해
- 서버 컴포넌트와 클라이언트 컴포넌트 구분
- 데이터 패칭 (`fetch`, `revalidate`, `cache` 옵션)
- 동적 라우팅 & `generateMetadata`
- Suspense를 통한 비동기 컴포넌트 렌더링
- Vercel 배포

---

## 🚀 실행 방법

### 1) 로컬 실행
```bash
git clone https://github.com/JunSeop00/nextjs-study.git
cd nextjs-study
npm install
npm run dev
```

### 2) 배포 버전
https://nextjs-study-blue.vercel.app/

---

## 배운점
- 서버 컴포넌트가 기본이라는 점, 브라우저 상호작용이 필요한 경우에만 use client 선언 (Hydration)

- Suspense를 사용해 비동기 컴포넌트 로딩 상태를 처리 (parallel)

- generateMetadata로 SEO(Search Engine Optimization)에 필요한 title 동적 설정

- runtime = "edge"를 통해 Edge 환경 배포 테스트

- GitHub → Vercel 연결을 통한 자동 배포 경험