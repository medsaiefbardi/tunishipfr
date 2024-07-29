import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. User not authenticated.');
        }

        const res = await axios.get(`${apiUrl}/api/employees/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setEmployee(res.data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch profile. Please ensure you are logged in.');
      }
    };

    fetchProfile();
  }, []);

  if (!employee) return <div>Loading...</div>;

  const jobPosition = employee.jobPosition;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{employee.name}</h1>
      {jobPosition ? (
        <div style={styles.card}>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.tableCellHeader}>Intitulé du poste</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>{jobPosition.title}</td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Référence</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>{jobPosition.ref}</td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Service</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>{jobPosition.service}</td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Lieu</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>{jobPosition.lieu}</td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Intérimaire</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>{jobPosition.interimaire}</td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Liaisons Hiérarchiques</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>{jobPosition.liaisonsHiera}</td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Liaisons Fonctionnelles</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>{jobPosition.liaisonsFonc}</td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Raison</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>{jobPosition.raison}</td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Missions</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>
                  <ul>
                    {jobPosition.mission.map((mission, index) => (
                      <li key={index}>
                        <strong>{mission.name}:</strong> {mission.description}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Tâches Stratégiques</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>
                  <ul>
                    {jobPosition.tachesStrat.map((task, index) => (
                      <li key={index}>
                        <strong>{task.name}:</strong> {task.description}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Tâches Opérationnelles</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>
                  <ul>
                    {jobPosition.tacheOper.map((task, index) => (
                      <li key={index}>
                        <strong>{task.name}:</strong> {task.description}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Tâches Occasionnelles</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>
                  <ul>
                    {jobPosition.tacheOccas.map((task, index) => (
                      <li key={index}>
                        <strong>{task.name}:</strong> {task.description}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>KPIs Qualitatifs</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>
                  <ul>
                    {jobPosition.kpiQualt.map((kpi, index) => (
                      <li key={index}>{kpi}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>KPIs Quantitatifs</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>
                  <ul>
                    {jobPosition.kpiQuant.map((kpi, index) => (
                      <li key={index}>{kpi}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Évolution Verticale</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>{jobPosition.evolutionV}</td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Évolution Horizontale</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>{jobPosition.evolutionH}</td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Limites</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>
                  <ul>
                    {jobPosition.limites.map((limite, index) => (
                      <li key={index}>{limite}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={styles.tableCellHeader}>Pouvoirs</td>
              </tr>
              <tr>
                <td style={styles.tableCell}>
                  <ul>
                    {jobPosition.pouvoirs.map((pouvoir, index) => (
                      <li key={index}>{pouvoir}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p style={styles.text}>No position assigned</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Georgia, serif',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px',
    background: '#f9f9f9',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#87CEFA', // Sky blue background
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableCellHeader: {
    fontWeight: 'bold',
    background: '#E0FFFF', // Light cyan background for headers
    padding: '10px',
    border: '1px solid #ddd',
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #ddd',
  },
  text: {
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: '10px',
    color: '#555',
  },
  listItem: {
    marginBottom: '10px',
  },
};

export default EmployeeProfile;
