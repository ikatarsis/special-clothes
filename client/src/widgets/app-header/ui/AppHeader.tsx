import { NavLink } from 'react-router-dom'

import { navigationItems } from '../model/navigation.ts'

export const AppHeader = () => {
  return (
    <header className="border-border bg-background/94 sticky top-0 z-10 border-b backdrop-blur-md">
      <div className="mx-auto flex min-h-[68px] w-[min(1400px,calc(100%-48px))] items-center justify-between gap-9 max-sm:w-[min(1400px,calc(100%-32px))] max-sm:gap-[18px]">
        <NavLink
          className="text-primary shrink-0 text-[15px] font-extrabold tracking-[0.08em] no-underline"
          to="/"
        >
          СПЕЦОДЕЖДА
        </NavLink>
        <nav
          aria-label="Основная навигация"
          className="flex min-w-0 items-center gap-4 self-stretch overflow-x-auto"
        >
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `inline-flex h-10 shrink-0 items-center rounded-[7px] px-3 text-sm font-medium no-underline transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
