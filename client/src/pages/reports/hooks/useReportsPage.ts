import { useCallback, useEffect, useState } from 'react'

import { getIssuanceReport, type IssuanceReport } from '@/entities/issuance'
import { getWorkshops, type Workshop } from '@/entities/workshop'

const currentDate = new Date()
const initialMonth = String(currentDate.getMonth() + 1)
const initialYear = String(currentDate.getFullYear())

export const useReportsPage = () => {
  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)
  const [workshopId, setWorkshopId] = useState('all')
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [report, setReport] = useState<IssuanceReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      setReport(
        await getIssuanceReport(
          Number(month),
          Number(year),
          workshopId === 'all' ? undefined : Number(workshopId),
        ),
      )
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось построить отчёт.')
    } finally {
      setIsLoading(false)
    }
  }, [month, year, workshopId])

  useEffect(() => {
    let isActive = true
    void getWorkshops()
      .then((data) => {
        if (isActive) setWorkshops(data)
      })
      .catch(() => undefined)
    void getIssuanceReport(Number(initialMonth), Number(initialYear))
      .then((data) => {
        if (isActive) setReport(data)
      })
      .catch((requestError: unknown) => {
        if (isActive)
          setError(
            requestError instanceof Error ? requestError.message : 'Не удалось построить отчёт.',
          )
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })
    return () => {
      isActive = false
    }
  }, [])

  return {
    month,
    year,
    workshopId,
    workshops,
    report,
    isLoading,
    error,
    setMonth,
    setYear,
    setWorkshopId,
    generate,
  }
}
