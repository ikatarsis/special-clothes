import { request } from '@/shared/api/client'

export type IssuanceReportRow = {
  workshopId: number
  workshopName: string
  employeeId: number
  employeeName: string
  workwearId: number
  workwearName: string
  issuedOn: string
  unitPrice: number | string
  discountPercent: number | string
  discountedPrice: number | string
}

export type IssuanceReport = {
  period: { month: number; year: number }
  rows: IssuanceReportRow[]
  workshopTotals: { workshopId: number; workshopName: string; total: number | string }[]
  grandTotal: number | string
}

export const getIssuanceReport = (month: number, year: number, workshopId?: number) => {
  const params = new URLSearchParams({ month: String(month), year: String(year) })
  if (workshopId) params.set('workshopId', String(workshopId))
  return request<IssuanceReport>(`/reports/issuances?${params.toString()}`)
}
