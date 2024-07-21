import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;


const skillLevels = ['N/A', 'N', 'A', 'M', 'E'];

const HRHeadAllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployeeVisible, setNewEmployeeVisible] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    password: '',
    role: 'employee',
    jobPosition: '',
    skills: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. User not authenticated.');
        }

        const res = await axios.get(`${apiUrl}/api/employees`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
        if (!token) {
          throw new Error('No token found. User not authenticated.');
        }

        const res = await axios.get(`${apiUrl}/api/job-positions`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
        if (!token) {
          throw new Error('No token found. User not authenticated.');
        }

        const res = await axios.get(`${apiUrl}/api/skills`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setSkills(res.data);
        setNewEmployee(newEmployee => ({
          ...newEmployee,
          skills: res.data.map(skill => ({ skill: skill._id, level: 'N/A' }))
        }));
      } catch (error) {
        console.error('Error fetching skills:', error.message);
        setError('Failed to fetch skills.');
      }
    };

    fetchEmployees();
    fetchJobPositions();
    fetchSkills();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const res = await axios.post(`${apiUrl}/api/employees`, newEmployee, { headers });
      setEmployees([...employees, res.data]);
      setNewEmployeeVisible(false);
      setNewEmployee({
        name: '',
        password: '',
        role: 'employee',
        jobPosition: '',
        skills: skills.map(skill => ({ skill: skill._id, level: 'N/A' }))
      });
    } catch (error) {
      console.error('Error adding employee:', error.message);
      setError('Failed to add employee.');
    }
  };

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

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const { _id, name, role, jobPosition, skills } = selectedEmployee;
      const payload = {
        name,
        role,
        jobPosition: jobPosition ? jobPosition._id : null,
        skills: skills.map(({ skill, level }) => ({ skill: skill._id || skill, level }))
      };

      const res = await axios.put(`${apiUrl}/api/employees/${_id}`, payload, { headers });
      setEmployees(employees.map(emp => emp._id === selectedEmployee._id ? res.data : emp));
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error.message);
      setError('Failed to update employee.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee({ ...selectedEmployee, [name]: value });
  };

  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    const skillsCopy = [...newEmployee.skills];
    skillsCopy[index][name] = value;
    setNewEmployee({ ...newEmployee, skills: skillsCopy });
  };

  const handleEmployeeSkillChange = (index, e) => {
    const { name, value } = e.target;
    const skillsCopy = [...selectedEmployee.skills];
    skillsCopy[index][name] = value;
    setSelectedEmployee({ ...selectedEmployee, skills: skillsCopy });
  };

  const handleBackToList = () => {
    setSelectedEmployee(null);
  };

  return (
    <div style={styles.container}>
      {error && <p style={styles.error}>{error}</p>}
      <h1 style={styles.heading}>All Employees</h1>
      {selectedEmployee ? (
        <div>
          <h2>Update Employee</h2>
          <form onSubmit={handleUpdateEmployee} style={styles.form}>
            <input
              type="text"
              name="name"
              value={selectedEmployee.name}
              onChange={handleEmployeeInputChange}
              placeholder="Name"
              required
              style={styles.input}
            />
            <select
              name="role"
              value={selectedEmployee.role}
              onChange={handleEmployeeInputChange}
              required
              style={styles.input}
            >
              <option value="employee">Employee</option>
              <option value="hr_head">HR Head</option>
            </select>
            {selectedEmployee.role === 'employee' && (
              <>
                <select
                  name="jobPosition"
                  value={selectedEmployee.jobPosition ? selectedEmployee.jobPosition._id : ''}
                  onChange={handleEmployeeInputChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select Job Position</option>
                  {jobPositions.map(position => (
                    <option key={position._id} value={position._id}>
                      {position.title}
                    </option>
                  ))}
                </select>
                <h3>Skills</h3>
                {selectedEmployee.skills.map((skill, index) => (
                  <div key={index} style={styles.skillRow}>
                    <label>{skills.find(s => s._id === skill.skill)?.code || ''}</label>
                    <select
                      name="level"
                      value={skill.level}
                      onChange={(e) => handleEmployeeSkillChange(index, e)}
                      required
                      style={styles.input}
                    >
                      {skillLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </>
            )}
            <button type="submit" style={styles.button}>Update Employee</button>
            <button type="button" onClick={handleBackToList} style={styles.button}>Back to List</button>
          </form>
        </div>
      ) : (
        <>
          <ul style={styles.list}>
            {employees.map(employee => (
              <li key={employee._id} style={styles.listItem}>
                {employee.name} - {employee.jobPosition ? employee.jobPosition.title : 'No position assigned'}
                <div>
                  <button onClick={() => handleSelectEmployee(employee)} style={styles.button}>Edit</button>
                  <button onClick={() => handleDeleteEmployee(employee._id)} style={styles.button}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={() => setNewEmployeeVisible(!newEmployeeVisible)} style={styles.button}>
            {newEmployeeVisible ? 'Cancel' : 'Add Employee'}
          </button>
          {newEmployeeVisible && (
            <form onSubmit={handleAddEmployee} style={styles.form}>
              <input
                type="text"
                name="name"
                value={newEmployee.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
                style={styles.input}
              />
              <input
                type="password"
                name="password"
                value={newEmployee.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                style={styles.input}
              />
              <select
                name="role"
                value={newEmployee.role}
                onChange={handleInputChange}
                required
                style={styles.input}
              >
                <option value="employee">Employee</option>
                <option value="hr_head">HR Head</option>
              </select>
              {newEmployee.role === 'employee' && (
                <>
                  <select
                    name="jobPosition"
                    value={newEmployee.jobPosition}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  >
                    <option value="">Select Job Position</option>
                    {jobPositions.map(position => (
                      <option key={position._id} value={position._id}>
                        {position.title}
                      </option>
                    ))}
                  </select>
                  <h3>Skills</h3>
                  {skills.map((skill, index) => (
                    <div key={index} style={styles.skillRow}>
                      <label>{skill.code}</label>
                      <select
                        name="level"
                        value={newEmployee.skills[index] ? newEmployee.skills[index].level : 'N/A'}
                        onChange={(e) => handleSkillChange(index, e)}
                        required
                        style={styles.input}
                      >
                        {skillLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </>
              )}
              <button type="submit" style={styles.button}>Add Employee</button>
            </form>
          )}
        </>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
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
  error: {
    color: 'red',
    marginBottom: '20px',
  },
  skillRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
};

export default HRHeadAllEmployees;
