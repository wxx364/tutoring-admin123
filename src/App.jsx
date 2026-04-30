import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/auth'
import Layout from './components/Layout'
import Login from './pages/Login'
import Students from './pages/students/Students'
import StudentDetail from './pages/students/StudentDetail'
import Attendance from './pages/attendance/Attendance'
import ClassAttendance from './pages/attendance/ClassAttendance'
import Warnings from './pages/warnings/Warnings'
import Reports from './pages/reports/Reports'
import Settings from './pages/settings/Settings'
import OperationLogs from './pages/settings/OperationLogs'
import Accounts from './pages/accounts/Accounts'

function App() {
  const { isLoggedIn } = useAuthStore()

  if (!isLoggedIn) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/students" replace />} />
          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="attendance/class" element={<ClassAttendance />} />
          <Route path="warnings" element={<Warnings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/logs" element={<OperationLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
