import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import type { ProtectedResponse } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Protected: React.FC = () => {
  const [data, setData] = useState<ProtectedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await authService.checkProtected();
        setData(response);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch protected data');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProtectedData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 pt-40 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Protected Dashboard</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {data && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <h2 className="text-lg font-semibold mb-2">Success!</h2>
            <p><strong>Message:</strong> {data.message}</p>
            <p><strong>User:</strong> {data.user}</p>
            <p><strong>Status:</strong> {data.status}</p>
          </div>
        )}

        <div 
          className="mt-6 p-4 rounded border"
          style={{ backgroundColor: '#fdf2f2', borderColor: '#800000' }}
        >
          <h3 className="font-semibold mb-2" style={{ color: '#800000' }}>Authentication Successful!</h3>
        </div>
      </div>
    </div>
  );
};