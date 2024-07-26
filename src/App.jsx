import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EmployeeProfile from './components/Employee/EmployeeProfile';
import SkillGaps from './components/Employee/SkillGaps';
import HRHeadAllEmployees from './components/HRHead/HRHeadAllEmployees';
import Navbar from './components/Navbar';
import ManageSkills from './components/HRHead/ManageSkills';
import ManageJobPositions from './components/HRHead/ManageJobPositions';
import SkillMatrix from './components/HRHead/SkillMatrix';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    } else {
      setToken(null);
      setRole(null);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {token && <Navbar role={role} />}
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={token ? <EmployeeProfile /> : <Navigate to="/login" />} />
        <Route path="/skill-gaps" element={token && role === 'employee' ? <SkillGaps /> : <Navigate to="/login" />} />
        {role === 'hr_head' ? (
          <>
            <Route path="/all-employees" element={<HRHeadAllEmployees />} />
            <Route path="/manage-skills" element={<ManageSkills />} />
            <Route path="/manage-job-positions" element={<ManageJobPositions />} />
            <Route path="/skills-matrix" element={<SkillMatrix />} />
          </>
        ) : (
          <>
            <Route path="/all-employees" element={<Navigate to="/profile" />} />
            <Route path="/manage-skills" element={<Navigate to="/profile" />} />
            <Route path="/skills/:id" element={<Navigate to="/profile" />} />
            <Route path="/manage-job-positions" element={<Navigate to="/profile" />} />
            <Route path="/skills-matrix" element={<Navigate to="/profile" />} />
          </>
        )}
        <Route path="/" element={<Navigate to={token ? (role === 'hr_head' ? "/all-employees" : "/profile") : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
