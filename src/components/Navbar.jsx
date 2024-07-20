import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/profile" style={styles.navLink}>Profile</Link>
        </li>
        {role === 'employee' && (
          <li style={styles.navItem}>
            <Link to="/skill-gaps" style={styles.navLink}>Skill Gaps</Link>
          </li>
        )}
        {role === 'hr_head' && (
          <>
            <li style={styles.navItem}>
              <Link to="/all-employees" style={styles.navLink}>All Employees</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/manage-skills" style={styles.navLink}>Manage Skills</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/manage-job-positions" style={styles.navLink}>Manage Positions</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/skills-matrix" style={styles.navLink}>Skills Matrix</Link>
            </li>
          </>
        )}
        <li style={styles.navItem}>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#333',
    padding: '10px 0',
  },
  navList: {
    listStyleType: 'none',
    display: 'flex',
    justifyContent: 'space-around',
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: '0 15px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
  },
  logoutButton: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Navbar;
