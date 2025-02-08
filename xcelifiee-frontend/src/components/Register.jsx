import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Register() {
  const [empid, setEmpid] = useState('');
  const [username, setUsername] = useState('');
  const [teamno, setTeamno] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Field Values:", { userType, empid, username, teamno, password });

    // Clean up inputs
    const cleanedEmpid = empid.replace(/\s+/g, '').toUpperCase(); // Remove spaces, uppercase
    const cleanedUsername = username.trim(); // Trim spaces
    const cleanedPassword = password.trim(); // Trim spaces
    const cleanedUserType = userType.trim(); // Trim spaces
    const cleanedTeamno = parseInt(teamno.replace(/\s+/g, ''), 10); // Convert to integer

    // Validate teamno
    if (isNaN(cleanedTeamno)) {
      setErrorMessage("Team number must be a valid integer.");
      return;
    }

    // Ensure no field is empty
    if (!cleanedEmpid || !cleanedUsername || !cleanedPassword || !cleanedUserType) {
      setErrorMessage("All fields are required.");
      return;
    }

    setErrorMessage("");

    const newUser = {
      empid: cleanedEmpid,
      username: cleanedUsername,
      teamno: cleanedTeamno,
      password: cleanedPassword,
      userType: cleanedUserType,
    };

    try {
      const response = await fetch('http://localhost:4000/user-api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Server Response:", result);

        // Save to localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        existingUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(existingUsers));

        alert('Account created successfully!');
        setEmpid('');
        setUsername('');
        setTeamno('');
        setPassword('');
        navigate('/login');
      } else {
        const error = await response.json();
        setErrorMessage(error.message || 'An error occurred while registering.');
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100">
      <div className="relative w-full max-w-md mx-4">
        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70 hover:shadow-2xl transition-shadow duration-300 p-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-6 text-violet-800"
          >
            Create New Account
          </motion.h2>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-violet-700 hover:text-violet-800">User Type</label>
              <div className="mt-2">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="userType"
                    value="user"
                    checked={userType === 'user'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mr-2"
                    required
                  />
                  User
                </label>
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="admin"
                    checked={userType === 'admin'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mr-2"
                    required
                  />
                  Admin
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="empid" className="block text-sm font-medium text-violet-700 hover:text-violet-800">Employee ID</label>
              <input
                type="text"
                id="empid"
                value={empid}
                onChange={(e) => setEmpid(e.target.value)}
                placeholder="Enter Employee ID"
                required
                className="mt-2 p-2 border border-gray-300 rounded w-full focus:outline-none hover:shadow-xl hover:shadow-violet-200 transition-shadow duration-300 hover:ring-1 hover:ring-violet-500 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-violet-700 hover:text-violet-800">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                required
                className="mt-2 p-2 border border-gray-300 rounded w-full focus:outline-none hover:shadow-xl hover:shadow-violet-200 transition-shadow duration-300 hover:ring-1 hover:ring-violet-500 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-violet-700 hover:text-violet-800">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                className="mt-2 p-2 border border-gray-300 rounded w-full focus:outline-none hover:shadow-xl hover:shadow-violet-200 transition-shadow duration-300 hover:ring-1 hover:ring-violet-500 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="teamno" className="block text-sm font-medium text-violet-700 hover:text-violet-800">Team Number</label>
              <input
                type="number"
                id="teamno"
                value={teamno}
                onChange={(e) => setTeamno(e.target.value)}
                placeholder="Enter Team Number"
                required
                className="mt-2 p-2 border border-gray-300 rounded w-full focus:outline-none hover:shadow-xl hover:shadow-violet-200 transition-shadow duration-300 hover:ring-1 hover:ring-violet-500 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {errorMessage && <div className="text-red-500 text-sm text-center">{errorMessage}</div>}

            <div className="mb-4 text-center">
              <motion.button
                type="submit"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg border border-transparent hover:bg-white hover:text-violet-600 hover:border-violet-600 text-lg transition-colors duration-300 shadow-md hover:shadow-lg hover:shadow-violet-500/50 transform hover:scale-105 transition-all duration-400 ease-in-out"
              >
                Sign Up
              </motion.button>
            </div>

            <div className="mt-4 text-center">
              <a href="./Login" className="text-violet-700 hover:text-violet-800">Already have an account? Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;