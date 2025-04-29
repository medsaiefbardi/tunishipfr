import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Evaluation = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [evaluationTotal, setEvaluationTotal] = useState(0);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

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

  const calculateResult = () => {
    const totalResult = parseFloat(document.getElementById('total-result').textContent) || 0;
    setEvaluationTotal(totalResult.toFixed(2));
  };

  return (
    <div>
      <h1>Fiche d'évaluation</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <select onChange={(e) => setSelectedEmployee(e.target.value)} value={selectedEmployee || ''}>
        <option value="">-- Select an Employee --</option>
        {employees.map((employee) => (
          <option key={employee._id} value={employee.name}>
            {employee.name}
          </option>
        ))}
      </select>

      <h2>Tableau d'Évaluation</h2>
      <table id="table-evaluation">
        <thead>
          <tr>
            <th>KPIs</th>
            <th>Résultat Total</th>
            <th>Pondération (%)</th>
            <th>Résultat</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Performance</td>
            <td id="total-performance">0.00</td>
            <td><input type="number" id="pond-performance" placeholder="%" onInput={calculateResult} /></td>
            <td id="result-performance">0.00</td>
          </tr>
          <tr>
            <td>Compétence</td>
            <td id="total-competence">0.00</td>
            <td><input type="number" id="pond-competence" placeholder="%" onInput={calculateResult} /></td>
            <td id="result-competence">0.00</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Total</td>
            <td id="total-result">0.00</td>
          </tr>
        </tfoot>
      </table>

      <button onClick={saveEvaluation}>Save Evaluation</button>
    </div>
  );
};

export default Evaluation;