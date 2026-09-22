import { Routes, Route, Navigate } from 'react-router-dom'
import PublicSite from './PublicSite.jsx'
import StartProject from './StartProject.jsx'
import AdminGate from './admin/AdminGate.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminHome from './admin/AdminHome.jsx'
import ContentByPage from './admin/ContentByPage.jsx'
import MediaLibrary from './admin/MediaLibrary.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/start-a-project" element={<StartProject />} />
      <Route
        path="/admin"
        element={
          <AdminGate>
            <AdminLayout />
          </AdminGate>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="content/:page" element={<ContentByPage />} />
        <Route path="media" element={<MediaLibrary />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
