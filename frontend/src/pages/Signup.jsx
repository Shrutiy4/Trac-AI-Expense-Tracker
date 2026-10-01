import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus,Eye,EyeOff } from 'lucide-react';
import backgroundimg from '../assets/backgroundimg.jpg';
import tracs from '../assets/tracs.png';
import api from '../lib/axios';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/signup', form);
      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Signup failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      data-theme="autumn"
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${backgroundimg})` }}
    >
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 rounded-2xl p-8 shadow-xl glass">
        {/* Info Side */}
        <div className="space-y-5 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <img src={tracs} className="w-[70%]" alt="Trac$ logo" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            <UserPlus className="w-8 h-8" /> Create Your Account
          </h1>
          <p className="text-base-content text-xs md:text-sm">
            Start tracking your expenses the smart way. Our AI categorizes your spending,
            helps you save better, and visualizes your finances.
          </p>
        </div>

        {/* Signup Form */}
        <div className="space-y-6 flex flex-col justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-base-content">Sign Up</h2>
            <p className="text-sm text-base-content/70">
              Join us and let AI simplify your finances.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="alert alert-warning text-sm py-1 md:py-3">{error}</div>}

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="input input-bordered w-full h-9 md:h-11"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="input input-bordered w-full h-9 md:h-11"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="input input-bordered w-full h-9 md:h-11 pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Create Account'
              )}
            </button>

          </form>

          <p className="text-sm text-center text-base-content">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
