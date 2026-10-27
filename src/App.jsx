import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Toaster } from "sonner"

import AppLayout from "@/components/layout/AppLayout"
import ChannelsPage from "@/pages/ChannelsPage"
import ContentCreatePage from "@/pages/ContentCreatePage"
import ContentDetailPage from "@/pages/ContentDetailPage"
import ContentListPage from "@/pages/ContentListPage"
import DashboardPage from "@/pages/DashboardPage"
import LoginPage from "@/pages/LoginPage"
import NotFoundPage from "@/pages/NotFoundPage"
import PipelinePage from "@/pages/PipelinePage"
import PlaceholderPage from "@/pages/PlaceholderPage"
import RegisterPage from "@/pages/RegisterPage"
import AuthProvider from "@/providers/AuthProvider"
import GuestRoute from "@/routes/GuestRoute"
import ProtectedRoute from "@/routes/ProtectedRoute"

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "/pipeline", element: <PipelinePage /> },
          { path: "/content", element: <ContentListPage /> },
          { path: "/channel/new", element: <ContentCreatePage /> },
          { path: "/content/:id", element: <ContentDetailPage /> },
          { path: "/analytics", element: <PlaceholderPage title="Analytics" /> },
          { path: "/channels", element: <ChannelsPage /> },
          { path: "/settings", element: <PlaceholderPage title="Settings" /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  )
}
