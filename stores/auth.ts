import type { User } from '~/types/User'
import { getUser } from '~/services/fetchData'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const authUser = ref<User | null>(null)

    const signIn = async (email: string, password: string) => {
      const foundUser = await getUser(email, password)

      if (!foundUser) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Invalid email or password',
        })
      }
      setUser(foundUser)
    }

    const setUser = (user: User | null) => {
      authUser.value = user
    }

    const signOut = () => setUser(null)

    return {
      signIn,
      signOut,
      currentUser: authUser,
      isAuthenticated: computed(() => !!authUser.value),
    }
  },
  { persist: true },
)
