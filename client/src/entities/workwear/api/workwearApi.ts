import { request } from '@/shared/api/client'

import type { Workwear } from '../model/types'

export const getWorkwear = () => request<Workwear[]>('/workwear')
