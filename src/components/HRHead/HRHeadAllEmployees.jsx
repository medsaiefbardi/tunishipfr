import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const skillLevels = ['N/A', 'N', 'A', 'M', 'E'];

const HRHeadAllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. User not authenticated.');

        const res = await axios.get(`${apiUrl}/api/employees`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setEmployees(res.data);
      } catch (error) {
        console.error('Error fetching employees:', error.message);
        setError('Failed to fetch employees.');
      }
    };

    const fetchJobPositions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. User not authenticated.');

        const res = await axios.get(`${apiUrl}/api/job-positions`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setJobPositions(res.data);
      } catch (error) {
        console.error('Error fetching job positions:', error.message);
        setError('Failed to fetch job positions.');
      }
    };

    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. User not authenticated.');

        const res = await axios.get(`${apiUrl}/api/skills`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSkills(res.data);
      } catch (error) {
        console.error('Error fetching skills:', error.message);
        setError('Failed to fetch skills.');
      }
    };

    fetchEmployees();
    fetchJobPositions();
    fetchSkills();
  }, []);

  const handleDeleteEmployee = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.delete(`${apiUrl}/api/employees/${id}`, { headers });
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error.message);
      setError('Failed to delete employee.');
    }
  };

  const handleSelectEmployee = (employee) => {
    const employeeSkills = skills.map(skill => {
      const existingSkill = employee.skills.find(s => s.skill && s.skill._id === skill._id);
      return existingSkill ? existingSkill : { skill: skill._id, level: 'N/A' };
    });
    setSelectedEmployee({ ...employee, skills: employeeSkills });
  };

  return (
    <div style={styles.container}>
      {error && <p style={styles.error}>{error}</p>}
      <h1 style={styles.heading}>EMPLOYES</h1>
      {!selectedEmployee ? (
        <>
          <div style={styles.card}>
            <ul style={styles.list}>
              {employees.map(employee => (
                <li key={employee._id} style={styles.listItem}>
                  <span>
                    {employee.name} - {employee.jobPosition?.title || 'N/A'} 
                    {/* <strong> - Évaluation : {employee.evaluation?.totalEvaluation || 'Non évalué'}</strong> */}
                  </span>
                  <div>
                    <button onClick={() => handleSelectEmployee(employee)} style={styles.button}>MODIFIER</button>
                    <button onClick={() => handleDeleteEmployee(employee._id)} style={styles.button}>SUPPRIMER</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div>
          <h2>MàJ EMPLOYE</h2>
          <form style={styles.form}>
            <input
              type="text"
              name="name"
              value={selectedEmployee.name}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
              placeholder="Nom"
              required
              style={styles.input}
            />
            <h3>COMPETENCES</h3>
            <div style={styles.skillsGrid}>
              {selectedEmployee.skills.map((skill, index) => (
                <div key={index} style={styles.skillItem}>
                  <label>
                    {skills.find(s => s._id === skill.skill)?.code || ''} - Niveau :
                  </label>
                  <select
                    name="level"
                    value={skill.level}
                    onChange={(e) => {
                      const updatedSkills = [...selectedEmployee.skills];
                      updatedSkills[index].level = e.target.value;
                      setSelectedEmployee({ ...selectedEmployee, skills: updatedSkills });
                    }}
                    required
                    style={styles.input}
                  >
                    {skillLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setSelectedEmployee(null)} style={styles.button}>REVENIR</button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    color: '#0066ff',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#87CEFA',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '20px',
  },
  listItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: '10px',
  },
  skillItem: {
    display: 'flex',
    flexDirection: 'column',
  },
};

export default HRHeadAllEmployees;
