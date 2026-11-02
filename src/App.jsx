import { createBrowserRouter, RouterProvider } from "react-router-dom"

import AppToaster from "@/components/common/AppToaster"
import AppLayout from "@/components/layout/AppLayout"
import AnalyticsPage from "@/pages/AnalyticsPage"
import ChannelsPage from "@/pages/ChannelsPage"
import ContentCreatePage from "@/pages/ContentCreatePage"
import ContentDetailPage from "@/pages/ContentDetailPage"
import ContentListPage from "@/pages/ContentListPage"
import DashboardPage from "@/pages/DashboardPage"
import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/pages/LoginPage"
import NotFoundPage from "@/pages/NotFoundPage"
import PipelinePage from "@/pages/PipelinePage"
import RegisterPage from "@/pages/RegisterPage"
import SettingsPage from "@/pages/SettingsPage"
import UsersPage from "@/pages/UsersPage"
import AuthProvider from "@/providers/AuthProvider"
import ThemeProvider from "@/providers/ThemeProvider"
import GuestRoute from "@/routes/GuestRoute"
import ProtectedRoute from "@/routes/ProtectedRoute"
import RoleRoute from "@/routes/RoleRoute"

const router = createBrowserRouter([
  // 1) Pengunjung selalu mendarat di landing page.
  { path: "/", element: <LandingPage /> },

  // 2) Tombol Masuk/Daftar di navbar -> halaman login/register (pengguna yang sudah login dialihkan ke dashboard).
  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // 3) Aplikasi (wajib login). Pembatasan per role memakai RoleRoute; backend tetap memeriksa ulang.
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/pipeline", element: <PipelinePage /> },
          { path: "/content", element: <ContentListPage /> },
          { path: "/content/:id", element: <ContentDetailPage /> },
          { path: "/channels", element: <ChannelsPage /> },
          { path: "/settings", element: <SettingsPage /> },
          {
            element: <RoleRoute allow={["admin", "creator"]} />,
            children: [{ path: "/content/new", element: <ContentCreatePage /> }],
          },
          {
            element: <RoleRoute allow={["admin"]} />,
            children: [
              { path: "/analytics", element: <AnalyticsPage /> },
              { path: "/users", element: <UsersPage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
])

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <AppToaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
