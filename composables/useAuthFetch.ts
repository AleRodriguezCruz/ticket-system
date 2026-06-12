import { useAuthStore } from '~/stores/auth'

export function useAuthFetch() {
  const auth = useAuthStore()

  return (url: string, options: any = {}) => {
    return $fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${auth.token}`
      }
    })
  }
}
