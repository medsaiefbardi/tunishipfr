import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Evaluation = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [evaluationTotal, setEvaluationTotal] = useState(0);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(response.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to fetch employees.');
      }
    };

    fetchEmployees();
  }, [API_URL]);

  // Add a new row to a table
  const addRow = (tableId) => {
    const table = document.getElementById(tableId).querySelector('tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td><input type="text" placeholder="Nom KPI" /></td>
      <td>
        <input type="number" class="cible" placeholder="Cible" oninput="calculateResult()" />
        <input type="number" class="resultat-realise" placeholder="Résultat Réalisé" oninput="calculateResult()" />
        <input type="text" class="pourcentage" placeholder="%" readonly />
      </td>
      <td><input type="number" class="ponderation" placeholder="%" oninput="calculateResult()" /></td>
    `;
    table.appendChild(newRow);
  };

  // Calculate results and totals
  const calculateResult = () => {
    const calculateTableTotal = (tableId, totalId) => {
      let total = 0;
      document.querySelectorAll(`#${tableId} tbody tr`).forEach((row) => {
        const cible = parseFloat(row.querySelector('.cible').value) || 0;
        const resultatRealise = parseFloat(row.querySelector('.resultat-realise').value) || 0;
        const ponderation = parseFloat(row.querySelector('.ponderation').value) || 0;

        const pourcentage = (resultatRealise / cible) * 100;
        row.querySelector('.pourcentage').value = isNaN(pourcentage) ? '' : pourcentage.toFixed(2) + '%';

        const O = (resultatRealise / cible) * ponderation;
        total += isNaN(O) ? 0 : O;
      });
      document.getElementById(totalId).textContent = total.toFixed(2);
      return total;
    };

    const totalPerformance = calculateTableTotal('table-performance', 'total-performance');
    const totalCompetence = calculateTableTotal('table-competence', 'total-competence');
    const totalGarence = calculateTableTotal('table-garence', 'total-garence');

    const pondPerformance = parseFloat(document.getElementById('pond-performance').value) / 100 || 0;
    const pondCompetence = parseFloat(document.getElementById('pond-competence').value) / 100 || 0;
    const pondGarence = parseFloat(document.getElementById('pond-garence').value) / 100 || 0;

    const resultPerformance = totalPerformance * pondPerformance;
    const resultCompetence = totalCompetence * pondCompetence;
    const resultGarence = totalGarence * pondGarence;

    const totalResult = resultPerformance + resultCompetence + resultGarence;
    setEvaluationTotal(totalResult.toFixed(2));
    document.getElementById('total-result').textContent = totalResult.toFixed(2);
  };

  // Save evaluation
  const saveEvaluation = async () => {
    if (!selectedEmployee) {
      alert('Veuillez sélectionner un employé.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/evaluation/${selectedEmployee}`,
        { totalEvaluation: evaluationTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Évaluation sauvegardée avec succès.');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'évaluation :', err);
      setError('Échec de la sauvegarde de l\'évaluation.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Fiche d'évaluation</h1>

      {error && <p style={styles.error}>{error}</p>}

      <select
        onChange={(e) => setSelectedEmployee(e.target.value)}
        value={selectedEmployee || ''}
        style={styles.select}
      >
        <option value="">-- Sélectionnez un employé --</option>
        {employees.map((employee) => (
          <option key={employee._id} value={employee.name}>
            {employee.name}
          </option>
        ))}
      </select>

      {/* Performance Table */}
      <h2 style={styles.subHeading}>Tableau des KPIs de Performance</h2>
      <table style={styles.table} id="table-performance">
        <thead>
          <tr>
            <th style={styles.tableHeader}>Nom KPIs</th>
            <th style={styles.tableHeader}>Niveau (Cible / Résultat Réalisé)</th>
            <th style={styles.tableHeader}>Pondération</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" placeholder="Nom KPI" style={styles.input} /></td>
            <td>
              <input type="number" className="cible" placeholder="Cible" onInput={calculateResult} style={styles.input} />
              <input type="number" className="resultat-realise" placeholder="Résultat Réalisé" onInput={calculateResult} style={styles.input} />
              <input type="text" className="pourcentage" placeholder="%" readOnly style={styles.input} />
            </td>
            <td><input type="number" className="ponderation" placeholder="%" onInput={calculateResult} style={styles.input} /></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" style={styles.tableFooter}>Total</td>
            <td id="total-performance" style={styles.tableFooter}>0.00</td>
          </tr>
          <tr>
            <td colSpan="3" style={styles.tableFooter}>
              <button onClick={() => addRow('table-performance')} style={styles.button}>Ajouter une ligne</button>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Competence Table */}
      <h2 style={styles.subHeading}>Tableau des KPIs de Compétence</h2>
      <table style={styles.table} id="table-competence">
        <thead>
          <tr>
            <th style={styles.tableHeader}>Nom KPIs</th>
            <th style={styles.tableHeader}>Niveau (Cible / Résultat Réalisé)</th>
            <th style={styles.tableHeader}>Pondération</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" placeholder="Nom KPI" style={styles.input} /></td>
            <td>
              <input type="number" className="cible" placeholder="Cible" onInput={calculateResult} style={styles.input} />
              <input type="number" className="resultat-realise" placeholder="Résultat Réalisé" onInput={calculateResult} style={styles.input} />
              <input type="text" className="pourcentage" placeholder="%" readOnly style={styles.input} />
            </td>
            <td><input type="number" className="ponderation" placeholder="%" onInput={calculateResult} style={styles.input} /></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" style={styles.tableFooter}>Total</td>
            <td id="total-competence" style={styles.tableFooter}>0.00</td>
          </tr>
          <tr>
            <td colSpan="3" style={styles.tableFooter}>
              <button onClick={() => addRow('table-competence')} style={styles.button}>Ajouter une ligne</button>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Garence Table */}
      <h2 style={styles.subHeading}>Tableau des KPIs de Gerance</h2>
      <table style={styles.table} id="table-garence">
        <thead>
          <tr>
            <th style={styles.tableHeader}>Nom KPIs</th>
            <th style={styles.tableHeader}>Niveau (Cible / Résultat Réalisé)</th>
            <th style={styles.tableHeader}>Pondération</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" placeholder="Nom KPI" style={styles.input} /></td>
            <td>
              <input type="number" className="cible" placeholder="Cible" onInput={calculateResult} style={styles.input} />
              <input type="number" className="resultat-realise" placeholder="Résultat Réalisé" onInput={calculateResult} style={styles.input} />
              <input type="text" className="pourcentage" placeholder="%" readOnly style={styles.input} />
            </td>
            <td><input type="number" className="ponderation" placeholder="%" onInput={calculateResult} style={styles.input} /></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" style={styles.tableFooter}>Total</td>
            <td id="total-garence" style={styles.tableFooter}>0.00</td>
          </tr>
          <tr>
            <td colSpan="3" style={styles.tableFooter}>
              <button onClick={() => addRow('table-garence')} style={styles.button}>Ajouter une ligne</button>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Evaluation Total */}
      <h2 style={styles.subHeading}>Tableau d'Évaluation</h2>
      <table style={styles.table} id="table-evaluation">
        <thead>
          <tr>
            <th style={styles.tableHeader}>KPIs</th>
            <th style={styles.tableHeader}>Résultat Total</th>
            <th style={styles.tableHeader}>Pondération (%)</th>
            <th style={styles.tableHeader}>Résultat</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.tableCell}>Performance</td>
            <td style={styles.tableCell} id="total-performance">0.00</td>
            <td style={styles.tableCell}>
              <input type="number" id="pond-performance" placeholder="%" onInput={calculateResult} style={styles.input} />
            </td>
            <td style={styles.tableCell} id="result-performance">0.00</td>
          </tr>
          <tr>
            <td style={styles.tableCell}>Compétence</td>
            <td style={styles.tableCell} id="total-competence">0.00</td>
            <td style={styles.tableCell}>
              <input type="number" id="pond-competence" placeholder="%" onInput={calculateResult} style={styles.input} />
            </td>
            <td style={styles.tableCell} id="result-competence">0.00</td>
          </tr>
          <tr>
            <td style={styles.tableCell}>Gerance</td>
            <td style={styles.tableCell} id="total-garence">0.00</td>
            <td style={styles.tableCell}>
              <input type="number" id="pond-garence" placeholder="%" onInput={calculateResult} style={styles.input} />
            </td>
            <td style={styles.tableCell} id="result-garence">0.00</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" style={styles.tableFooter}>Total</td>
            <td id="total-result" style={styles.tableFooter}>0.00</td>
          </tr>
        </tfoot>
      </table>

      <button onClick={saveEvaluation} style={styles.button}>Sauvegarder l'évaluation</button>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f8ff',
    color: '#333',
    padding: '20px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2em',
    color: '#4682b4',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '1.5em',
    color: '#4682b4',
    marginTop: '30px',
    marginBottom: '20px',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #cfe2f3',
  },
  table: {
    width: '90%',
    maxWidth: '1200px',
    margin: '20px auto',
    borderCollapse: 'collapse',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    background: 'linear-gradient(180deg, #b3d7ff, #4682b4)',
    color: 'white',
    fontWeight: 'bold',
    padding: '10px',
    border: '1px solid #cfe2f3',
  },
  tableCell: {
    border: '1px solid #cfe2f3',
    padding: '10px',
    textAlign: 'center',
  },
  tableFooter: {
    fontWeight: 'bold',
    backgroundColor: '#e6f2ff',
    padding: '10px',
    textAlign: 'center',
  },
  input: {
    width: '90%',
    padding: '5px',
    border: '1px solid #cfe2f3',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: '#4682b4',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    marginTop: '20px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
};

export default Evaluation;