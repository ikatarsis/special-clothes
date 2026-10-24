import { request } from '@/shared/api/client'

import type { CreateIssuancePayload, Issuance } from '../model/types'

export const getIssuances = () => request<Issuance[]>('/issuances')

export const createIssuance = (payload: CreateIssuancePayload) =>
  request<Issuance>('/issuances', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
