import React, { useContext, useEffect } from 'react';
import { makeRequest } from './Axios';
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

//CSS
import './App.css';


//Pages & Components
import { AuthContext } from './Context/AuthContext';
import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Login'
import AdminLayout from './Layouts/AdminLayout';
import ProjectDashboard from './Pages/Common/ProjectDashboard';

const App = () => {
  const user = true
  // const { user, setUser } = useContext(AuthContext)
  // const navigate =useNavigate()

  // useEffect(() => {
  //   if (!user) {
  //     makeRequest.get('/auth/getuser').then((res) => {
  //       if (res.status === 200) {
  //         setUser(res.data);
  //       }
  //     });
  //   }
  // }, [user]);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <ProjectDashboard />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    }
  ]);

  return (   
      <div className="App">
        <RouterProvider router={router} />
      </div>
  )
}

export default App