import Navbar from '@/components/navbar/navbar'
import MotifPage from '@/app/motif/page'
import OverviewPage from '@/app/overview/page'
import GNNPage from '@/app/gnn/page'
import DrawCanvas from '@/app/motif/canvas/page'
import { createBrowserRouter, Outlet } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '/',
        element: <OverviewPage />
      },
      {
        path: '/motif',
        element: <MotifPage />
      },
      {
        path: '/motif/canvas',
        element: <DrawCanvas />
      },
      {
        path: '/gnn',
        element: <GNNPage />
      }
    ]
  }
])

export default router
