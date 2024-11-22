export type CommentRes = {
  id: number // 댓글 고유 ID
  yId: string // YouTube 댓글 ID
  videoId: number // 연결된 비디오 ID
  authorName: string // 사용자 ID (비어 있을 수 있음)
  authorImage: string // 작성자 프로필 이미지 URL
  likeCount: number // 좋아요 수
  publishedAt: string // 게시 날짜 (ISO 8601 형식)
  updatedAt: string // 업데이트 날짜 (ISO 8601 형식)
  totalReplyCount: number // 답글 수
  textDisplay: string
}
