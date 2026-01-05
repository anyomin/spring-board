import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";

export default function PostWritePage() {
  const navigate = useNavigate();
  const { create, loading } = usePosts();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const [error, setError] = useState("");

  const submit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("제목/내용은 필수!");
      return;
    }
    setError("");

    const created = await create({ title, content, author });
    if (created?.id) {
      navigate(`/posts/${created.id}`);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <Link to="/">← 목록</Link>
      <h2 style={{ marginTop: 12 }}>글쓰기</h2>

      {error && <div style={{ color: "tomato", marginBottom: 12 }}>{error}</div>}

      <div style={{ display: "grid", gap: 10 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #555" }}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용"
          rows={10}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #555" }}
        />

        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="작성자"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #555" }}
        />

        <button onClick={submit} disabled={loading} style={{ padding: "10px 14px" }}>
          등록
        </button>
      </div>
    </div>
  );
}
