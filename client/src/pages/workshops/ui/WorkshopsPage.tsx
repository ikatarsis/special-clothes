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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'

import { useWorkshopsPage } from '../hooks/useWorkshopsPage'

export const WorkshopsPage = () => {
  const {
    workshops,
    isLoading,
    isSaving,
    error,
    dialog,
    name,
    setName,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submit,
    removeWorkshop,
  } = useWorkshopsPage()

  const dialogTitle = dialog.mode === 'edit' ? 'Редактировать цех' : 'Новый цех'

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-medium">Справочник</p>
          <h1 className="text-primary mt-1 text-3xl font-semibold tracking-tight">Цеха</h1>
          <p className="text-muted-foreground mt-2">
            Подразделения предприятия, к которым привязаны сотрудники.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus />
          Добавить цех
        </Button>
      </div>

      {error && (
        <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-md border px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Название</TableHead>
              <TableHead className="w-32 text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell className="text-muted-foreground py-10 text-center" colSpan={3}>
                  Загружаем цеха…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && workshops.length === 0 && (
              <TableRow>
                <TableCell className="text-muted-foreground py-10 text-center" colSpan={3}>
                  Цехов пока нет.
                </TableCell>
              </TableRow>
            )}
            {workshops.map((workshop) => (
              <TableRow key={workshop.id}>
                <TableCell className="text-muted-foreground font-mono text-xs">
                  #{workshop.id}
                </TableCell>
                <TableCell className="font-medium">{workshop.name}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      aria-label={`Изменить ${workshop.name}`}
                      onClick={() => openEditDialog(workshop)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Pencil />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          aria-label={`Удалить ${workshop.name}`}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить цех?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Цех «{workshop.name}» будет удалён без возможности восстановления.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => void removeWorkshop(workshop)}
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

      <Dialog onOpenChange={(isOpen) => !isOpen && closeDialog()} open={dialog.mode !== 'closed'}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>Укажите название подразделения.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="workshop-name">Название</Label>
            <Input
              autoFocus
              id="workshop-name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Например, Швейный цех"
              value={name}
            />
          </div>
          <DialogFooter>
            <Button disabled={isSaving} onClick={closeDialog} variant="outline">
              Отмена
            </Button>
            <Button disabled={isSaving} onClick={() => void submit()}>
              {isSaving ? 'Сохраняем…' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
