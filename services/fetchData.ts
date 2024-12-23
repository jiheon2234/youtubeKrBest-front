// services/videoService.ts

import type { PagingData } from '~/types/Paging'
import type { VideoRes } from '~/types/VideoRes'
import type { CommentRes } from '~/types/CommentRes'
import type { User } from '~/types/User'
const config = useRuntimeConfig()
const BASEURL = config.public.apiBaseUrl || 'https://localhost:8081'

export const fetchVideosFromApi = async (
  targetDate: string,
  lastId: number,
): Promise<PagingData<VideoRes[]>> => {
  try {
    const response = await $fetch<PagingData<VideoRes[]>>(
      `${BASEURL}/api/video`,
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
    const response = await $fetch<VideoRes>(`${BASEURL}/api/video/${videoId}`, {
      method: 'get',
    })

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
      `${BASEURL}/api/video/${videoId}/comments`,
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
  token: string,
): Promise<string> => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(targetDate)) {
    throw new Error('targetDate must be in yyyy-mm-dd format')
  }

  try {
    const response = await fetch(
      `${BASEURL}/api/video-report?targetDate=${encodeURIComponent(targetDate)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
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

export const getUser = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const res = await $fetch.raw(`${BASEURL}/api/user/sign-in`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        email,
        password,
      },
    })
    const user = res._data as User
    const token = res.headers.get('authorization')
    if (!token) {
      throw new Error()
    }
    user.token = token.substring(7)
    return user
  } catch (error: any) {
    console.error(error)
    throw createError({
      statusCode: 419,
      statusMessage: 'something wrong: ㅠㅠ',
    })
  }
}

export const signUp = async (
  email: string,
  password: string,
  description: string,
): Promise<void> => {
  try {
    const response = await fetch(`${BASEURL}/api/user/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        description,
      }),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()

    console.log('User successfully registered:', data)
  } catch (error: any) {
    console.error('Sign-in failed:', error)
    throw new Error(error.message || '회원가입 실패')
  }
}
