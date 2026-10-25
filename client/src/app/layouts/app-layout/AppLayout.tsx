import { Outlet } from 'react-router-dom'

import { AppHeader } from '@/widgets/app-header'

export const AppLayout = () => {
  return (
    <div className="bg-background min-h-screen">
      <AppHeader />
      <main className="mx-auto w-[min(1400px,calc(100%-48px))] py-10 pb-16 max-sm:w-[min(1400px,calc(100%-32px))] max-sm:pt-7">
        <Outlet />
      </main>
    </div>
  )
}
