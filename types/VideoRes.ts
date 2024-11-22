export type VideoRes = {
  commentCount: number // 댓글 수
  description: string // 설명
  id: number // 고유 ID
  published_at: Date // 게시 날짜 (ISO 8601 형식)
  saved_at: Date // 저장 날짜 (YYYY-MM-DD 형식)
  tags: string[] // 태그 배열
  thumbnail_url: string // 썸네일 URL
  title: string // 제목
  viewCount: number // 조회 수
  yId: string // YouTube 영상 ID
}
