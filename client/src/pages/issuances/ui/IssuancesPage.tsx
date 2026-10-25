import { Pencil, Plus, Trash2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'

import { useIssuancesPage } from '../hooks/useIssuancesPage'

export const IssuancesPage = () => {
  const page = useIssuancesPage()
  const canCreate = page.employees.length > 0 && page.workwear.length > 0
  const dialogTitle = page.dialog.mode === 'edit' ? 'Редактировать выдачу' : 'Новая выдача'

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-medium">Учёт</p>
          <h1 className="text-primary mt-1 text-3xl font-semibold tracking-tight">Выдачи</h1>
          <p className="text-muted-foreground mt-2">Журнал выданной сотрудникам спецодежды.</p>
        </div>
        <Button disabled={!canCreate} onClick={page.openCreateDialog}>
          <Plus />
          Оформить выдачу
        </Button>
      </div>
      {!canCreate && !page.isLoading && (
        <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Для выдачи нужны хотя бы один сотрудник и одна позиция спецодежды.
        </p>
      )}
      {page.error && (
        <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-md border px-4 py-3 text-sm">
          {page.error}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Сотрудник</TableHead>
              <TableHead>Цех</TableHead>
              <TableHead>Спецодежда</TableHead>
              <TableHead className="text-right">Итого</TableHead>
              <TableHead className="w-28 text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.isLoading && (
              <TableRow>
                <TableCell className="text-muted-foreground py-10 text-center" colSpan={6}>
                  Загружаем выдачи…
                </TableCell>
              </TableRow>
            )}
            {!page.isLoading && !page.issuances.length && (
              <TableRow>
                <TableCell className="text-muted-foreground py-10 text-center" colSpan={6}>
                  Выдач пока нет.
                </TableCell>
              </TableRow>
            )}
            {page.issuances.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatDate(item.issuedOn)}</TableCell>
                <TableCell className="font-medium">{item.employeeName}</TableCell>
                <TableCell>{item.workshopName}</TableCell>
                <TableCell>
                  {item.workwearName}
                  <span className="text-muted-foreground block text-xs">
                    Скидка {item.discountPercent}%
                  </span>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(item.discountedPrice)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      aria-label="Изменить выдачу"
                      onClick={() => page.openEditDialog(item)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Pencil />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button aria-label="Удалить выдачу" size="icon-sm" variant="ghost">
                          <Trash2 className="text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Запись о выдаче будет удалена без возможности восстановления.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => void page.removeIssuance(item)}
                            variant="destructive"
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog
        onOpenChange={(isOpen) => !isOpen && page.closeDialog()}
        open={page.dialog.mode !== 'closed'}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              Цена подставится автоматически из справочника спецодежды.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Сотрудник</Label>
              <Select onValueChange={page.setEmployeeId} value={page.employeeId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите сотрудника" />
                </SelectTrigger>
                <SelectContent>
                  {page.employees.map((employee) => (
                    <SelectItem key={employee.id} value={String(employee.id)}>
                      {employee.fullName} · {employee.workshopName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Спецодежда</Label>
              <Select onValueChange={page.setWorkwearId} value={page.workwearId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите позицию" />
                </SelectTrigger>
                <SelectContent>
                  {page.workwear.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name} · {formatCurrency(item.unitPrice)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="issued-on">Дата выдачи</Label>
                <Input
                  id="issued-on"
                  onChange={(event) => page.setIssuedOn(event.target.value)}
                  type="date"
                  value={page.issuedOn}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount">Скидка, %</Label>
                <Input
                  id="discount"
                  inputMode="decimal"
                  onChange={(event) => page.setDiscountPercent(event.target.value)}
                  value={page.discountPercent}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={page.isSaving} onClick={page.closeDialog} variant="outline">
              Отмена
            </Button>
            <Button disabled={page.isSaving} onClick={() => void page.submit()}>
              {page.isSaving ? 'Сохраняем…' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
