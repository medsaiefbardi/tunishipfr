import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, { name, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      window.location.reload();  // Reload the page to ensure the App component re-renders
    } catch (error) {
      console.error(error);
      setError('Invalid name or password');
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (storedToken && storedRole) {
      if (storedRole === 'employee') {
        navigate('/profile');
      } else if (storedRole === 'hr_head') {
        navigate('/all-employees');
      }
    }
  }, [navigate]);

  return (
    <div style={styles.loginContainer}>
      <div style={styles.logoContainer}>
        <img
          src="https://tuniship.net/wp-content/themes/tuniship%201.1.0/assets/images/logos/logo-tuniship.png"
          alt="Tuniship Logo"
          style={styles.logo}
        />
      </div>
      <form onSubmit={handleLogin} style={styles.loginForm}>
        <h1>Login</h1>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom"
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#add8e6',
  },
  logoContainer: {
    position: 'absolute',
    top: '20px',
    left: '20px',
  },
  logo: {
    maxWidth: '200px',
  },
  loginForm: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: '20px',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
  button: {
    padding: '15px 30px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
};

export default Login;
