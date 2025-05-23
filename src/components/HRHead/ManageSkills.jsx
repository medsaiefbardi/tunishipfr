import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const skillTypes = [
  'connaissance',
  'savoir faire',
  'savoir etre',
 
];

const skillLevels = ['N/A','N', 'A', 'M', 'E'];

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    libelle: '',
    code: '',
    type: '',
    level: '',
    definition: '',
    notion: '',
    application: '',
    maitrise: '',
    expertise: ''
  });
  const [editSkill, setEditSkill] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. User not authenticated.');
        }

        const res = await axios.get(`${apiUrl}/api/skills`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setSkills(res.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const res = await axios.post(`${apiUrl}/api/skills`, newSkill, { headers });
      setSkills([...skills, res.data]);
      setNewSkill({
        libelle: '',
        code: '',
        type: '',
        level: '',
        definition: '',
        notion: '',
        application: '',
        maitrise: '',
        expertise: ''
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditSkill = async (e) => {
    e.preventDefault();
    if (!editSkill) return;
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const res = await axios.put(`${apiUrl}/api/skills/${editSkill._id}`, editSkill, { headers });
      const updatedSkills = skills.map(skill => skill._id === res.data._id ? res.data : skill);
      setSkills(updatedSkills);
      setEditSkill(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.delete(`${apiUrl}/api/skills/${id}`, { headers });
      setSkills(skills.filter(skill => skill._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editSkill) {
      setEditSkill({ ...editSkill, [name]: value });
    } else {
      setNewSkill({ ...newSkill, [name]: value });
    }
  };

  const handleEditClick = (skill) => {
    setEditSkill(skill);
  };
  const handleInputResize = (e) => {
    e.target.style.width = 'auto';
    e.target.style.width = `${e.target.scrollWidth}px`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>COMPETENCES</h1>
      <form onSubmit={editSkill ? handleEditSkill : handleAddSkill} style={styles.form}>
        <input
          type="text"
          name="libelle"
          value={editSkill ? editSkill.libelle : newSkill.libelle}
          onChange={handleInputChange}
          onInput={handleInputResize}
          placeholder="LIBELLE"
          required
          style={styles.input}
        />
        <textarea
          type="text"
          name="code"
          value={editSkill ? editSkill.code : newSkill.code}
          onChange={handleInputChange}
          
          placeholder="CODE"
          required
          style={styles.textarea}
        />
        <select
          name="type"
          value={editSkill ? editSkill.type : newSkill.type}
          onChange={handleInputChange}
          
          required
          style={styles.select}
        >
          <option value="">TYPE</option>
          {skillTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          name="level"
          value={editSkill ? editSkill.level : newSkill.level}
          onChange={handleInputChange}
          required
          style={styles.select}
        >
          <option value="">LEVEL PAR DEFAUT</option>
          {skillLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        <textarea
          type="text"
          name="definition"
          value={editSkill ? editSkill.definition : newSkill.definition}
          onChange={handleInputChange}
          
          placeholder="DEFINITION"
          style={styles.textarea}
        />
        <textarea
          type="text"
          name="notion"
          value={editSkill ? editSkill.notion : newSkill.notion}
          onChange={handleInputChange}
          
          placeholder="NOTION"
          style={styles.textarea}
        />
        <textarea
          type="text"
          name="application"
          value={editSkill ? editSkill.application : newSkill.application}
          onChange={handleInputChange}
          
          placeholder="APPLICATION"
          style={styles.textarea}
        />
        <textarea
          type="text"
          name="maitrise"
          value={editSkill ? editSkill.maitrise : newSkill.maitrise}
          onChange={handleInputChange}
          
          placeholder="MAITRISE"
          style={styles.textarea}
        />
        <textarea
          type="text"
          name="expertise"
          value={editSkill ? editSkill.expertise : newSkill.expertise}
          onChange={handleInputChange}
          
          placeholder="EXPERTISE"
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>
          {editSkill ? 'MàJ COMPETENCE' : 'AJOUTER COMPETENCE'}
        </button>
      </form>
      <h3>Referentiel de compétences</h3>
      <ul style={styles.list}>
        {skills.map(skill => (
          <li key={skill._id} style={styles.listItem}>
            {skill.libelle} ({skill.code})
            <div>
              <button onClick={() => handleEditClick(skill)} style={styles.button}>MODIFIER</button>
              <button onClick={() => handleDeleteSkill(skill._id)} style={styles.button}>SUPPRIMER</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  heading: {
    textAlign: 'center',
    color: '#555',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  
  textarea: {
    width: '100%',  // Updated to 100% width
    padding: '12px',  // Increased padding
    fontSize: '16px',  // Increased font size
    border: '1px solid #ccc',
    resize: 'vertical',
    minHeight: '40px'
  },
  select: {
    width: '100%',  // Updated to 100% width
    padding: '12px',  // Increased padding
    fontSize: '16px',  // Increased font size
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
};

export default ManageSkills;
