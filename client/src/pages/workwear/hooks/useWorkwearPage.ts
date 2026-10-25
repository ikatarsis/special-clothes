import { useCallback, useEffect, useState } from 'react'

import {
  createWorkwear,
  deleteWorkwear,
  getWorkwear,
  updateWorkwear,
  type Workwear,
} from '@/entities/workwear'

type DialogState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; workwear: Workwear }

export const useWorkwearPage = () => {
  const [items, setItems] = useState<Workwear[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })
  const [name, setName] = useState('')
  const [unitPrice, setUnitPrice] = useState('')

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      setItems(await getWorkwear())
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Не удалось загрузить спецодежду.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true
    void getWorkwear()
      .then((data) => {
        if (isActive) setItems(data)
      })
      .catch((requestError: unknown) => {
        if (isActive)
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Не удалось загрузить спецодежду.',
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
    setName('')
    setUnitPrice('')
    setDialog({ mode: 'create' })
  }
  const openEditDialog = (workwear: Workwear) => {
    setName(workwear.name)
    setUnitPrice(String(workwear.unitPrice))
    setDialog({ mode: 'edit', workwear })
  }
  const closeDialog = () => {
    if (!isSaving) setDialog({ mode: 'closed' })
  }

  const submit = async () => {
    const price = Number(unitPrice.replace(',', '.'))
    if (!name.trim() || !Number.isFinite(price) || price <= 0) {
      setError('Введите название и цену больше нуля.')
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      if (dialog.mode === 'edit')
        await updateWorkwear(dialog.workwear.id, { name: name.trim(), unitPrice: price })
      else await createWorkwear({ name: name.trim(), unitPrice: price })
      setDialog({ mode: 'closed' })
      await reload()
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Не удалось сохранить спецодежду.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const removeWorkwear = async (workwear: Workwear) => {
    setError(null)
    try {
      await deleteWorkwear(workwear.id)
      await reload()
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Не удалось удалить спецодежду.',
      )
    }
  }

  return {
    items,
    isLoading,
    isSaving,
    error,
    dialog,
    name,
    unitPrice,
    setName,
    setUnitPrice,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submit,
    removeWorkwear,
  }
}
