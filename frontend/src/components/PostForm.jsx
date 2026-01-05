import { useState } from "react";
import { Input, TextArea, Button, MessageStrip } from "@ui5/webcomponents-react";

export default function PostForm({ onSubmit, loading }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const t = title.trim();
    const c = content.trim();
    const a = author.trim();

    if (!t || !c) {
      setError("제목/내용은 필수!");
      return;
    }
    setError("");

    const created = await onSubmit({ title: t, content: c, author: a });

    if (created) {
      setTitle("");
      setContent("");
      setAuthor("");
    }
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {error && <MessageStrip design="Negative" hideCloseButton>{error}</MessageStrip>}

      <Input
        placeholder="제목"
        value={title}
        onInput={(e) => setTitle(e.target.value)}
      />

      <TextArea
        placeholder="내용"
        value={content}
        onInput={(e) => setContent(e.target.value)}
        rows={6}
      />

      <Input
        placeholder="작성자"
        value={author}
        onInput={(e) => setAuthor(e.target.value)}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <Button design="Emphasized" onClick={handleSubmit} disabled={loading}>
          등록
        </Button>
      </div>
    </div>
  );
}
