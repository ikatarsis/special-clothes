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
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'

import { useEmployeesPage } from '../hooks/useEmployeesPage'

export const EmployeesPage = () => {
  const page = useEmployeesPage()
  const dialogTitle = page.dialog.mode === 'edit' ? 'Редактировать сотрудника' : 'Новый сотрудник'

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-medium">Справочник</p>
          <h1 className="text-primary mt-1 text-3xl font-semibold tracking-tight">Сотрудники</h1>
          <p className="text-muted-foreground mt-2">
            Сотрудники предприятия и цеха, в которых они работают.
          </p>
        </div>
        <Button disabled={!page.workshops.length} onClick={page.openCreateDialog}>
          <Plus />
          Добавить сотрудника
        </Button>
      </div>
      {!page.workshops.length && !page.isLoading && (
        <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Сначала создайте хотя бы один цех.
        </p>
      )}
      {page.error && (
        <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-md border px-4 py-3 text-sm">
          {page.error}
        </p>
      )}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Сотрудник</TableHead>
              <TableHead>Должность</TableHead>
              <TableHead>Цех</TableHead>
              <TableHead className="w-32 text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.isLoading && (
              <TableRow>
                <TableCell className="text-muted-foreground py-10 text-center" colSpan={4}>
                  Загружаем сотрудников…
                </TableCell>
              </TableRow>
            )}
            {!page.isLoading && !page.employees.length && (
              <TableRow>
                <TableCell className="text-muted-foreground py-10 text-center" colSpan={4}>
                  Сотрудников пока нет.
                </TableCell>
              </TableRow>
            )}
            {page.employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.fullName}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.workshopName}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      aria-label={`Изменить ${employee.fullName}`}
                      onClick={() => page.openEditDialog(employee)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Pencil />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          aria-label={`Удалить ${employee.fullName}`}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить сотрудника?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Записи о выдаче спецодежды для него тоже могут быть затронуты.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => void page.removeEmployee(employee)}
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
            <DialogDescription>Заполните основные данные сотрудника.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="employee-name">ФИО</Label>
              <Input
                autoFocus
                id="employee-name"
                onChange={(event) => page.setFullName(event.target.value)}
                value={page.fullName}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employee-position">Должность</Label>
              <Input
                id="employee-position"
                onChange={(event) => page.setPosition(event.target.value)}
                value={page.position}
              />
            </div>
            <div className="grid gap-2">
              <Label>Цех</Label>
              <Select onValueChange={page.setWorkshopId} value={page.workshopId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите цех" />
                </SelectTrigger>
                <SelectContent>
                  {page.workshops.map((workshop) => (
                    <SelectItem key={workshop.id} value={String(workshop.id)}>
                      {workshop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
