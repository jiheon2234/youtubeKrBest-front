export type Paging = {
  hasNext: boolean // 다음 페이지 여부
  lastId: number // 마지막 ID
  limit: number // 한 번에 가져올 데이터 개수
}

export type PagingData<T> = {
  data: T
  paging: Paging
}
