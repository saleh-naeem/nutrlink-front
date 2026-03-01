import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Login             from './pages/Login';
import Register          from './pages/Register';
import { RegisterType }  from './pages/RegisterType';
import Dashboard         from './pages/Dashboard';
import ProtectedRoute    from './component/ProtectedRoute';
import AdminRoute        from './component/AdminRoute';
import RoleRoute         from './component/RoleRoute';
import Home              from './pages/Home'; // Correct default import
import { Calculetor }    from './pages/Calculetor';
import { Profile }       from './pages/Profile';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/"            element={<Home />} />
          <Route path="/home"        element={<Home />} />
          
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/registerType" element={<RegisterType />} />
          <Route path="/calculetor"  element={<Calculetor />} />
          
          {/* Role-based Profile Route */}
          <Route path="/profile" element={<RoleRoute role="customer"><Profile /></RoleRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;