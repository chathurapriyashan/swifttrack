import './App.css'


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/Login'
import { SignupPage } from './pages/Signup'
import ClientDashboard from './pages/ClientDashboard';
import OrderDetails from './pages/OrderDetails';
import CreateOrderFrom from './pages/OrderCreateFrom';
import WareHouseDashboard from './pages/WareHouseDashboard';
import OrderUpdate from './pages/OrderUpdate';
import Drivers from './pages/Drivers';
import DriverApp from './pages/components/DriverApp';
import { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [user , setUser] = useState({
    name : "" , 
    email:"",
    image:"",
  })
  const [loading, setLoading] = useState(true);

  // Check for saved access token on mount and fetch user details
  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        
        if (accessToken) {
          // Use the stored token to get user details
          const response = await axios.get(
            `https://www.googleapis.com/oauth2/v2/userinfo`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const { email, name, picture } = response.data;
          setUser({
            email,
            name,
            image: picture,
          });
          
          console.log("User restored from token:", { email, name });
        }
      } catch (error) {
        console.error("Error validating token:", error);
        // Clear invalid token
        localStorage.removeItem('access_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthToken();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setUser({
      name: "",
      email: "",
      image: "",
    });
  };

  // Protected Route Component
  const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    return user.email !== "" ? element : <Navigate to="/login" replace />;
  };


  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage setUser={setUser} user={user} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} user={user} />} />
        <Route path="/signup" element={<SignupPage setUser={setUser} user={user} />} />
        
        {/* Protected Routes */}
        <Route path="/users" element={<ProtectedRoute element={<ClientDashboard user={user} handleLogout={handleLogout} />} />} />
        <Route path='/users/orders' element={<ProtectedRoute element={<OrderDetails user={user} handleLogout={handleLogout} />} />} />
        <Route path="/users/orders/new" element={<ProtectedRoute element={<CreateOrderFrom user={user} handleLogout={handleLogout} />} />} />
        <Route path="/warehouse" element={<ProtectedRoute element={< WareHouseDashboard user={user} handleLogout={handleLogout} />} />} />
        <Route path="/warehouse/orders/update" element={<ProtectedRoute element={<OrderUpdate user={user} handleLogout={handleLogout} />} />} />
        <Route path="/warehouse/drivers" element={<ProtectedRoute element={<Drivers user={user} handleLogout={handleLogout} />} />} />
        <Route path="/drivers" element={<ProtectedRoute element={<DriverApp user={user} handleLogout={handleLogout} />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
