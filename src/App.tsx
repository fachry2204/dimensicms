import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewRelease from './pages/NewRelease';
import AllReleases from './pages/AllReleases';
import Placeholder from './pages/Placeholder';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/releases" element={<AllReleases />} />
          <Route path="/releases/new" element={<NewRelease />} />
          
          {/* Reports Routes */}
          <Route path="/reports/statistics" element={<Placeholder title="Statistics Report" />} />
          <Route path="/reports/revenue" element={<Placeholder title="Revenue Report" />} />
          <Route path="/reports/payment" element={<Placeholder title="Payment Report" />} />
          <Route path="/reports/upload" element={<Placeholder title="Upload Report" />} />
          
          {/* Settings Routes */}
          <Route path="/settings/aggregators" element={<Placeholder title="Aggregator Settings" />} />
          <Route path="/settings/users" element={<Placeholder title="User Settings" />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
