import { request } from '@/shared/api/client'

import type { Employee } from '../model/types'

export const getEmployees = () => request<Employee[]>('/employees')

export const createEmployee = (body: import('../model/types').EmployeePayload) =>
  request<Employee>('/employees', { method: 'POST', body: JSON.stringify(body) })

export const updateEmployee = (id: number, body: import('../model/types').EmployeePayload) =>
  request<Employee>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(body) })

export const deleteEmployee = (id: number) =>
  request<void>(`/employees/${id}`, { method: 'DELETE' })
