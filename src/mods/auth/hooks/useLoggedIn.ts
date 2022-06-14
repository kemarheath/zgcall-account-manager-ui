import { getCsrfToken, getSession, useSession } from 'next-auth/react'
import { useEffect, useMemo } from 'react'

import { useGetUserLogged } from '@/mods/users/hooks/useGetUserLogged'

export enum SESSION_STATUS {
  IS_LOADING = 'loading',
  AUTH = 'authenticated',
  UNAUTH = 'unauthenticated',
}

export const useLoggedIn = () => {
  const { data: session, status } = useSession()

  useEffect(() => {
    const getUser = async () => {
      const session = await getSession()
      const csrfToken = await getCsrfToken()

      console.log('TEST: getSession(): ', session)
      console.log('TEST: getCsrfToken(): ', csrfToken)
    }

    getUser()
  }, [])

  console.log('SESSION: ', session)
  console.log('STATUS: ', status)

  const isLoading = useMemo(
    () => status === SESSION_STATUS.IS_LOADING,
    [status]
  )

  const isAuthenticated = useMemo(
    () => status === SESSION_STATUS.AUTH,
    [status]
  )

  const isUnauthenticated = useMemo(
    () => status === SESSION_STATUS.UNAUTH,
    [status]
  )

  const { user } = useGetUserLogged({
    ref: session?.user?.accessKeyId as string,
    enabled: isAuthenticated,
  })

  return {
    user: {
      ...session?.user,
      ...user,
      avatar: user?.avatar || session?.user?.image,
    },
    status,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
  }
}
