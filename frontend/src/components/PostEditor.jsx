import { useEffect, useState } from "react";

export default function PostEditor({ initialPost, onSave, onCancel, loading }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [formError, setFormError] = useState("");

  // ✅ initialPost가 바뀌면(다른 글로 이동하거나 reload되면) 입력칸도 다시 채우기
  useEffect(() => {
    if (!initialPost) return;
    setTitle(initialPost.title ?? "");
    setContent(initialPost.content ?? "");
    setAuthor(initialPost.author ?? "");
    setFormError("");
  }, [initialPost]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      setFormError("제목/내용은 필수!");
      return;
    }
    setFormError("");

    // 부모에게 "저장해줘" 요청
    onSave({ title, content, author });
  };

  return (
    <div>
      <input
        value={title}
        onChange={(e) => { setTitle(e.target.value); setFormError(""); }}
        placeholder="제목"
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      <textarea
        value={content}
        onChange={(e) => { setContent(e.target.value); setFormError(""); }}
        placeholder="내용"
        rows={6}
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      <input
        value={author}
        onChange={(e) => { setAuthor(e.target.value); setFormError(""); }}
        placeholder="작성자"
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      <button onClick={handleSave} disabled={loading}>저장</button>
      <button onClick={onCancel} disabled={loading} style={{ marginLeft: 8 }}>취소</button>

      {formError && <div style={{ color: "tomato", marginTop: 12 }}>{formError}</div>}
    </div>
  );
}
