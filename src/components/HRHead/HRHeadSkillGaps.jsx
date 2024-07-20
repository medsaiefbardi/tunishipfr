import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const skillLevelToPercentage = {
  'N/A' : '0%',
  'N': '25%',
  'A': '50%',
  'M': '75%',
  'E': '100%',
};

const HRHeadSkillGaps = () => {
  const [skillGaps, setSkillGaps] = useState([]);

  useEffect(() => {
    const fetchSkillGaps = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. User not authenticated.');
        }

        const res = await axios.get(`https://localhost:5000/api/employees/skill-gaps`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setSkillGaps(res.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchSkillGaps();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>HR Skill Gaps</h1>
      {skillGaps.map(({ employee, gaps }) => (
        <div key={employee} style={styles.employeeContainer}>
          <h2>{employee}</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Skill</th>
                <th style={styles.th}>Employee Level</th>
                <th style={styles.th}>Required Level</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((gap, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>{gap.skill}</td>
                  <td style={styles.td}>{skillLevelToPercentage[gap.employeeLevel]}</td>
                  <td style={styles.td}>{skillLevelToPercentage[gap.requiredLevel]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    overflowX: 'auto',
  },
  heading: {
    color: '#0066ff',
    marginBottom: '20px',
    textAlign: 'center',
  },
  employeeContainer: {
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '10px',
    background: '#f4f4f4',
    border: '1px solid #ddd',
  },
  tr: {
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ddd',
  },
};

export default HRHeadSkillGaps;
