import { request } from '@/shared/api/client'
import type { Workshop, WorkshopPayload } from '../model/types'
export const getWorkshops = () => request<Workshop[]>('/workshops')
export const createWorkshop = (body: WorkshopPayload) => request<Workshop>('/workshops', { method: 'POST', body: JSON.stringify(body) })
export const updateWorkshop = (id: number, body: WorkshopPayload) => request<Workshop>(`/workshops/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteWorkshop = (id: number) => request<void>(`/workshops/${id}`, { method: 'DELETE' })
