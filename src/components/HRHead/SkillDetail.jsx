import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

const SkillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [skill, setSkill] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedSkill, setUpdatedSkill] = useState({ name: '', code: '' });

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. User not authenticated.');
        }

        const res = await axios.get(`https://localhost:5000/api/skills/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setSkill(res.data);
        setUpdatedSkill(res.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchSkill();
  }, [id]);

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.put(`https://localhost:5000/api/skills/${id}`, updatedSkill, { headers });
      setSkill(updatedSkill);
      setEditMode(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteSkill = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.delete(`https://localhost:5000/api/skills/${id}`, { headers });
      navigate('/manage-skills');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSkill({ ...updatedSkill, [name]: value });
  };

  if (!skill) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Skill Detail</h1>
      {editMode ? (
        <form onSubmit={handleUpdateSkill} style={styles.form}>
          <input
            type="text"
            name="name"
            value={updatedSkill.name}
            onChange={handleInputChange}
            placeholder="Skill Name"
            required
            style={styles.input}
          />
          <input
            type="text"
            name="code"
            value={updatedSkill.code}
            onChange={handleInputChange}
            placeholder="Skill Code"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Save</button>
        </form>
      ) : (
        <div>
          <p style={styles.text}><strong>Name:</strong> {skill.name}</p>
          <p style={styles.text}><strong>Code:</strong> {skill.code}</p>
          <button onClick={() => setEditMode(true)} style={styles.button}>Edit</button>
          <button onClick={handleDeleteSkill} style={styles.button}>Delete</button>
        </div>
      )}
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
  input: {
    width: '80%',
    padding: '10px',
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
  text: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
  },
};

export default SkillDetail;
