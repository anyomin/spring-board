import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeaderCell,
  TableRow,
  TableCell,
  Label,
} from "@ui5/webcomponents-react";

export default function PostList({ rows = [], loading = false }) {
  const navigate = useNavigate();

  return (
    <Table
      noDataText={loading ? "로딩중..." : "게시글이 없습니다"}
      style={{ width: "100%" }}
    >
      {/* ✅ 헤더 */}
      <TableRow slot="headerRow">
        <TableHeaderCell style={{ width: "80px" }}>
          <Label>번호</Label>
        </TableHeaderCell>

        <TableHeaderCell>
          <Label>제목</Label>
        </TableHeaderCell>

        <TableHeaderCell style={{ width: "160px" }}>
          <Label>작성자</Label>
        </TableHeaderCell>

        <TableHeaderCell style={{ width: "190px" }}>
          <Label>작성일</Label>
        </TableHeaderCell>
      </TableRow>

      {/* ✅ 본문 */}
      {rows.map((r) => (
        <TableRow
          key={r.id}
          className="boardRow"
          onClick={() => navigate(`/posts/${r.id}`)}
        >
          <TableCell>
            <Label>{r.no}</Label>
          </TableCell>

          <TableCell>
            {/* 제목 말줄임 + 툴팁 */}
            <span
              title={r.title}
              style={{
                display: "block",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {r.title}
            </span>
          </TableCell>

          <TableCell>
            <Label>{r.author}</Label>
          </TableCell>

          <TableCell>
            <Label>{r.createdAtText}</Label>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
