import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  // Get username from token
  const getUsername = () => {
    const token = authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub;
      } catch (error) {
        return 'User';
      }
    }
    return 'User';
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg border-b fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <Link 
            to="/" 
            className="text-xl font-bold"
            style={{ color: '#800000' }}
          >
            FS-App
          </Link>
          
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Welcome! {getUsername()}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-white font-medium transition-colors"
                  style={{ backgroundColor: '#800000' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#660000'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#800000'}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};