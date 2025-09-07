// // app/page.tsx
// import { z } from "zod";
//
// // ── 1) 페이지 메타데이터
// export const metadata = {
//     title: "Home",
// };
//
// // ── 2) 환경 변수에서 API URL 주입 (필수 권장)
// const URL = process.env.MOVIES_API_URL ?? "https://nomad-movies.nomadcoders.workers.dev/movies";
//
// // ── 3) 응답 스키마 정의 (런타임 검증)
// const MovieSchema = z.object({
//     id: z.number().or(z.string()),              // 백엔드 타입 변화 대비
//     title: z.string(),
//     poster_path: z.string().optional().nullable(),
//     overview: z.string().optional().nullable(),
//     release_date: z.string().optional().nullable(),
// });
// const MoviesSchema = z.array(MovieSchema);
//
// // ── 4) 타임아웃 + 제한적 재시도 포함 fetch 유틸
// async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit & { timeout?: number } = {}) {
//     const { timeout = 5000, ...rest } = init;
//     const controller = new AbortController();
//     const id = setTimeout(() => controller.abort(), timeout);
//
//     try {
//         const res = await fetch(input, { ...rest, signal: controller.signal });
//         return res;
//     } finally {
//         clearTimeout(id);
//     }
// }
//
// async function getMovies() {
//     // 재시도 대상: 5xx/네트워크 에러
//     const maxRetries = 2;
//     let attempt = 0;
//     let lastErr: unknown;
//
//     while (attempt <= maxRetries) {
//         try {
//             const res = await fetchWithTimeout(URL, {
//                 // ── 5) 캐시/ISR 정책: 5분마다 리밸리데이트 (요구사항에 맞게 조정)
//                 next: { revalidate: 300, tags: ["movies"] },
//                 headers: { Accept: "application/json" },
//                 timeout: 5000,
//             });
//
//             if (!res.ok) {
//                 // 4xx는 즉시 실패, 5xx만 재시도
//                 if (res.status >= 500 && res.status < 600 && attempt < maxRetries) {
//                     attempt++;
//                     // 지수 백오프(200ms, 400ms 정도)
//                     await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt - 1)));
//                     continue;
//                 }
//                 throw new Error(`Movies API error: ${res.status} ${res.statusText}`);
//             }
//
//             const data = await res.json();
//             const parsed = MoviesSchema.parse(data); // ── 6) 스키마 검증
//             console.log("parsed : ", parsed);
//             return parsed;
//         } catch (err) {
//             lastErr = err;
//             // AbortError/네트워크/5xx 재시도
//             if (attempt < maxRetries) {
//                 attempt++;
//                 await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt - 1)));
//                 continue;
//             }
//             break;
//         }
//     }
//
//     // ── 7) 최종 실패 시 빈 배열 반환(UX 용이) + 서버 로그 남기기
//     console.error("[getMovies] failed:", lastErr);
//     return [];
// }
//
// // ── 8) 서버 컴포넌트: 안정적인 렌더링
// export default async function HomePage() {
//     const movies = await getMovies();
//
//     if (!movies.length) {
//         return (
//             <main style={{ padding: 24 }}>
//                 <h1>영화 목록</h1>
//                 <p>현재 가져올 영화가 없거나 일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.</p>
//             </main>
//         );
//     }
//
//     return (
//         <main style={{ padding: 24 }}>
//             <h1>영화 목록</h1>
//             <ul style={{ listStyle:"none", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
//                 {movies.map((m) => (
//                     <li key={String(m.id)} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
//                         <div style={{ aspectRatio: "2/3", background: "#f6f6f6", borderRadius: 8, overflow: "hidden" }}>
//                             {m.poster_path ? (
//                                 // Next/Image 사용 시 <Image ... />로 교체 (여기선 순수 예제)
//                                 <img
//                                     src={m.poster_path}
//                                     alt={m.title}
//                                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                                     loading="lazy"
//                                 />
//                             ) : (
//                                 <div style={{ padding: 12, fontSize: 12, color: "#888" }}>포스터 없음</div>
//                             )}
//                         </div>
//                         <h3 style={{ marginTop: 8, marginBottom: 4 }}>{m.title}</h3>
//                         {m.release_date && <small>개봉일: {m.release_date}</small>}
//                         {m.overview && (
//                             <p style={{ marginTop: 8, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
//                                 {m.overview}
//                             </p>
//                         )}
//                     </li>
//                 ))}
//             </ul>
//         </main>
//     );
// }
import Link from "next/link";

export const metadata = {
    title: "Home"
}

export const API_URL = "https://nomad-movies.nomadcoders.workers.dev/movies";

const getMovies = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch(API_URL);
    const json = await response.json();
    return json;
}
export default async function HomePage() {
    const movies = await getMovies();
    return (
        <div>{movies.map((movie) => <li key={movie.id}><Link href={`/movies/${movie.id}`}>{movie.title}</Link>
        </li>)}</div>
    )
}