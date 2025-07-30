import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path='/' element={<h1>Home</h1>} />
        <Route path='/about' element={<h1>About</h1>} />
        <Route path='/contact' element={<h1> Contact</h1>} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
