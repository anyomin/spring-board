async function request(url, options) {
    const res = await fetch(url, options);
  
    // ✅ 실패면 에러로 던져서(throw) 페이지에서 잡게 함
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`API 실패: ${res.status} ${res.statusText} ${text}`);
    }
  
    // ✅ DELETE(204 No Content) 같은 경우는 바디가 없을 수 있음
    if (res.status === 204) return null;
  
    // ✅ 성공이면 JSON으로 변환해서 반환
    return await res.json();
  }
  
  export function getPosts() {
    return request("/api/posts");
  }
  
  export function getPost(id) {
    return request(`/api/posts/${id}`);
  }
  
  export function createPost(body) {
    console.log("4) api: POST /api/posts 보냄", body);
    return request("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
  }
  
  export function updatePost(id, body) {
    return request(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
  }
  
  export function deletePost(id) {
    return request(`/api/posts/${id}`, { method: "DELETE" });
  }
  