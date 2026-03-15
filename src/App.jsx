import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Login             from './pages/Login';
import Register          from './pages/Register';
import { RegisterType }  from './pages/RegisterType'; import Dashboard         from './pages/Dashboard';
import ProtectedRoute    from './component/ProtectedRoute';
import AdminRoute        from './component/AdminRoute';
import RoleRoute         from './component/RoleRoute';
import Home              from './pages/Home'; 
import {CreatProfile  }           from './pages/CreatProfile'; 
import {Updateprofile  }           from './pages/Updateprofile'; 
import { Calculator }    from './pages/Calculator';
import { Profile }       from './pages/Profile';
import { Aifull } from './pages/Aifull';
import AdminDashboard from './pages/Admindashboard'
import {NutriProfile} from './pages/NutriProfile'
import {NutriCreateProfile} from './pages/Nutricreateprofile'
import {Ndashboard} from './pages/Ndashboard'
// import CustomerDietPage from'./pages/CustomerDietPage'
// import NutritionistDashboard from './pages/NutritionistDashboard'


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
          <Route path="/calculator"  element={<Calculator />} />
          <Route path="/createprofile"  element={<CreatProfile />} />
          <Route path="/updateprofile"  element={<Updateprofile />} />
          
          {/* Role-based Profile Route */}
          <Route path="/profile" element={<RoleRoute role="customer"><Profile /></RoleRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/Nprofile" element={<ProtectedRoute><NutriProfile /></ProtectedRoute>} />
          <Route path="/creatNprofile" element={<ProtectedRoute><NutriCreateProfile /></ProtectedRoute>} />
          <Route path="/Ndashboard" element={<ProtectedRoute><Ndashboard/></ProtectedRoute>} />
          <Route path="/Ai" element={<ProtectedRoute><Aifull /></ProtectedRoute>} />
               <Route path="/admin"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
          // Customer routes
{/* <Route path="/meals"         element={<CustomerDietPage />} />

// Nutritionist routes
<Route path="/nutri/dashboard" element={<NutritionistDashboard />} /> */}
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;