
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/LoginPage.jsx';
import AddressRegistration from './pages/district.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BirthRegistration from './pages/Birth.jsx';
import DeathRegistration from './pages/Death.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/address" element={<AddressRegistration />} />
      <Route path="/birth" element={<BirthRegistration />} />
      <Route path="/death" element={<DeathRegistration />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
