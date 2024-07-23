import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const skillLevelsMap = {
  'N/A':'0%',
  'N': '25%',
  'A': '50%',
  'M': '75%',
  'E': '100%'
};

const SkillMatrix = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. User not authenticated.');
        }

        const [skillsResponse, employeesResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/skills`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get(`${apiUrl}/api/employees`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        setSkills(skillsResponse.data);
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchSkillsData();
  }, []);

  const getEmployeeSkillLevel = (employee, skillId) => {
    if (!employee || !employee.skills) return 'N/A';
    const employeeSkill = employee.skills.find(skill => skill.skill && skill.skill._id === skillId);
    return employeeSkill ? employeeSkill.level : 'N/A';
  };

  const getRequiredSkillLevel = (employee, skillId) => {
    const jobPosition = jobPositions.find(job => job._id === (employee.jobPosition ? employee.jobPosition._id : null));
    if (!jobPosition) return null;
    const requiredSkill = jobPosition.requiredSkills.find(skill => skill.skill && skill.skill._id === skillId);
    return requiredSkill ? requiredSkill.level : null;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>MATRICE DE COMPETENCES</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.headerCell}>COMPETENCE/EMPLOYE</th>
            {employees.map(employee => (
              <th key={employee._id} style={styles.headerCell}>{employee.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {skills.map(skill => (
            <tr key={skill._id} style={styles.row}>
              <td style={styles.cell}>{skill && skill.code ? skill.code : 'N/A'}</td>
              {employees.map(employee => {
                const employeeSkillLevel = getEmployeeSkillLevel(employee, skill._id);
                const requiredSkillLevel = getRequiredSkillLevel(employee, skill._id);
                const skillPercentage = skillLevelsMap[employeeSkillLevel] || '0%';
                const isUnderLevel = requiredSkillLevel && skillLevelsMap[employeeSkillLevel] < skillLevelsMap[requiredSkillLevel];

                return (
                  <td
                    key={employee._id}
                    style={{
                      ...styles.cell,
                      backgroundColor: isUnderLevel ? 'red' : 'transparent',
                      color: isUnderLevel ? 'white' : 'black'
                    }}
                  >
                    {skillPercentage}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    background: 'linear-gradient(to bottom right, #f0f4f7, #d9e2ec)',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    fontSize: '24px',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 15px',
  },
  headerCell: {
    background: '#0066ff',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    borderRadius: '8px',
  },
  row: {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  cell: {
    padding: '10px',
    textAlign: 'center',
    borderRadius: '8px',
  },
};

export default SkillMatrix;
