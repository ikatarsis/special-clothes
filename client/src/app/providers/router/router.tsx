import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '../../layouts/app-layout/AppLayout.tsx'
import { DashboardPage } from '@/pages/dashboard'
import { EmployeesPage } from '@/pages/employees'
import { IssuancesPage } from '@/pages/issuances'
import { NotFoundPage } from '@/pages/not-found'
import { ReportsPage } from '@/pages/reports'
import { WorkshopsPage } from '@/pages/workshops'
import { WorkwearPage } from '@/pages/workwear'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'workshops', element: <WorkshopsPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'workwear', element: <WorkwearPage /> },
      { path: 'issuances', element: <IssuancesPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
