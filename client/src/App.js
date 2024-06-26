import React, { useState, useEffect, useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';
import { AuthContext } from './Context/AuthContext';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register'
import AdminLayout from './Layouts/AdminLayout';
import UserLayout from './Layouts/UserLayout';
import ProjectDashboard from './Pages/Common/ProjectDashboard';
import ProjectDetail from './Pages/Common/ProjectDetail';
import { makeRequest } from './Axios';
import AllUsers from './Pages/Admin/AllUsers';
import TestForm from './Pages/Admin/TestForm';
import GanttChart from './Pages/Admin/GanttChart';
import NotFound from './Pages/Error/NotFound';
import LandingPage from './Pages/Common/LandingPage';
import WorkProgress from './Pages/Admin/WorkProgress';

const App = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await makeRequest.get('/auth/verify');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [user, setUser]);

  const ProtectedRoute = ({ children, layout: Layout }) => {
    if (loading) {
      return null; // You can render a loading indicator here if needed
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    if (user.user_type === 'Admin' && Layout === AdminLayout) {
      return children
    } else if (user.user_type === 'Users' && Layout === UserLayout) {
      return children
    } else {
      return <Navigate to="/login" />; // Redirect to home or handle unauthorized access
    }
  };

  const router = createBrowserRouter([
    {
      path: '/admin',
      element: (
        <ProtectedRoute layout={AdminLayout}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/admin/dashboard',
          element: <ProjectDashboard />,
        },
        {
          path: '/admin/projectdetail/:projectId',
          element: <ProjectDetail />,
        },
        {
          path: '/admin/allusers/',
          element: <AllUsers />,
        },
        {
          path: '/admin/ganttchart',
          element: <GanttChart />,
        },
        {
          path: '/admin/testform',
          element: <TestForm />,
        },
        {
          path: '/admin/workprogress/:projectId/:type',
          element: <WorkProgress />,
        },
      ],
    },
    {
      path: '/user',
      element: (
        <ProtectedRoute layout={UserLayout}>
          <UserLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/user/dashboard',
          element: <ProjectDashboard />,
        },
        {
          path: '/user/projectdetail/:projectId',
          element: <ProjectDetail />,
        },
        {
          path: '/user/ganttchart',
          element: <GanttChart />,
        },
        {
          path: '/user/workprogress/:projectId/:type',
          element: <WorkProgress />,
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
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
