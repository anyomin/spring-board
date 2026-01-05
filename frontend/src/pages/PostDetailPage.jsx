import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const [error, setError] = useState("");

  const fetchPost = async () => {
    const res = await fetch(`/api/posts/${id}`);
    if (!res.ok) {
      setError("글을 찾을 수 없음");
      return;
    }
    const data = await res.json();
    setPost(data);

    setTitle(data.title ?? "");
    setContent(data.content ?? "");
    setAuthor(data.author ?? "");
    setError("");
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const deletePost = async () => {
    const ok = confirm("진짜 삭제할까?");
    if (!ok) return;

    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    navigate("/");
  };

  const saveEdit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("제목/내용은 필수!");
      return;
    }
    setError("");

    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ title, content, author }),
    });

    if (!res.ok) {
      setError("수정 저장 실패");
      return;
    }

    setIsEditing(false);
    fetchPost();
  };

  const formatDate = (iso) => (iso ? new Date(iso).toLocaleString("ko-KR") : "-");

  if (!post && !error) return <div style={{ padding: 20 }}>로딩중...</div>;

  if (error && !post) {
    return (
      <div style={{ padding: 20 }}>
        {error} / <Link to="/">목록</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <Link to="/">← 목록</Link>

      <div style={{ marginTop: 12 }}>
        {!isEditing ? (
          <>
            <h2 style={{ marginBottom: 6 }}>{post.title}</h2>

            <div style={{ opacity: 0.85, display: "flex", gap: 14, marginBottom: 12 }}>
              <div>작성자: {post.author ?? "-"}</div>
              <div>작성일자: {formatDate(post.createdAt)}</div>
            </div>

            <hr style={{ margin: "12px 0" }} />
            <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>

            <div style={{ marginTop: 12 }}>
              <button onClick={() => setIsEditing(true)}>수정</button>
              <button onClick={deletePost} style={{ marginLeft: 8 }}>
                삭제
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용"
              rows={10}
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />

            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="작성자"
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />

            <button onClick={saveEdit}>저장</button>
            <button onClick={() => setIsEditing(false)} style={{ marginLeft: 8 }}>
              취소
            </button>
          </>
        )}
      </div>

      {/* 수정/검증 에러는 여기서 보여주기 */}
      {error && post && <div style={{ color: "tomato", marginTop: 12 }}>{error}</div>}
    </div>
  );
}
