import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setHasError(false);

    try {
      await authService.register(formData);
      navigate('/protected');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
      setHasError(true); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (hasError) {
      setError('');
      setHasError(false);
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Creating your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                style={{ '--tw-ring-color': '#800000' } as any}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:z-10 sm:text-sm"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={handleChange}
                style={{ '--tw-ring-color': '#800000' } as any}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{ '--tw-ring-color': '#800000' } as any}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: '#800000', '--tw-ring-color': '#800000' } as any}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#660000'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#800000'}
            >
              Sign up
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium hover:underline"
              style={{ color: '#800000' }}
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};