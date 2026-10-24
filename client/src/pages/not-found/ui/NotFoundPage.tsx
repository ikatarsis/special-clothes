import { Link } from 'react-router-dom'

import { PagePlaceholder } from '@/shared/ui/page-placeholder/PagePlaceholder'

export const NotFoundPage = () => {
  return (
    <>
      <PagePlaceholder description="Такой страницы нет" title="Страница не найдена" />
      <p>
        <Link to="/">Вернуться на главную</Link>
      </p>
    </>
  )
}
