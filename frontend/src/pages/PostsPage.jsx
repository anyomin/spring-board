import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";
import { Input, Select, Option, Button, Toolbar, ToolbarSpacer } from "@ui5/webcomponents-react";

export default function PostsPage() {
  const navigate = useNavigate();
  const { posts, loading, error } = usePosts();

  // 검색어: 입력중(qDraft) / 적용된(q)
  const [qDraft, setQDraft] = useState("");
  const [q, setQ] = useState("");

  // 정렬
  const [sort, setSort] = useState("new"); // "new" | "old"

  // 페이지네이션
  const [page, setPage] = useState(1);       // 1부터
  const [pageSize, setPageSize] = useState(10);

  const applySearch = () => {
    setQ(qDraft.trim());
    setPage(1); // 검색하면 1페이지로
  };

  const resetAll = () => {
    setQDraft("");
    setQ("");
    setSort("new");
    setPageSize(10);
    setPage(1);
  };

  // 날짜 포맷: YYYY-MM-DD HH:mm
  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

  // 1) 검색 + 정렬된 전체 목록
  const visiblePosts = useMemo(() => {
    const keyword = q.toLowerCase();

    const filtered = keyword
      ? posts.filter((p) => {
          const t = (p.title ?? "").toLowerCase();
          const c = (p.content ?? "").toLowerCase();
          const a = (p.author ?? "").toLowerCase();
          return t.includes(keyword) || c.includes(keyword) || a.includes(keyword);
        })
      : posts;

    const sorted = [...filtered].sort((a, b) => {
      const aid = Number(a.id ?? 0);
      const bid = Number(b.id ?? 0);
      return sort === "new" ? bid - aid : aid - bid;
    });

    return sorted;
  }, [posts, q, sort]);

  // 2) 페이지네이션 계산
  const total = visiblePosts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return visiblePosts.slice(start, start + pageSize);
  }, [visiblePosts, safePage, pageSize]);

  // 번호 계산 (최신순이면 1이 최신, 오래된순이면 1이 오래된)
  const getRowNo = (indexInPage) => {
    const idx = (safePage - 1) * pageSize + indexInPage; // 0부터
    if (sort === "new") return idx + 1;                  // 최신순: 1,2,3...
    return idx + 1;                                      // 오래된순도 1,2,3... (원하면 반대로도 가능)
  };

  // 페이지 버튼(많아지면 1..5 정도만 보이게)
  const pageButtons = useMemo(() => {
    const maxButtons = 7; // 화면에 보여줄 버튼 수
    let start = Math.max(1, safePage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [safePage, totalPages]);

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginBottom: 12 }}>게시판</h1>

      {/* 검색/정렬/글쓰기 */}
     {/* ✅ 검색/정렬/글쓰기 (UI5) */}
<Toolbar style={{ marginBottom: 12, borderRadius: 12 }}>
  <Input
    placeholder="검색: 제목/내용/작성자"
    value={qDraft}
    onInput={(e) => setQDraft(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") applySearch();
    }}
    style={{ width: "420px" }}
  />

  <Button design="Emphasized" onClick={applySearch} disabled={loading}>
    검색
  </Button>

  <Select
    value={sort}
    onChange={(e) => {
      const selected = e.detail?.selectedOption?.value;
      setSort(selected ?? "new");
      setPage(1);
    }}
    style={{ width: "140px" }}
  >
    <Option value="new">최신순</Option>
    <Option value="old">오래된순</Option>
  </Select>

  <Button design="Transparent" onClick={resetAll} disabled={loading}>
    초기화
  </Button>

  <ToolbarSpacer />

  <Button
    design="Positive"
    onClick={() => navigate("/posts/new")}
    disabled={loading}
  >
    글쓰기
  </Button>
</Toolbar>


      <div style={{ opacity: 0.85, marginBottom: 10 }}>
        전체 {posts.length}개 중 {visiblePosts.length}개 표시 / {safePage} / {totalPages} 페이지
      </div>

      {error && <div style={{ color: "tomato", marginBottom: 12 }}>{error}</div>}
      {loading && <div style={{ marginBottom: 12 }}>로딩중...</div>}

      {/* 게시판 테이블(일반 게시판 느낌) */}
      <div style={{ border: "1px solid #444", borderRadius: 12, overflow: "hidden" }}>
        {/* 헤더 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 140px 170px",
            padding: "12px 14px",
            background: "#1f1f1f",
            borderBottom: "1px solid #444",
            fontWeight: 800,
          }}
        >
          <div>번호</div>
          <div>제목</div>
          <div>작성자</div>
          <div>작성일</div>
        </div>

        {/* 본문 */}
        {pageItems.map((p, idx) => (
          <Link
            key={p.id}
            to={`/posts/${p.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 140px 170px",
                padding: "12px 14px",
                borderBottom: "1px solid #333",
                alignItems: "center",
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#222")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ opacity: 0.9 }}>{getRowNo(idx)}</div>

              {/* 제목 말줄임 */}
              <div
                style={{
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  paddingRight: 10,
                }}
                title={p.title} // 마우스 올리면 전체 제목 보임
              >
                {p.title}
              </div>

              <div style={{ opacity: 0.9 }}>{p.author ?? "-"}</div>
              <div style={{ opacity: 0.9 }}>{formatDate(p.createdAt)}</div>
            </div>
          </Link>
        ))}

        {!loading && pageItems.length === 0 && (
          <div style={{ padding: 20, opacity: 0.7 }}>게시글이 없습니다.</div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 14,
          flexWrap: "wrap",
        }}
      >
        {/* 페이지당 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", opacity: 0.9 }}>
          <span>페이지당</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={{ padding: "8px 10px" }}
          >
            <option value={5}>5개</option>
            <option value={10}>10개</option>
            <option value={20}>20개</option>
          </select>
        </div>

        {/* 버튼들 */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            style={{ padding: "8px 10px" }}
          >
            이전
          </button>

          {pageButtons[0] > 1 && (
            <>
              <button onClick={() => setPage(1)} style={{ padding: "8px 10px" }}>
                1
              </button>
              <span style={{ opacity: 0.7 }}>…</span>
            </>
          )}

          {pageButtons.map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              style={{
                padding: "8px 10px",
                fontWeight: n === safePage ? 900 : 600,
                border: n === safePage ? "2px solid #4aa3ff" : "1px solid #555",
              }}
            >
              {n}
            </button>
          ))}

          {pageButtons[pageButtons.length - 1] < totalPages && (
            <>
              <span style={{ opacity: 0.7 }}>…</span>
              <button onClick={() => setPage(totalPages)} style={{ padding: "8px 10px" }}>
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            style={{ padding: "8px 10px" }}
          >
            다음
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
