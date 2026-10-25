import { useCallback, useEffect, useState } from 'react'

import { getEmployees, type Employee } from '@/entities/employee'
import {
  createIssuance,
  deleteIssuance,
  getIssuances,
  updateIssuance,
  type Issuance,
} from '@/entities/issuance'
import { getWorkwear, type Workwear } from '@/entities/workwear'

type DialogState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; issuance: Issuance }

const getToday = () => new Date().toISOString().slice(0, 10)

export const useIssuancesPage = () => {
  const [issuances, setIssuances] = useState<Issuance[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [workwear, setWorkwear] = useState<Workwear[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })
  const [employeeId, setEmployeeId] = useState('')
  const [workwearId, setWorkwearId] = useState('')
  const [issuedOn, setIssuedOn] = useState(getToday())
  const [discountPercent, setDiscountPercent] = useState('0')

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [issuanceData, employeeData, workwearData] = await Promise.all([
        getIssuances(),
        getEmployees(),
        getWorkwear(),
      ])
      setIssuances(issuanceData)
      setEmployees(employeeData)
      setWorkwear(workwearData)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось загрузить журнал выдачи.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true
    void Promise.all([getIssuances(), getEmployees(), getWorkwear()])
      .then(([issuanceData, employeeData, workwearData]) => {
        if (isActive) {
          setIssuances(issuanceData)
          setEmployees(employeeData)
          setWorkwear(workwearData)
        }
      })
      .catch((requestError: unknown) => {
        if (isActive)
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Не удалось загрузить журнал выдачи.',
          )
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })
    return () => {
      isActive = false
    }
  }, [])

  const openCreateDialog = () => {
    setEmployeeId(employees[0] ? String(employees[0].id) : '')
    setWorkwearId(workwear[0] ? String(workwear[0].id) : '')
    setIssuedOn(getToday())
    setDiscountPercent('0')
    setDialog({ mode: 'create' })
  }
  const openEditDialog = (issuance: Issuance) => {
    setEmployeeId(String(issuance.employeeId))
    setWorkwearId(String(issuance.workwearId))
    setIssuedOn(issuance.issuedOn)
    setDiscountPercent(String(issuance.discountPercent))
    setDialog({ mode: 'edit', issuance })
  }
  const closeDialog = () => {
    if (!isSaving) setDialog({ mode: 'closed' })
  }

  const submit = async () => {
    const payload = {
      employeeId: Number(employeeId),
      workwearId: Number(workwearId),
      issuedOn,
      discountPercent: Number(discountPercent.replace(',', '.')),
    }
    if (
      !payload.employeeId ||
      !payload.workwearId ||
      !payload.issuedOn ||
      !Number.isFinite(payload.discountPercent) ||
      payload.discountPercent < 0 ||
      payload.discountPercent > 100
    ) {
      setError('Заполните данные выдачи; скидка — от 0 до 100%.')
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      if (dialog.mode === 'edit') await updateIssuance(dialog.issuance.id, payload)
      else await createIssuance(payload)
      setDialog({ mode: 'closed' })
      await reload()
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Не удалось сохранить выдачу.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const removeIssuance = async (issuance: Issuance) => {
    setError(null)
    try {
      await deleteIssuance(issuance.id)
      await reload()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось удалить выдачу.')
    }
  }

  return {
    issuances,
    employees,
    workwear,
    isLoading,
    isSaving,
    error,
    dialog,
    employeeId,
    workwearId,
    issuedOn,
    discountPercent,
    setEmployeeId,
    setWorkwearId,
    setIssuedOn,
    setDiscountPercent,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submit,
    removeIssuance,
  }
}
