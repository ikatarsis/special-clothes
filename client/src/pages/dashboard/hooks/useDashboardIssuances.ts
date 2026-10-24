import { useCallback, useEffect, useState } from 'react'

import { getIssuances, type Issuance } from '@/entities/issuance'

export const useDashboardIssuances = () => {
  const [issuances, setIssuances] = useState<Issuance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setIssuances(await getIssuances())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось загрузить выдачи.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    void getIssuances()
      .then((data) => {
        if (isActive) {
          setIssuances(data)
        }
      })
      .catch((requestError: unknown) => {
        if (isActive) {
          setError(requestError instanceof Error ? requestError.message : 'Не удалось загрузить выдачи.')
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  return {
    recentIssuances: issuances.slice(0, 5),
    isLoading,
    error,
    reload,
  }
}
