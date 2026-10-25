export const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(Number(value))

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', { timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
