import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getEmployees, type Employee } from '@/entities/employee'
import { createIssuance } from '@/entities/issuance'
import { getWorkwear, type Workwear } from '@/entities/workwear'

const issuanceSchema = z.object({
  employeeId: z.coerce.number().int().positive('Выберите сотрудника.'),
  workwearId: z.coerce.number().int().positive('Выберите вид спецодежды.'),
  issuedOn: z.string().min(1, 'Укажите дату выдачи.'),
  discountPercent: z.coerce.number().min(0, 'Скидка не может быть меньше 0%.').max(100, 'Скидка не может быть больше 100%.'),
})

type IssuanceFormValues = z.infer<typeof issuanceSchema>

type UseCreateIssuanceParams = {
  onCreated: () => Promise<void>
}

const getToday = () => new Date().toISOString().slice(0, 10)

const initialValues: IssuanceFormValues = {
  employeeId: 0,
  workwearId: 0,
  issuedOn: getToday(),
  discountPercent: 0,
}

export const useCreateIssuance = ({ onCreated }: UseCreateIssuanceParams) => {
  const [open, setOpen] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [workwear, setWorkwear] = useState<Workwear[]>([])
  const [referenceError, setReferenceError] = useState<string | null>(null)
  const [isReferenceLoading, setIsReferenceLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const form = useForm<IssuanceFormValues>({
    resolver: zodResolver(issuanceSchema),
    defaultValues: initialValues,
  })

  const loadReferences = async () => {
    setIsReferenceLoading(true)
    setReferenceError(null)

    try {
      const [employeesData, workwearData] = await Promise.all([getEmployees(), getWorkwear()])
      setEmployees(employeesData)
      setWorkwear(workwearData)
    } catch (error) {
      setReferenceError(error instanceof Error ? error.message : 'Не удалось загрузить справочники.')
    } finally {
      setIsReferenceLoading(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (nextOpen) {
      void loadReferences()
      return
    }

    form.reset({ ...initialValues, issuedOn: getToday() })
    setSubmitError(null)
  }

  const handleSubmit = async (values: IssuanceFormValues) => {
    setSubmitError(null)

    try {
      await createIssuance(values)
      await onCreated()
      handleOpenChange(false)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Не удалось создать выдачу.')
    }
  }

  return {
    form,
    open,
    employees,
    workwear,
    referenceError,
    isReferenceLoading,
    submitError,
    handleOpenChange,
    handleSubmit,
  }
}
