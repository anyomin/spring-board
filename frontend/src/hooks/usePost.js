import { useEffect, useState } from "react";
import { getPost, updatePost, deletePost } from "../api/posts";

// ✅ "글 1개"를 다루는 전용 훅(상세조회/수정/삭제)
export function usePost(id) {
  const [post, setPost] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  // 🔸 서버에서 글 1개 다시 불러오기
  const reload = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getPost(id);
      setPost(data);
    } catch (e) {
      setLoadError(e.message);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  // 처음/ id 바뀔 때 자동 로딩
  useEffect(() => {
    reload();
  }, [id]);

  // 🔸 수정
  const save = async (body) => {
    setLoading(true);
    setLoadError("");
    try {
      await updatePost(id, body);
      await reload(); // 저장 후 최신 값 반영
      return true;
    } catch (e) {
      setLoadError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔸 삭제
  const remove = async () => {
    setLoading(true);
    setLoadError("");
    try {
      await deletePost(id);
      return true;
    } catch (e) {
      setLoadError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, loadError, reload, save, remove };
}
