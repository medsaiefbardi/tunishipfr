import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EmployeeProfile from './components/Employee/EmployeeProfile';
import SkillGaps from './components/Employee/SkillGaps';
import HRHeadAllEmployees from './components/HRHead/HRHeadAllEmployees';
import Navbar from './components/Navbar';
import ManageSkills from './components/HRHead/ManageSkills';
import SkillDetail from './components/HRHead/SkillDetail';
import ManageJobPositions from './components/HRHead/ManageJobPositions';
import SkillMatrix from './components/HRHead/SkillMatrix';
import Evaluation from './components/HRHead/Evaluation';

const App = () => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
        setRole(decodedToken.role);
        console.log('Decoded token:', decodedToken);
        console.log('User role:', decodedToken.role);
      } catch (error) {
        console.error('Error decoding token:', error);
        setToken(null);
        setRole(null);
      }
    } else {
      setToken(null);
      setRole(null);
    }
    setLoading(false);
  }, []);

  const isAuthenticated = () => !!token;

  const isAuthorized = (requiredRole) => {
    return token && role === requiredRole;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated() && <Navbar role={role} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
        <Route path="/register" element={<Register />} />

        {/* Employee Routes */}
        <Route
          path="/profile"
          element={isAuthenticated() ? <EmployeeProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/skill-gaps"
          element={isAuthorized('employee') ? <SkillGaps /> : <Navigate to="/login" />}
        />

        {/* HR Head Routes */}
        <Route
          path="/all-employees"
          element={isAuthorized('hr_head') ? <HRHeadAllEmployees /> : <Navigate to="/profile" />}
        />
        <Route
          path="/manage-skills"
          element={isAuthorized('hr_head') ? <ManageSkills /> : <Navigate to="/profile" />}
        />
        <Route
          path="/skills/:id"
          element={isAuthorized('hr_head') ? <SkillDetail /> : <Navigate to="/profile" />}
        />
        <Route
          path="/manage-job-positions"
          element={isAuthorized('hr_head') ? <ManageJobPositions /> : <Navigate to="/profile" />}
        />
        <Route
          path="/evaluation"
          element={isAuthorized('hr_head') ? <Evaluation /> : <Navigate to="/profile" />}
        />
        <Route
          path="/skills-matrix"
          element={isAuthorized('hr_head') ? <SkillMatrix /> : <Navigate to="/profile" />}
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthorized('hr_head') ? (
              <Navigate to="/all-employees" />
            ) : isAuthorized('employee') ? (
              <Navigate to="/profile" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
