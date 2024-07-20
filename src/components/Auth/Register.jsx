import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const apiUrl = process.env.REACT_APP_API_URL;

const Register = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [jobPosition, setJobPosition] = useState('');
  const [jobPositions, setJobPositions] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/job-positions`);
        setJobPositions(res.data);
      } catch (error) {
        console.error('Error fetching job positions:', error.message);
        setError('Failed to fetch job positions.');
      }
    };

    fetchJobPositions();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/auth/register`, {
        name,
        password,
        role,
        jobPosition: role === 'employee' ? jobPosition : undefined
      });
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error.message);
      setError('Registration failed');
    }
  };

  return (
    <div style={styles.registerContainer}>
      <div style={styles.logoContainer}>
        <img
          src="https://tuniship.net/wp-content/themes/tuniship%201.1.0/assets/images/logos/logo-tuniship.png"
          alt="Tuniship Logo"
          style={styles.logo}
        />
      </div>
      <form onSubmit={handleRegister} style={styles.registerForm}>
        <h1>Créer compte</h1>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.inputGroup}>
          <div style={styles.inputColumn}>
            <input
              required
              placeholder="Nom"
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
            <input
              required
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.input}
            >
              <option value="employee">Employee</option>
              <option value="hr_head">RH</option>
            </select>
            {role === 'employee' && (
              <select
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                style={styles.input}
              >
                <option value="">Choisir poste</option>
                {jobPositions.map((position) => (
                  <option key={position._id} value={position._id}>
                    {position.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <button type="submit" style={styles.button}>Enregistrer</button>
      </form>
    </div>
  );
};

const styles = {
  registerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#add8e6',
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  logo: {
    maxWidth: '200px',
  },
  registerForm: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
    maxWidth: '900px',
  },
  inputGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '20px',
  },
  inputColumn: {
    flex: 1,
    marginRight: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
};

export default Register;
