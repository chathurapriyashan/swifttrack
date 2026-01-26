import './App.css'


import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/Login'
import { SignupPage } from './pages/Signup'
import ClientDashboard from './pages/ClientDashboard';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/users" element={<ClientDashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
