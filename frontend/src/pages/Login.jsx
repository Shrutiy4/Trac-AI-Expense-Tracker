import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import backgroundimg from '../assets/backgroundimg.jpg';
import tracs from '../assets/tracs.png';
import api from '../lib/axios';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.identifier || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true); // Start loading
    setError('');

    try {
      const response = await api.post('/auth/login', form, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false); // Stop loading in both success/failure
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
          <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center md:justify-start gap-2">
            <Brain className="w-8 h-8" /> AI Expense Tracker
          </h1>
          <p className="text-base-content text-xs md:text-sm leading-relaxed max-w-md">
            Track, categorize, and analyze your expenses with the power of AI. Just upload your bills and let our smart assistant help you stay financially fit.
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-6 flex flex-col justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-base-content">Login</h2>
            <p className="text-sm text-base-content/70">Welcome back! Log in to continue.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-warning text-sm py-1 md:py-3">{error}</div>
            )}

            <input
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder="Email or Username"
              className="input input-bordered w-full h-9 md:h-11"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="input input-bordered w-full h-9 md:h-11"
            />
            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Login'
              )}
            </button>

          </form>

          <p className="text-sm text-center text-base-content">
            Don’t have an account?{' '}
            <Link to="/signup" className="link link-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
