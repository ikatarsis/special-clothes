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
import { formatCurrency } from '@/shared/lib/format'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'

import { useWorkwearPage } from '../hooks/useWorkwearPage'

export const WorkwearPage = () => {
  const page = useWorkwearPage()
  const dialogTitle = page.dialog.mode === 'edit' ? 'Редактировать позицию' : 'Новая позиция'

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-medium">Справочник</p>
          <h1 className="text-primary mt-1 text-3xl font-semibold tracking-tight">Спецодежда</h1>
          <p className="text-muted-foreground mt-2">
            Номенклатура спецодежды и её базовая стоимость.
          </p>
        </div>
        <Button onClick={page.openCreateDialog}>
          <Plus />
          Добавить позицию
        </Button>
      </div>
      {page.error && (
        <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-md border px-4 py-3 text-sm">
          {page.error}
        </p>
      )}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Наименование</TableHead>
              <TableHead className="text-right">Цена</TableHead>
              <TableHead className="w-32 text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.isLoading && (
              <TableRow>
                <TableCell className="text-muted-foreground py-10 text-center" colSpan={3}>
                  Загружаем позиции…
                </TableCell>
              </TableRow>
            )}
            {!page.isLoading && !page.items.length && (
              <TableRow>
                <TableCell className="text-muted-foreground py-10 text-center" colSpan={3}>
                  Позиций пока нет.
                </TableCell>
              </TableRow>
            )}
            {page.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      aria-label={`Изменить ${item.name}`}
                      onClick={() => page.openEditDialog(item)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Pencil />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button aria-label={`Удалить ${item.name}`} size="icon-sm" variant="ghost">
                          <Trash2 className="text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить позицию?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Позиция «{item.name}» будет удалена без возможности восстановления.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => void page.removeWorkwear(item)}
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
            <DialogDescription>Цена будет использоваться при создании выдачи.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="workwear-name">Наименование</Label>
              <Input
                autoFocus
                id="workwear-name"
                onChange={(event) => page.setName(event.target.value)}
                value={page.name}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workwear-price">Цена, ₽</Label>
              <Input
                id="workwear-price"
                inputMode="decimal"
                onChange={(event) => page.setUnitPrice(event.target.value)}
                placeholder="0.00"
                value={page.unitPrice}
              />
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
