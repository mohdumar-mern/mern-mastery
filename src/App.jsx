import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import CoursesPage from './pages/Courses/CoursesPage';
import CoursePage from './pages/Courses/CoursePage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';


function App() {

  return (
    <div className="min-h-screen bg-gray-100 max-w-7xl mx-auto">
      <Navbar />
      <Routes>
        <Route path='/' element={<h1>Home</h1>} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/courses' element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CoursePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
