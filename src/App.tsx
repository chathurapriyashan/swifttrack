import './App.css'


import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/Login'
import { SignupPage } from './pages/Signup'
import ClientDashboard from './pages/ClientDashboard';
import OrderDetails from './pages/OrderDetails';
import CreateOrderFrom from './pages/OrderCreateFrom';
import WareHouseDashboard from './pages/WareHouseDashboard';
import OrderUpdate from './pages/OrderUpdate';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/users" element={<ClientDashboard/>} />
        <Route path='/users/orders' element={<OrderDetails />} />
        <Route path="/users/orders/new" element={<CreateOrderFrom />} />
        <Route path="/warehouse" element={< WareHouseDashboard />} />
        <Route path="/orders/update" element={<OrderUpdate/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
