import React, { useEffect, useState } from 'react';
import axios from 'axios';


const apiUrl = process.env.REACT_APP_API_URL;

const skillLevels = {
  N: '25%',
  A: '50%',
  M: '75%',
  E: '100%'
};

const SkillGaps = () => {
  const [employee, setEmployee] = useState(null);
  const [jobPositions, setJobPositions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. User not authenticated.');
        }

        const res = await axios.get(`https://localhost:5000/api/employees/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setEmployee(res.data.employee);
        setJobPositions(res.data.jobPositions || []); // Ensure jobPositions is an array
      } catch (error) {
        console.error('Profile fetch error:', error.message);
        setError('Failed to fetch profile data.');
      }
    };

    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. User not authenticated.');
        }

        const res = await axios.get(`https://localhost:5000/api/skills`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setSkills(res.data);
      } catch (error) {
        console.error('Error fetching skills:', error.message);
        setError('Failed to fetch skills.');
      }
    };

    fetchProfile();
    fetchSkills();
  }, []);

  const getJobPosition = () => {
    if (!employee || jobPositions.length === 0) return null;
    return jobPositions.find(jp => jp.employees && jp.employees.includes(employee._id)) || null;
  };

  const jobPosition = getJobPosition();

  const getSkillGap = (skillId) => {
    if (!jobPosition) return null;
    const requiredSkill = jobPosition.requiredSkills.find(skill => skill.skill === skillId) || null;
    const employeeSkill = employee.skills.find(skill => skill.skill._id === skillId) || null;

    if (requiredSkill && (!employeeSkill || skillLevels[employeeSkill.level] < skillLevels[requiredSkill.level])) {
      return requiredSkill.level;
    }
    return null;
  };

  if (error) return <div>{error}</div>;
  if (!employee || !skills.length) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Skill Overview</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Skill Libelle</th>
            <th>Skill Code</th>
            <th>Current Skill Level</th>
            <th>Required Skill Level</th>
          </tr>
        </thead>
        <tbody>
          {skills.map(skill => {
            const employeeSkill = employee.skills.find(es => es.skill && es.skill._id === skill._id) || {};
            const requiredSkillLevel = getSkillGap(skill._id);
            const currentSkillLevel = employeeSkill.level ? skillLevels[employeeSkill.level] : 'N/A';
            const isGap = requiredSkillLevel && skillLevels[currentSkillLevel] < skillLevels[requiredSkillLevel];

            return (
              <tr key={skill._id} style={isGap ? styles.gapRow : {}}>
                <td style={styles.td}>{skill.libelle}</td>
                <td style={styles.td}>{skill.code}</td>
                <td style={styles.centerText}>{currentSkillLevel}</td>
                <td style={styles.centerText}>{requiredSkillLevel ? skillLevels[requiredSkillLevel] : 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    border: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  gapRow: {
    backgroundColor: '#f8d7da',
  },
};

export default SkillGaps;
