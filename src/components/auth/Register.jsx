// src/components/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../../app/api/apiSlice/auth/authApiSlice';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      toast.success('Registration successful');
      navigate('/login');
    } catch (err) {
      toast.error(err.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Register</h2>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="w-full p-2 mb-4 border rounded"
        required
      />
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
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        // disabled={isLoading}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

export default Register;