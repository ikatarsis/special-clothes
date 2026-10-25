import { request } from '@/shared/api/client'

import type { Workwear } from '../model/types'

export const getWorkwear = () => request<Workwear[]>('/workwear')

export const createWorkwear = (body: import('../model/types').WorkwearPayload) =>
  request<Workwear>('/workwear', { method: 'POST', body: JSON.stringify(body) })

export const updateWorkwear = (id: number, body: import('../model/types').WorkwearPayload) =>
  request<Workwear>(`/workwear/${id}`, { method: 'PUT', body: JSON.stringify(body) })

export const deleteWorkwear = (id: number) => request<void>(`/workwear/${id}`, { method: 'DELETE' })
