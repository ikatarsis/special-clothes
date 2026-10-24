import { PlusIcon } from 'lucide-react'
import { Controller } from 'react-hook-form'

import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import { useCreateIssuance } from '../model/useCreateIssuance'

type CreateIssuanceDialogProps = {
  onCreated: () => Promise<void>
}

export const CreateIssuanceDialog = ({ onCreated }: CreateIssuanceDialogProps) => {
  const {
    form,
    open,
    employees,
    workwear,
    referenceError,
    isReferenceLoading,
    submitError,
    handleOpenChange,
    handleSubmit,
  } = useCreateIssuance({ onCreated })

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button><PlusIcon />Новая выдача</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Новая выдача</DialogTitle>
          <DialogDescription>Укажите сотрудника, вид спецодежды и условия выдачи.</DialogDescription>
        </DialogHeader>

        {referenceError ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{referenceError}</p> : null}

        <form className="grid gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="employeeId">Сотрудник</Label>
            <Controller control={form.control} name="employeeId" render={({ field }) => (
              <Select disabled={isReferenceLoading || Boolean(referenceError)} onValueChange={(value) => field.onChange(Number(value))} value={field.value > 0 ? String(field.value) : undefined}>
                <SelectTrigger className="w-full" id="employeeId"><SelectValue placeholder="Выберите сотрудника" /></SelectTrigger>
                <SelectContent>{employees.map((employee) => <SelectItem key={employee.id} value={String(employee.id)}>{employee.fullName} · {employee.workshopName}</SelectItem>)}</SelectContent>
              </Select>
            )} />
            {form.formState.errors.employeeId ? <p className="m-0 text-sm text-destructive">{form.formState.errors.employeeId.message}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="workwearId">Вид спецодежды</Label>
            <Controller control={form.control} name="workwearId" render={({ field }) => (
              <Select disabled={isReferenceLoading || Boolean(referenceError)} onValueChange={(value) => field.onChange(Number(value))} value={field.value > 0 ? String(field.value) : undefined}>
                <SelectTrigger className="w-full" id="workwearId"><SelectValue placeholder="Выберите спецодежду" /></SelectTrigger>
                <SelectContent>{workwear.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}</SelectContent>
              </Select>
            )} />
            {form.formState.errors.workwearId ? <p className="m-0 text-sm text-destructive">{form.formState.errors.workwearId.message}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="issuedOn">Дата выдачи</Label>
              <Input id="issuedOn" type="date" {...form.register('issuedOn')} />
              {form.formState.errors.issuedOn ? <p className="m-0 text-sm text-destructive">{form.formState.errors.issuedOn.message}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discountPercent">Скидка, %</Label>
              <Input id="discountPercent" max="100" min="0" step="0.01" type="number" {...form.register('discountPercent')} />
              {form.formState.errors.discountPercent ? <p className="m-0 text-sm text-destructive">{form.formState.errors.discountPercent.message}</p> : null}
            </div>
          </div>

          {submitError ? <p className="m-0 text-sm text-destructive">{submitError}</p> : null}
          <DialogFooter><Button disabled={form.formState.isSubmitting || isReferenceLoading} type="submit">{form.formState.isSubmitting ? 'Сохраняем…' : 'Сохранить'}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
