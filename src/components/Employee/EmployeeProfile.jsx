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
                <td style={styles.tableHeader}>Intitulé du poste</td>
                <td>{jobPosition.title}</td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Référence</td>
                <td>{jobPosition.ref}</td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Service</td>
                <td>{jobPosition.service}</td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Lieu</td>
                <td>{jobPosition.lieu}</td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Intérimaire</td>
                <td>{jobPosition.interimaire}</td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Liaisons Hiérarchiques / Fonctionnelles</td>
                <td>{jobPosition.liaisonsHiera} / {jobPosition.liaisonsFonc}</td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Raison</td>
                <td>{jobPosition.raison}</td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>KPIs Qualitatifs / Quantitatifs</td>
                <td>
                  <ul>
                    {jobPosition.kpiQualt.map((kpi, index) => (
                      <li key={index}>{kpi}</li>
                    ))}
                    {jobPosition.kpiQuant.map((kpi, index) => (
                      <li key={index}>{kpi}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Évolution Verticale / Horizontale</td>
                <td>{jobPosition.evolutionV} / {jobPosition.evolutionH}</td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Limites</td>
                <td>
                  <ul>
                    {jobPosition.limites.map((limite, index) => (
                      <li key={index}>{limite}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Pouvoirs</td>
                <td>
                  <ul>
                    {jobPosition.pouvoirs.map((pouvoir, index) => (
                      <li key={index}>{pouvoir}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Missions</td>
                <td>
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
                <td style={styles.tableHeader}>Tâches Stratégiques</td>
                <td>
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
                <td style={styles.tableHeader}>Tâches Opérationnelles</td>
                <td>
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
                <td style={styles.tableHeader}>Tâches Occasionnelles</td>
                <td>
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
                <td style={styles.tableHeader}>Expertise Profile</td>
                <td>
                  <ul>
                    {jobPosition.tachesEP.map((tschema, index) => (
                      <li key={index}>
                        <strong>Int:</strong> {tschema.int} <strong>MoyOut:</strong> {tschema.moyOut}
                      </li>
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
  tableHeader: {
    fontWeight: 'bold',
    background: '#E0FFFF', // Light cyan background for headers
    padding: '10px',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
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
