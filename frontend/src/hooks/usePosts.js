import { useEffect, useState } from "react";
import { getPosts, createPost, deletePost } from "../api/posts";

// ✅ "게시글 목록" 전용 훅
export function usePosts() {
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 목록 새로 불러오기
  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (e) {
      setError(e.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  // 글 생성
  const create = async (body) => {
    console.log("3) usePosts: create 호출", body);

    setLoading(true);
    setError("");
    try {
      const created = await createPost(body); // 서버가 저장된 글(JSON) 반환한다고 가정
      // 목록을 최신으로 유지하고 싶으면 reload
      await reload();
      return created; // ✅ 만든 글을 페이지로 돌려줘서 navigate에 쓰게 함
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 글 삭제
  const remove = async (id) => {
    setLoading(true);
    setError("");
    try {
      await deletePost(id);
      await reload();
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, error, reload, create, remove };
}
