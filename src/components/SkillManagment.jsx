import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const SkillManagement = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ libelle: '',code: '', definition: '', notion: '', application: '',maitrise :'', expertise: '' });

  useEffect(() => {
    axios.get("https://localhost:5000/api/skills")
      .then(response => setSkills(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleInputChange = (e) => {
    const { libelle, value } = e.target;
    setNewSkill({ ...newSkill, [libelle]: value });
  };

  const handleAddSkill = () => {
    axios.post("https://localhost:5000/api/skills", newSkill)
      .then(response => setSkills([...skills, response.data]))
      .catch(error => console.error(error));
  };

  const handleDeleteSkill = (id) => {
    axios.delete(`https://localhost:5000/api/skills/${id}`)
      .then(() => setSkills(skills.filter(skill => skill._id !== id)))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Skill Management</h1>
      <input type="text" name="libelle" placeholder="Libelle" onChange={handleInputChange} />
      <input type="text" name="code" placeholder="Code" onChange={handleInputChange} />
      <input type="text" name="definition" placeholder="Definition" onChange={handleInputChange} />
      <input type="text" name="notion" placeholder="Notion" onChange={handleInputChange} />
      <input type="text" name="application" placeholder="Application" onChange={handleInputChange} />
      <input type="text" name="expertise" placeholder="Expertise" onChange={handleInputChange} />
      <input type="text" name="maitrise" placeholder="Maitrise" onChange={handleInputChange} />
      <button onClick={handleAddSkill}>Add Skill</button>
      <ul>
        {skills.map(skill => (
          <li key={skill._id}>
            {skill.libelle}
            <button onClick={() => handleDeleteSkill(skill._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillManagement;
