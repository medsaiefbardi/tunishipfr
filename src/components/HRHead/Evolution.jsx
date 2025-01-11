import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  padding: 20px;
  background-color: #f0f8ff;
  color: #2c3e50;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #3498db;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px 0;

  &:hover {
    background-color: #2980b9;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #3498db;
    color: white;
  }

  td input {
    width: 90%;
    padding: 5px;
  }
`;

const Select = styled.select`
  padding: 10px;
  margin: 10px 0;
  width: 100%;
`;

const ErrorMessage = styled.p`
  color: red;
`;

const Evaluation = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [evaluation, setEvaluation] = useState({
    objectivesPerformance: [{ objective: '', target: '', result: '', P: '', O: '' }],
    objectivesCompetence: [{ objective: '', target: '', result: '', P: '', O: '' }],
    totalPerformance: 0,
    totalCompetence: 0,
    totalEvaluation: 0,
  });
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL
;

  // Fonction pour obtenir les en-têtes d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token manquant. Veuillez vous connecter.');
    }
    return { Authorization: `Bearer ${token}` };
  };

  // Fonction pour charger les employés
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees`, {
        headers: getAuthHeaders(),
      });
      setEmployees(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des employés :', err);
      setError('Impossible de charger les employés.');
    }
  };

  // Fonction pour charger l'évaluation d'un employé
  const fetchEvaluation = async (employeeName) => {
    try {
      const response = await axios.get(`${API_URL}/evaluation/${employeeName}`, {
        headers: getAuthHeaders(),
      });
      setEvaluation(response.data.evaluation || {
        objectivesPerformance: [{ objective: '', target: '', result: '', P: '', O: '' }],
        objectivesCompetence: [{ objective: '', target: '', result: '', P: '', O: '' }],
        totalPerformance: 0,
        totalCompetence: 0,
        totalEvaluation: 0,
      });
    } catch (err) {
      console.error('Erreur lors du chargement de l\'évaluation :', err);
      setError('Erreur lors du chargement de l\'évaluation.');
    }
  };

  // Fonction pour sauvegarder l'évaluation
  const calculateTotals = () => {
    const totalPerformance = evaluation.objectivesPerformance.reduce((sum, obj) => {
      const resultPercentage = (parseFloat(obj.result) / parseFloat(obj.target)) * 100 || 0;
      const O = (resultPercentage * parseFloat(obj.P)) / 100 || 0;
      return sum + O;
    }, 0);
  
    const totalCompetence = evaluation.objectivesCompetence.reduce((sum, obj) => {
      const resultPercentage = (parseFloat(obj.result) / parseFloat(obj.target)) * 100 || 0;
      const O = (resultPercentage * parseFloat(obj.P)) / 100 || 0;
      return sum + O;
    }, 0);
  
    setEvaluation((prev) => ({
      ...prev,
      totalPerformance: totalPerformance.toFixed(2),
      totalCompetence: totalCompetence.toFixed(2),
      totalEvaluation: (totalPerformance + totalCompetence).toFixed(2),
    }));
  };
  
  const saveEvaluation = async () => {
    try {
      // Calcul des totaux avant soumission
      const totalPerformance = evaluation.objectivesPerformance.reduce((sum, obj) => {
        const resultPercentage = (parseFloat(obj.result) / parseFloat(obj.target)) * 100 || 0;
        const O = (resultPercentage * parseFloat(obj.P)) / 100 || 0;
        return sum + O;
      }, 0);
  
      const totalCompetence = evaluation.objectivesCompetence.reduce((sum, obj) => {
        const resultPercentage = (parseFloat(obj.result) / parseFloat(obj.target)) * 100 || 0;
        const O = (resultPercentage * parseFloat(obj.P)) / 100 || 0;
        return sum + O;
      }, 0);
  
      const updatedEvaluation = {
        ...evaluation,
        totalPerformance: totalPerformance.toFixed(2),
        totalCompetence: totalCompetence.toFixed(2),
        totalEvaluation: (totalPerformance + totalCompetence).toFixed(2),
      };
  
      console.log('Payload envoyé au backend :', updatedEvaluation);
  
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/evaluation/${selectedEmployee}`,
        updatedEvaluation,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert('Évaluation sauvegardée avec succès.');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'évaluation :', err);
      setError('Erreur lors de la sauvegarde.');
    }
  };
  // Gestion de la sélection d'un employé
  const handleEmployeeSelection = (event) => {
    const employeeName = event.target.value;
    setSelectedEmployee(employeeName);
    fetchEvaluation(employeeName);
  };

  // Gestion des modifications dans les tableaux
  const handleInputChange = (type, index, key, value) => {
    const updatedObjectives = [...evaluation[type]];
    updatedObjectives[index][key] = value;

    if (key === 'result' || key === 'P') {
      const resultPercentage =
        (parseFloat(updatedObjectives[index].result) / parseFloat(updatedObjectives[index].target)) * 100 || 0;
      const O = (resultPercentage * parseFloat(updatedObjectives[index].P)) / 100 || 0;
      updatedObjectives[index].O = O.toFixed(2);
    }

    setEvaluation((prev) => ({
      ...prev,
      [type]: updatedObjectives,
    }));
  };

  // Ajouter une nouvelle ligne dans un tableau
  const addRow = (type) => {
    setEvaluation((prev) => ({
      ...prev,
      [type]: [...prev[type], { objective: '', target: '', result: '', P: '', O: '' }],
    }));
  };

  useEffect(() => {
    try {
      fetchEmployees();
    } catch (err) {
      console.error('Erreur d\'authentification :', err);
      setError(err.message);
    }
  }, []);

  return (
    <Container>
      <Title>Évaluation</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Select onChange={handleEmployeeSelection} value={selectedEmployee || ''}>
        <option value="">-- Choisir un employé --</option>
        {employees.map((employee) => (
          <option key={employee.name} value={employee.name}>
            {employee.name}
          </option>
        ))}
      </Select>

      {selectedEmployee && (
        <>
          <h2>Objectifs de Performance</h2>
          <Button onClick={() => addRow('objectivesPerformance')}>Ajouter une ligne</Button>
          <Table>
            <thead>
              <tr>
                <th>Objectif</th>
                <th>Cible</th>
                <th>Résultat Réalisé</th>
                <th>P (%)</th>
                <th>O (%)</th>
              </tr>
            </thead>
            <tbody>
              {evaluation.objectivesPerformance.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={row.objective}
                      onChange={(e) => handleInputChange('objectivesPerformance', index, 'objective', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.target}
                      onChange={(e) => handleInputChange('objectivesPerformance', index, 'target', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.result}
                      onChange={(e) => handleInputChange('objectivesPerformance', index, 'result', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.P}
                      onChange={(e) => handleInputChange('objectivesPerformance', index, 'P', e.target.value)}
                    />
                  </td>
                  <td>{row.O}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h2>Objectifs de Compétence</h2>
          <Button onClick={() => addRow('objectivesCompetence')}>Ajouter une ligne</Button>
          <Table>
            <thead>
              <tr>
                <th>Objectif</th>
                <th>Cible</th>
                <th>Résultat Réalisé</th>
                <th>P (%)</th>
                <th>O (%)</th>
              </tr>
            </thead>
            <tbody>
              {evaluation.objectivesCompetence.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={row.objective}
                      onChange={(e) => handleInputChange('objectivesCompetence', index, 'objective', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.target}
                      onChange={(e) => handleInputChange('objectivesCompetence', index, 'target', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.result}
                      onChange={(e) => handleInputChange('objectivesCompetence', index, 'result', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.P}
                      onChange={(e) => handleInputChange('objectivesCompetence', index, 'P', e.target.value)}
                    />
                  </td>
                  <td>{row.O}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Button onClick={saveEvaluation}>Soumettre</Button>
        </>
      )}
    </Container>
  );
};

export default Evaluation;
