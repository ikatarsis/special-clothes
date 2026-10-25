import { CreateIssuanceDialog } from '@/features/create-issuance'
import { RecentIssuancesTable } from '@/widgets/recent-issuances'

import { useDashboardIssuances } from '../hooks/useDashboardIssuances.ts'

export const DashboardPage = () => {
  const { recentIssuances, isLoading, error, reload } = useDashboardIssuances()

  return (
    <div className="grid gap-10">
      <section className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[720px]">
          <p className="text-primary mb-2.5 text-sm font-semibold">Система учёта</p>
          <h1 className="text-primary m-0 text-[clamp(32px,5vw,52px)] leading-[1.05] font-bold tracking-[-0.05em]">
            Учёт спецодежды
          </h1>
          <p className="text-muted-foreground mt-[18px] mb-0 max-w-[620px] text-lg leading-relaxed">
            Контролируйте выдачи, сотрудников, цеха и стоимость спецодежды в одном месте.
          </p>
        </div>
        <CreateIssuanceDialog onCreated={reload} />
      </section>

      <RecentIssuancesTable error={error} isLoading={isLoading} issuances={recentIssuances} />
    </div>
  )
}
