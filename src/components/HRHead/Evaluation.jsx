import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Evaluation = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [evaluationTotal, setEvaluationTotal] = useState(0);
  const [error, setError] = useState(null);

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

  // Save evaluation
  const saveEvaluation = async () => {
    if (!selectedEmployee) {
      alert('Please select an employee.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/evaluation/${selectedEmployee}`,
        { totalEvaluation: evaluationTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Evaluation saved successfully.');
    } catch (err) {
      console.error('Error saving evaluation:', err);
      setError('Failed to save evaluation.');
    }
  };

  // Calculate results and totals
  const calculateResult = () => {
    const totalPerformance = parseFloat(document.getElementById('total-performance').textContent) || 0;
    const totalCompetence = parseFloat(document.getElementById('total-competence').textContent) || 0;

    const pondPerformance = parseFloat(document.getElementById('pond-performance').value) / 100 || 0;
    const pondCompetence = parseFloat(document.getElementById('pond-competence').value) / 100 || 0;

    const resultPerformance = totalPerformance * pondPerformance;
    const resultCompetence = totalCompetence * pondCompetence;

    const totalResult = resultPerformance + resultCompetence;
    setEvaluationTotal(totalResult.toFixed(2));
    document.getElementById('total-result').textContent = totalResult.toFixed(2);
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
        <option value="">-- Select an Employee --</option>
        {employees.map((employee) => (
          <option key={employee._id} value={employee.name}>
            {employee.name}
          </option>
        ))}
      </select>

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
              <input
                type="number"
                id="pond-performance"
                placeholder="%"
                onInput={calculateResult}
                style={styles.input}
              />
            </td>
            <td style={styles.tableCell} id="result-performance">0.00</td>
          </tr>
          <tr>
            <td style={styles.tableCell}>Compétence</td>
            <td style={styles.tableCell} id="total-competence">0.00</td>
            <td style={styles.tableCell}>
              <input
                type="number"
                id="pond-competence"
                placeholder="%"
                onInput={calculateResult}
                style={styles.input}
              />
            </td>
            <td style={styles.tableCell} id="result-competence">0.00</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td style={styles.tableFooter} colSpan="3">Total</td>
            <td style={styles.tableFooter} id="total-result">0.00</td>
          </tr>
        </tfoot>
      </table>

      <button onClick={saveEvaluation} style={styles.button}>
        Save Evaluation
      </button>
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