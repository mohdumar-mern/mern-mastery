import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../../app/api/apiSlice/auth/authApiSlice';
import { validateEmail } from '../../utils/validateEmail';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  // Memoized handler to prevent re-creation on every render
  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Basic client-side validation
    if (!email || !validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      // Log only non-sensitive data

      // Store token securely
      if (res.token) {
        localStorage.setItem('token', res.token);
        toast.success('Login successful');
        navigate('/courses');
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      const errorMessage = err.data?.message || err.message || 'An error occurred during login';
      toast.error(errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10"
      noValidate
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>
      <div className="mb-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          aria-label="Email address"
        />
      </div>
      <div className="mb-6">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          aria-label="Password"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don’t have an account?{' '}
        <a href="/register" className="text-blue-500 hover:underline">
          Register
        </a>
      </p>
    </form>
  );
}


export default Login;