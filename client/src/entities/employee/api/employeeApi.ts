import { request } from '@/shared/api/client'

import type { Employee } from '../model/types'

export const getEmployees = () => request<Employee[]>('/employees')
