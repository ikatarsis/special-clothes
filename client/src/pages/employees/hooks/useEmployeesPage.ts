import { useCallback, useEffect, useState } from 'react'

import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
  type Employee,
} from '@/entities/employee'
import { getWorkshops, type Workshop } from '@/entities/workshop'

type DialogState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; employee: Employee }

export const useEmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })
  const [fullName, setFullName] = useState('')
  const [position, setPosition] = useState('')
  const [workshopId, setWorkshopId] = useState('')

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [employeeData, workshopData] = await Promise.all([getEmployees(), getWorkshops()])
      setEmployees(employeeData)
      setWorkshops(workshopData)
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Не удалось загрузить сотрудников.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true
    void Promise.all([getEmployees(), getWorkshops()])
      .then(([employeeData, workshopData]) => {
        if (isActive) {
          setEmployees(employeeData)
          setWorkshops(workshopData)
        }
      })
      .catch((requestError: unknown) => {
        if (isActive)
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Не удалось загрузить сотрудников.',
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
    setFullName('')
    setPosition('')
    setWorkshopId(workshops[0] ? String(workshops[0].id) : '')
    setDialog({ mode: 'create' })
  }

  const openEditDialog = (employee: Employee) => {
    setFullName(employee.fullName)
    setPosition(employee.position)
    setWorkshopId(String(employee.workshopId))
    setDialog({ mode: 'edit', employee })
  }

  const closeDialog = () => {
    if (!isSaving) setDialog({ mode: 'closed' })
  }

  const submit = async () => {
    const parsedWorkshopId = Number(workshopId)
    if (!fullName.trim() || !position.trim() || !parsedWorkshopId) {
      setError('Заполните ФИО, должность и выберите цех.')
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      const payload = {
        fullName: fullName.trim(),
        position: position.trim(),
        workshopId: parsedWorkshopId,
      }
      if (dialog.mode === 'edit') await updateEmployee(dialog.employee.id, payload)
      else await createEmployee(payload)
      setDialog({ mode: 'closed' })
      await reload()
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Не удалось сохранить сотрудника.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const removeEmployee = async (employee: Employee) => {
    setError(null)
    try {
      await deleteEmployee(employee.id)
      await reload()
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Не удалось удалить сотрудника.',
      )
    }
  }

  return {
    employees,
    workshops,
    isLoading,
    isSaving,
    error,
    dialog,
    fullName,
    position,
    workshopId,
    setFullName,
    setPosition,
    setWorkshopId,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submit,
    removeEmployee,
  }
}
