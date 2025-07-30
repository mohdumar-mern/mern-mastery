// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useLoginMutation } from '../api/apiSlice';
import { toast } from 'react-toastify';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
//   const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    //   await login(formData).unwrap();
      toast.success('Login successful');
      navigate('/courses');
    } catch (err) {
      toast.error(err.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Login</h2>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button
        type="submit"
        // disabled={isLoading}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {/* {isLoading ? 'Logging in...' : 'Login'} */}
      Login
      </button>
    </form>
  );
}

export default Login;