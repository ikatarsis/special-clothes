import { RouterProvider } from 'react-router-dom'

import { router } from './providers/router/router'

export const App = () => {
  return <RouterProvider router={router} />
}
