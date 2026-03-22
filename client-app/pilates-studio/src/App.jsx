import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes,Route, Navigate } from 'react-router'
import Home from "/src/pages/Home/Home.jsx"
// import AdminRoute from './compomets/AdminRoute'
import Admin from './pages/Home/Admin/Admin'
import Layout from './compomets/Layout'
import Instructor from './pages/InstructorDashboard/InstructorDashboard'
import InstructorClasses from './pages/InstructorClasses/InstructorClasses'
import ClassDetail from './pages/ClassDetails/ClassDetail'
import ClassSearch from './pages/ClassSearch/ClassSearch'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import { useAuth } from './Context/AuthContext';
import MyBookings from './pages/MyBookings/MyBookings';
import Charts from './pages/Charts/Charts';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== 'Admin') return <Navigate to="/" />;
  return children;
};


function App() {
return (
  <>
  <BrowserRouter>
  <Routes>
    <Route element={<Layout/>}>
    <Route path="/" element={<Home/>}/>
    <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
    <Route path="/admin/charts" element={<AdminRoute><Charts /></AdminRoute>} />
    <Route path="/trainer/dashboard" element={<Instructor/>}/>
    <Route path="/instructor/:instructorId" element={<InstructorClasses />} />
    <Route path="/classes" element={<ClassSearch />} />
    <Route path="/classes/:classId" element={<ClassDetail />} /> 
     <Route path="/instructor/:instructorId/classes/:classId" element={<ClassDetail />} />
     <Route path="/login" element={<Login />} />
     <Route path="/register" element={<Register />} />
     <Route path="/dashboard/bookings" element={<MyBookings />} />
    </Route>
  </Routes>
  </BrowserRouter>
  </>
)
}

export default App
