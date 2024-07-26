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
        <>
          <div style={styles.row}>
            <div style={styles.col}>
              <p style={styles.text}><strong>POSITION:</strong> {jobPosition.title}</p>
              <p style={styles.text}><strong>REFERENCE:</strong> {jobPosition.ref}</p>
              <p style={styles.text}><strong>SERVICE:</strong> {jobPosition.service}</p>
              <p style={styles.text}><strong>LIEU:</strong> {jobPosition.lieu}</p>
              <p style={styles.text}><strong>INTERIMAIRE:</strong> {jobPosition.interimaire}</p>
            </div>
            <div style={styles.col}>
              <p style={styles.text}><strong>LIAISONS HIERARCHIQUES:</strong> {jobPosition.liaisonsHiera}</p>
              <p style={styles.text}><strong>LIAISONS FONCTIONNELLES:</strong> {jobPosition.liaisonsFonc}</p>
              <p style={styles.text}><strong>RAISON:</strong> {jobPosition.raison}</p>
              <p style={styles.text}><strong>KPIs QUANTITATIVES:</strong> {jobPosition.kpiQuant}</p>
              <p style={styles.text}><strong>KPIs QUALITATIVES:</strong> {jobPosition.kpiQualt}</p>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.col}>
              <p style={styles.text}><strong>EVOLUTION VERTICALE:</strong> {jobPosition.evolutionV}</p>
              <p style={styles.text}><strong>EVOLUTION HORIZONTALE:</strong> {jobPosition.evolutionH}</p>
              <p style={styles.text}><strong>LIMITES:</strong></p>
              <ul>
                {jobPosition.limites.map((limite, index) => (
                  <li key={index} style={styles.listItem}>{limite}</li>
                ))}
              </ul>
            </div>
            <div style={styles.col}>
              {/* <p style={styles.text}><strong>OBJECTIFS:</strong></p>
              <ul>
                {jobPosition.objectifs.map((objectifs, index) => (
                  <li key={index} style={styles.listItem}>
                    <strong>{objectifs.name}:</strong> {objectifs.description}
                  </li>
                ))}
              </ul> */}
              <p style={styles.text}><strong>POUVOIRS:</strong></p>
              <ul>
                {jobPosition.pouvoirs.map((pouvoir, index) => (
                  <li key={index} style={styles.listItem}>{pouvoir}</li>
                ))}
              </ul>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.colFull}>
              <p style={styles.text}><strong>MISSIONS:</strong></p>
              <ul>
                {jobPosition.mission.map((mission, index) => (
                  <li key={index} style={styles.listItem}>
                    <strong>{mission.name}:</strong> {mission.description}
                  </li>
                ))}
              </ul>
              <p style={styles.text}><strong>TACHES OPERATIONNELLES:</strong></p>
              <ul>
                {jobPosition.tacheOper.map((task, index) => (
                  <li key={index} style={styles.listItem}>
                    <strong>{task.name}:</strong> {task.description}
                  </li>
                ))}
              </ul>
              <p style={styles.text}><strong>TACHES OCCASIONNELLES:</strong></p>
              <ul>
                {jobPosition.tacheOccas.map((task, index) => (
                  <li key={index} style={styles.listItem}>
                    <strong>{task.name}:</strong> {task.description}
                  </li>
                ))}
              </ul>
              <p style={styles.text}><strong>TACHES STRATIGIQUES:</strong></p>
              <ul>
                {jobPosition.tachesStrat.map((task, index) => (
                  <li key={index} style={styles.listItem}>
                    <strong>{task.name}:</strong> {task.description}
                  </li>
                ))}
              </ul>
              <p style={styles.text}><strong>Expertise Profile:</strong></p>
              <ul>
                {jobPosition.tachesEP.map((tschema, index) => (
                  <li key={index} style={styles.listItem}>
                    <strong>Int:</strong> {tschema.int} <strong>MoyOut:</strong> {tschema.moyOut}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
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
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  col: {
    flex: '1',
    padding: '10px',
  },
  colFull: {
    flex: '1',
    padding: '10px',
    flexBasis: '100%',
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
