import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Issuance } from '@/entities/issuance'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { Button } from '@/shared/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'

type RecentIssuancesTableProps = {
  issuances: Issuance[]
  isLoading: boolean
  error: string | null
}

export const RecentIssuancesTable = ({
  issuances,
  isLoading,
  error,
}: RecentIssuancesTableProps) => {
  return (
    <section className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="m-0 text-xl font-semibold tracking-tight">Последние выдачи</h2>
          <p className="text-muted-foreground mt-1 mb-0 text-sm">
            Недавно добавленные записи журнала выдач.
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to="/issuances">
            Все выдачи <ArrowRightIcon />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground m-0 py-8 text-sm">Загружаем выдачи…</p>
      ) : null}
      {!isLoading && error ? (
        <p className="border-destructive/30 bg-destructive/10 text-destructive m-0 rounded-md border p-3 text-sm">
          {error}
        </p>
      ) : null}
      {!isLoading && !error && issuances.length === 0 ? (
        <p className="text-muted-foreground m-0 py-8 text-sm">
          Выдач пока нет. Создайте первую запись.
        </p>
      ) : null}

      {!isLoading && !error && issuances.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Сотрудник</TableHead>
              <TableHead>Цех</TableHead>
              <TableHead>Спецодежда</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="text-right">Итог</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issuances.map((issuance) => (
              <TableRow key={issuance.id}>
                <TableCell className="font-medium">{issuance.employeeName}</TableCell>
                <TableCell>{issuance.workshopName}</TableCell>
                <TableCell>{issuance.workwearName}</TableCell>
                <TableCell>{formatDate(issuance.issuedOn)}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(issuance.discountedPrice)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </section>
  )
}
