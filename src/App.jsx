import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import RequireAuth from './components/auth/RequireAuth';


// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const CoursesPage = lazy(() => import('./pages/Courses/CoursesPage'));
const CoursePage = lazy(() => import('./pages/Courses/CoursePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LecturePlayer = lazy(() => import('./components/LecturePlayer'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
// const RegisterPage = lazy(() => import('./pages/auth/RegisterPage')); // Uncomment if needed

function App() {
  return (
    <div className="min-h-screen bg-gray-100 mx-auto">
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/register" element={<RegisterPage />} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CoursePage />}>
              <Route index element={<LecturePlayer />} />
              <Route path="lecture/:lectureId" element={<LecturePlayer />} />
            </Route>
            <Route
              path="/admin"
              element={
                // Add authentication check (example)
                <RequireAuth>
                  {/* <ProtectedContent> */}
                  <AdminPage />
                  {/* </ProtectedContent> */}
                    
                </RequireAuth>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}




export default App;