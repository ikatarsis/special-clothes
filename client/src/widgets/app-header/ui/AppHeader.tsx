import { NavLink } from 'react-router-dom'

import { navigationItems } from '../model/navigation.ts'

export const AppHeader = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/94 backdrop-blur-md">
      <div className="mx-auto flex min-h-[68px] w-[min(1400px,calc(100%-48px))] items-center justify-between gap-9 max-sm:w-[min(1400px,calc(100%-32px))] max-sm:gap-[18px]">
        <NavLink className="shrink-0 text-[15px] font-extrabold tracking-[0.08em] text-gray-900 no-underline" to="/">
          СПЕЦОДЕЖДА
        </NavLink>
        <nav aria-label="Основная навигация" className="flex min-w-0 self-stretch items-center gap-1 overflow-x-auto">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `inline-flex h-10 shrink-0 items-center rounded-[7px] px-3 text-sm font-medium no-underline transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white hover:bg-gray-900 hover:text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
              end={item.to === '/'}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
