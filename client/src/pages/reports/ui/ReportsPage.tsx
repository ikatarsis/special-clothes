import { FileBarChart } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'

import { useReportsPage } from '../hooks/useReportsPage'

export const ReportsPage = () => {
  const page = useReportsPage()

  return (
    <section className="space-y-6">
      <div>
        <p className="text-primary text-sm font-medium">Аналитика</p>
        <h1 className="text-primary mt-1 text-3xl font-semibold tracking-tight">Отчёты</h1>
        <p className="text-muted-foreground mt-2">
          Ведомость выдачи спецодежды за выбранный месяц.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-4 rounded-xl border bg-white p-5 shadow-sm">
        <div className="grid gap-2">
          <Label htmlFor="report-month">Месяц</Label>
          <Select onValueChange={page.setMonth} value={page.month}>
            <SelectTrigger id="report-month" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                'Январь',
                'Февраль',
                'Март',
                'Апрель',
                'Май',
                'Июнь',
                'Июль',
                'Август',
                'Сентябрь',
                'Октябрь',
                'Ноябрь',
                'Декабрь',
              ].map((name, index) => (
                <SelectItem key={name} value={String(index + 1)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="report-year">Год</Label>
          <Input
            id="report-year"
            onChange={(event) => page.setYear(event.target.value)}
            type="number"
            value={page.year}
          />
        </div>
        <div className="grid gap-2">
          <Label>Цех</Label>
          <Select onValueChange={page.setWorkshopId} value={page.workshopId}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все цеха</SelectItem>
              {page.workshops.map((workshop) => (
                <SelectItem key={workshop.id} value={String(workshop.id)}>
                  {workshop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => void page.generate()}>
          <FileBarChart />
          Сформировать
        </Button>
      </div>
      {page.error && (
        <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-md border px-4 py-3 text-sm">
          {page.error}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-muted-foreground text-sm">Общая сумма</p>
          <p className="mt-2 text-3xl font-semibold">
            {formatCurrency(page.report?.grandTotal ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-muted-foreground text-sm">Количество выдач</p>
          <p className="mt-2 text-3xl font-semibold">{page.report?.rows.length ?? 0}</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Цех</TableHead>
              <TableHead>Сотрудник</TableHead>
              <TableHead>Спецодежда</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.isLoading && (
              <TableRow>
                <TableCell className="text-muted-foreground py-10 text-center" colSpan={5}>
                  Формируем отчёт…
                </TableCell>
              </TableRow>
            )}
            {!page.isLoading && !page.report?.rows.length && (
              <TableRow>
                <TableCell className="text-muted-foreground py-10 text-center" colSpan={5}>
                  За выбранный период выдач нет.
                </TableCell>
              </TableRow>
            )}
            {page.report?.rows.map((row) => (
              <TableRow key={`${row.employeeId}-${row.workwearId}-${row.issuedOn}`}>
                <TableCell>{row.workshopName}</TableCell>
                <TableCell className="font-medium">{row.employeeName}</TableCell>
                <TableCell>{row.workwearName}</TableCell>
                <TableCell>{formatDate(row.issuedOn)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.discountedPrice)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
