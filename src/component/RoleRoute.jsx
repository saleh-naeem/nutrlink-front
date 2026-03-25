import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

/**
 * RoleRoute — renders children only if the user's role matches.
 * Otherwise redirects to the correct profile page.
 *
 * Usage:
 *   <RoleRoute role="customer">  <Profile />          </RoleRoute>
 *   <RoleRoute role="nutritionist"> <NutriProfile />  </RoleRoute>
 */
const RoleRoute = ({ children, role }) => {
  const { user, isLogin, loading } = useContext(AuthContext)


  if (loading) return <div className="loading-spinner">Checking Sessions...</div>
  if (!isLogin) return <Navigate to="/login" />



  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  if (user?.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleRoute;