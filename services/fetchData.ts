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

export const fetchCloudfrontSignedURL = async (
  targetDate: string,
): Promise<string> => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(targetDate)) {
    throw new Error('targetDate must be in yyyy-mm-dd format')
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/video-report?targetDate=${encodeURIComponent(targetDate)}`,
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      )
    }

    const signedURL = await response.text()
    console.log(signedURL)
    return signedURL
  } catch (error: any) {
    console.error('Error fetching signed URL:', error.message || error)
    throw new Error(
      error.message || 'Unknown error occurred while fetching signed URL',
    )
  }
}
