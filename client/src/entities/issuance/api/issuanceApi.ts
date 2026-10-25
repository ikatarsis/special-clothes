import { request } from '@/shared/api/client'

import type { CreateIssuancePayload, Issuance } from '../model/types'

export const getIssuances = () => request<Issuance[]>('/issuances')

export const createIssuance = (payload: CreateIssuancePayload) =>
  request<Issuance>('/issuances', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateIssuance = (id: number, payload: CreateIssuancePayload) =>
  request<Issuance>(`/issuances/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const deleteIssuance = (id: number) =>
  request<void>(`/issuances/${id}`, { method: 'DELETE' })
