import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const SkillGaps = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/api/employees/skill-gaps`)
      .then(response => setEmployees(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Skill Gaps</h1>
      <ul>
        {employees.map(employee => (
          <li key={employee._id}>
            {employee.name} - Gaps: {employee.skillGaps.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillGaps;
