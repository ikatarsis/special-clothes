import { useCallback, useEffect, useState } from 'react'

import {
  createWorkshop,
  deleteWorkshop,
  getWorkshops,
  updateWorkshop,
  type Workshop,
} from '@/entities/workshop'

type DialogState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; workshop: Workshop }

export const useWorkshopsPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })
  const [name, setName] = useState('')

  const loadWorkshops = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setWorkshops(await getWorkshops())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось загрузить цеха.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    void getWorkshops()
      .then((data) => {
        if (isActive) setWorkshops(data)
      })
      .catch((requestError: unknown) => {
        if (isActive) {
          setError(
            requestError instanceof Error ? requestError.message : 'Не удалось загрузить цеха.',
          )
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  const openCreateDialog = () => {
    setName('')
    setDialog({ mode: 'create' })
  }

  const openEditDialog = (workshop: Workshop) => {
    setName(workshop.name)
    setDialog({ mode: 'edit', workshop })
  }

  const closeDialog = () => {
    if (!isSaving) setDialog({ mode: 'closed' })
  }

  const submit = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Введите название цеха.')
      return
    }

    setIsSaving(true)
    setError(null)
    try {
      if (dialog.mode === 'edit') {
        await updateWorkshop(dialog.workshop.id, { name: trimmedName })
      } else {
        await createWorkshop({ name: trimmedName })
      }
      setDialog({ mode: 'closed' })
      await loadWorkshops()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось сохранить цех.')
    } finally {
      setIsSaving(false)
    }
  }

  const removeWorkshop = async (workshop: Workshop) => {
    setError(null)
    try {
      await deleteWorkshop(workshop.id)
      await loadWorkshops()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось удалить цех. Возможно, в нём есть сотрудники.',
      )
    }
  }

  return {
    workshops,
    isLoading,
    isSaving,
    error,
    dialog,
    name,
    setName,
    loadWorkshops,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submit,
    removeWorkshop,
  }
}
