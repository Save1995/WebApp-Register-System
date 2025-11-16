
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call.
    // Here we use the mock credentials.
    if (username === 'admin' && password === 'admin123') {
      login({ username: 'admin', role: 'admin' });
      onClose();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Admin Login</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">&times;</button>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
               {error && <p className="text-red-500 text-xs italic">{error}</p>}
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 gap-2 sm:gap-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-2 px-4 rounded text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;