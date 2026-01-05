import { Routes, Route, Navigate } from "react-router-dom";
import PostsPage from "./pages/PostsPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostWritePage from "./pages/PostWritePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PostsPage />} />
      <Route path="/posts/new" element={<PostWritePage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
