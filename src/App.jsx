import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Toaster } from "sonner"

import LandingPage from "@/pages/LandingPage"
import AppLayout from "@/components/layout/AppLayout"
import ChannelsPage from "@/pages/ChannelsPage"
import ContentCreatePage from "@/pages/ContentCreatePage"
import ContentDetailPage from "@/pages/ContentDetailPage"
import ContentListPage from "@/pages/ContentListPage"
import DashboardPage from "@/pages/DashboardPage"
import LoginPage from "@/pages/LoginPage"
import NotFoundPage from "@/pages/NotFoundPage"
import PipelinePage from "@/pages/PipelinePage"
import RegisterPage from "@/pages/RegisterPage"
import AuthProvider from "@/providers/AuthProvider"
import GuestRoute from "@/routes/GuestRoute"
import ProtectedRoute from "@/routes/ProtectedRoute"
import SettingsPage from "@/pages/SettingsPage"
import AnalyticsPage from "./pages/AnalyticsPage";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage/>},
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
          { path: "/content/new", element: <ContentCreatePage /> },
          { path: "/content/:id", element: <ContentDetailPage /> },
          { path: "/analytics", element: <AnalyticsPage/>},
          { path: "/channels", element: <ChannelsPage /> },
          { path: "/settings", element: <SettingsPage /> },
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
