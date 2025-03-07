import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// import cookies from cookies

function Login() {
  const [empid, setEmpid] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle form submission
  const register = async () => {
    setError('');
    setIsLoading(true);
  
    // Validate input fields
    if (!empid || !password) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:4000/user-api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empid,
          password,
          userType,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data?.token) {
        // Store token securely
        localStorage.setItem('token', data.token);
        // cookies.setItem('token',data.token);
  
        // Store login status
        localStorage.setItem('status', 'loggedin');
  
        // Optionally store user info
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
  
        // Navigate based on userType
        const redirectPath = '/home';
        navigate(redirectPath);
        window.location.reload();
      } else {
        setError('Invalid credentials or response from server');
      }
    } catch (err) {
      let errorMessage = 'An error occurred during login';
  
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || 'Invalid credentials';
      } else if (err.request) {
        // No response received
        errorMessage = 'Server is not responding. Please try again later';
      }
  
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100">
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70 hover:shadow-2xl transition-shadow duration-300 p-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-6 text-violet-800"
          >
            Login
          </motion.h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="empid" className="block text-sm font-medium text-violet-700">
                Employee ID
              </label>
              <input
                type="text"
                id="empid"
                value={empid}
                onChange={(e) => setEmpid(e.target.value)}
                required
                minLength="4"
                maxLength="10"
                disabled={isLoading}
                className="mt-2 p-2 border border-gray-300 rounded w-full focus:outline-none hover:shadow-xl hover:shadow-violet-200 transition-shadow duration-300 hover:ring-1 hover:ring-violet-500 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-violet-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="mt-2 p-2 border border-gray-300 rounded w-full focus:outline-none hover:shadow-xl hover:shadow-violet-200 transition-shadow duration-300 hover:ring-1 hover:ring-violet-500 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-violet-700">
                User Type
              </label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="user"
                    checked={userType === 'user'}
                    onChange={(e) => setUserType(e.target.value)}
                    disabled={isLoading}
                    className="mr-2"
                  />
                  <span>User</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="admin"
                    checked={userType === 'admin'}
                    onChange={(e) => setUserType(e.target.value)}
                    disabled={isLoading}
                    className="mr-2"
                  />
                  <span>Admin</span>
                </label>
              </div>
            </div>

            {/* Display error message if any */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg border border-transparent hover:bg-white hover:text-violet-700 hover:border-violet-700 text-lg transition-colors duration-300 shadow-md hover:shadow-lg hover:shadow-violet-500/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-violet-700 disabled:hover:text-white disabled:hover:scale-100"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </motion.button>
            </div>

            <div className="mt-4 text-center">
              <a href="/register" className="text-violet-700 hover:text-violet-800 hover:underline">
                New user? Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
