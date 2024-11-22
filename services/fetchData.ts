// services/videoService.ts

import type { PagingData } from '~/types/Paging'
import type { VideoRes } from '~/types/VideoRes'
import type { CommentRes } from '~/types/CommentRes'

export const fetchVideosFromApi = async (
  targetDate: string,
  lastId: number,
): Promise<PagingData<VideoRes[]>> => {
  try {
    const response = await $fetch<PagingData<VideoRes[]>>(
      'http://localhost:8080/api/video',
      {
        method: 'GET',
        params: {
          targetDate,
          lastId,
        },
      },
    )
    return response
  } catch (error: any) {
    console.error(error)
    throw new Error(
      error.message || '비디오 데이터를 가져오는 중 오류가 발생했습니다.',
    )
  }
}

export const fetchVideoById = async (videoId: string): Promise<VideoRes> => {
  try {
    const response = await $fetch<VideoRes>(
      `http://localhost:8080/api/video/${videoId}`,
      {
        method: 'get',
      },
    )

    return response
  } catch (error: any) {
    console.error(error)
    throw new Error(
      error.message || '비디오 데이터를 가져오는 중 오류가 발생했습니다.',
    )
  }
}

export const fetchComments = async (
  videoId: string,
  lastId: number = -1,
): Promise<PagingData<CommentRes[]>> => {
  try {
    const response = await $fetch<PagingData<CommentRes[]>>(
      `http://localhost:8080/api/video/${videoId}/comments`,
      {
        params: {
          lastId: lastId,
        },
      },
    )
    return response
  } catch (error: any) {
    console.error(error)
    throw new Error(
      error.message || '비디오 데이터를 가져오는 중 오류가 발생했습니다.',
    )
  }
}
