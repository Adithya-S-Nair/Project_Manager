import React, { useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';
import { AuthContext } from './Context/AuthContext';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import AdminLayout from './Layouts/AdminLayout';
import UserLayout from './Layouts/UserLayout';
import ProjectDashboard from './Pages/Common/ProjectDashboard';

const App = () => {
  const { user } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    } else if (user.user_type === 'Admin') {
      return children;
    } else if (user.user_type === 'Users') {
      // return <Navigate to='/user/dashboard'/>;
      return children;
    }
  };

  const router = createBrowserRouter([
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/admin/dashboard',
          element: <ProjectDashboard />,
        },
      ],
    },
    {
      path: '/user',
      element: (
        <ProtectedRoute>
          <UserLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/user/dashboard',
          element: <ProjectDashboard />,
        },
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
