export type Issuance = {
  id: number
  employeeId: number
  employeeName: string
  workshopId: number
  workshopName: string
  workwearId: number
  workwearName: string
  issuedOn: string
  unitPrice: number | string
  discountPercent: number | string
  discountedPrice: number | string
}

export type CreateIssuancePayload = {
  employeeId: number
  workwearId: number
  issuedOn: string
  discountPercent: number
}
