import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const skillLevels = ['N/A', 'N', 'A', 'M', 'E'];

const ManageJobPositions = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newJobPosition, setNewJobPosition] = useState({
    title: '',
    ref: '',
    service: '',
    lieu: '',
    interimaire: '',
    liaisonsHiera: '',
    liaisonsFonc: '',
    raison: '',
    mission: [{ name: '', description: '' }],
    tacheOper: [{ name: '', description: '' }],
    tacheOccas: [{ name: '', description: '' }],
    tachesStrat: [{ name: '', description: '' }],
    tachesEP: [{ titre: '', int: '', moyOut: '' }],
    kpiQuant: '',
    kpiQualt: '',
    evolutionV: '',
    evolutionH: '',
    limites: '',
    objectifs: [{ name: '', description: '' }],
    pouvoirs: '',
    requiredSkills: []
  });
  const [selectedJobPosition, setSelectedJobPosition] = useState(null);

  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. User not authenticated.');
        }

        const res = await axios.get(`${apiUrl}/api/job-positions`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setJobPositions(res.data);
      } catch (error) {
        console.error(error.message);
      }
    };

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
        setNewJobPosition(newJobPosition => ({
          ...newJobPosition,
          requiredSkills: res.data.map(skill => ({ skill: skill._id, level: 'N/A' }))
        }));
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchJobPositions();
    fetchSkills();
  }, []);

  const initializeRequiredSkills = (requiredSkills) => {
    return skills.map(skill => {
      const existingSkill = requiredSkills.find(rs => rs.skill === skill._id);
      return existingSkill ? existingSkill : { skill: skill._id, level: 'N/A' };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedJobPosition) {
      setSelectedJobPosition({ ...selectedJobPosition, [name]: value });
    } else {
      setNewJobPosition({ ...newJobPosition, [name]: value });
    }
  };

  const handleArrayInputChange = (index, e, arrayName) => {
    const { name, value } = e.target;
    const arrayCopy = selectedJobPosition ? [...selectedJobPosition[arrayName]] : [...newJobPosition[arrayName]];
    arrayCopy[index][name] = value;
    if (selectedJobPosition) {
      setSelectedJobPosition({ ...selectedJobPosition, [arrayName]: arrayCopy });
    } else {
      setNewJobPosition({ ...newJobPosition, [arrayName]: arrayCopy });
    }
  };

  const handleAddJobPosition = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const res = await axios.post(`${apiUrl}/api/job-positions`, newJobPosition, { headers });
      setJobPositions([...jobPositions, res.data]);
      setNewJobPosition({
        title: '',
        ref: '',
        service: '',
        lieu: '',
        interimaire: '',
        liaisonsHiera: '',
        liaisonsFonc: '',
        raison: '',
        mission: [{ name: '', description: '' }],
        tacheOper: [{ name: '', description: '' }],
        tacheOccas: [{ name: '', description: '' }],
        tachesStrat: [{ name: '', description: '' }],
        tachesEP: [{ titre: '', int: '', moyOut: '' }],
        kpiQuant: '',
        kpiQualt: '',
        evolutionV: '',
        evolutionH: '',
        limites: '',
        objectifs: [{ name: '', description: '' }],
        pouvoirs: '',
        requiredSkills: skills.map(skill => ({ skill: skill._id, level: 'N/A' }))
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleMàJJobPosition = async (e) => {
    e.preventDefault();
    if (!selectedJobPosition) return;
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const res = await axios.put(`${apiUrl}/api/job-positions/${selectedJobPosition._id}`, selectedJobPosition, { headers });
      setJobPositions(jobPositions.map(jp => jp._id === res.data._id ? res.data : jp));
      setSelectedJobPosition(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteJobPosition = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.delete(`${apiUrl}/api/job-positions/${id}`, { headers });
      setJobPositions(jobPositions.filter(jp => jp._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRequiredSkillChange = (index, e) => {
    const { name, value } = e.target;
    const requiredSkillsCopy = [...selectedJobPosition.requiredSkills];
    requiredSkillsCopy[index][name] = value;

    setSelectedJobPosition({ ...selectedJobPosition, requiredSkills: requiredSkillsCopy });
  };

  const handleRequiredSkillChange2 = (index, e) => {
    const { name, value } = e.target;
    const requiredSkillsCopy = [...newJobPosition.requiredSkills];
    requiredSkillsCopy[index][name] = value;

    setNewJobPosition({ ...newJobPosition, requiredSkills: requiredSkillsCopy });
  };

  const handleSelectJobPosition = (jobPosition) => {
    const initializedJobPosition = {
      ...jobPosition,
      mission: jobPosition.mission || [{ name: '', description: '' }],
      tacheOper: jobPosition.tacheOper || [{ name: '', description: '' }],
      tacheOccas: jobPosition.tacheOccas || [{ name: '', description: '' }],
      tachesStrat: jobPosition.tachesStrat || [{ name: '', description: '' }],
      tachesEP: jobPosition.tachesEP || [{ titre: '', int: '', moyOut: '' }],
      objectifs: jobPosition.objectifs || [{ name: '', description: '' }],
      requiredSkills: initializeRequiredSkills(jobPosition.requiredSkills)
    };
    setSelectedJobPosition(initializedJobPosition);
  };

  const handleBackToList = () => {
    setSelectedJobPosition(null);
  };

  const handleAddArrayItem = (arrayName) => {
    const newItem = arrayName === 'tachesEP' ? { titre: '', int: '', moyOut: '' } : { name: '', description: '' };
    if (selectedJobPosition) {
      setSelectedJobPosition({
        ...selectedJobPosition,
        [arrayName]: [...selectedJobPosition[arrayName], newItem]
      });
    } else {
      setNewJobPosition({
        ...newJobPosition,
        [arrayName]: [...newJobPosition[arrayName], newItem]
      });
    }
  };

  const handleInputResize = (e) => {
    e.target.style.width = 'auto';
    e.target.style.width = `${e.target.scrollWidth}px`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>FICHES DE POSTE</h1>
      <form onSubmit={selectedJobPosition ? handleMàJJobPosition : handleAddJobPosition} style={styles.form}>
        <label>TITRE</label>
        <input type="text" name="title" value={selectedJobPosition ? selectedJobPosition.title : newJobPosition.title || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Title" required style={styles.input} />
        <label>REFERENCE</label>
        <input type="text" name="ref" value={selectedJobPosition ? selectedJobPosition.ref : newJobPosition.ref || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Reference" required style={styles.input} />
        <label>SERVICE</label>
        <input type="text" name="service" value={selectedJobPosition ? selectedJobPosition.service : newJobPosition.service || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Service" required style={styles.input} />
        <label>LIEUX</label>
        <input type="text" name="lieu" value={selectedJobPosition ? selectedJobPosition.lieu : newJobPosition.lieu || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Location" required style={styles.input} />
        <label>INTERIMAIRE</label>
        <input type="text" name="interimaire" value={selectedJobPosition ? selectedJobPosition.interimaire : newJobPosition.interimaire || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Interim" required style={styles.input} />
        <label>LIAISONS HIERARCHIQUES</label>
        <input type="text" name="liaisonsHiera" value={selectedJobPosition ? selectedJobPosition.liaisonsHiera : newJobPosition.liaisonsHiera || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Hierarchical Connections" required style={styles.input} />
        <label>LIAISIONS FONCTIONNELLES</label>
        <input type="text" name="liaisonsFonc" value={selectedJobPosition ? selectedJobPosition.liaisonsFonc : newJobPosition.liaisonsFonc || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Functional Connections" required style={styles.input} />
        <label>RAISON</label>
        <input type="text" name="raison" value={selectedJobPosition ? selectedJobPosition.raison : newJobPosition.raison || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Reason" required style={styles.input} />

        <label>MISSION</label>
        {selectedJobPosition ? selectedJobPosition.mission.map((mission, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={mission.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'mission')} onInput={handleInputResize} placeholder="Mission Name" required style={styles.input} />
            <textarea name="description" value={mission.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'mission')} placeholder="Mission Description" required style={styles.textarea} />
          </div>
        )) : newJobPosition.mission.map((mission, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={mission.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'mission')} onInput={handleInputResize} placeholder="Mission Name" required style={styles.input} />
            <textarea name="description" value={mission.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'mission')} placeholder="Mission Description" required style={styles.textarea} />
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem('mission')} style={styles.button}>Add Mission</button>

        <label>TACHES OPERATIONNELLES</label>
        {selectedJobPosition ? selectedJobPosition.tacheOper.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={tache.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOper')} onInput={handleInputResize} placeholder="Task Name" required style={styles.input} />
            <textarea name="description" value={tache.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOper')} placeholder="Task Description" required style={styles.textarea} />
          </div>
        )) : newJobPosition.tacheOper.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={tache.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOper')} onInput={handleInputResize} placeholder="Task Name" required style={styles.input} />
            <textarea name="description" value={tache.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOper')} placeholder="Task Description" required style={styles.textarea} />
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem('tacheOper')} style={styles.button}>Add Operational Task</button>

        <label>TACHES OCCASIONNELLES</label>
        {selectedJobPosition ? selectedJobPosition.tacheOccas.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={tache.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOccas')} onInput={handleInputResize} placeholder="Task Name" required style={styles.input} />
            <textarea name="description" value={tache.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOccas')} placeholder="Task Description" required style={styles.textarea} />
          </div>
        )) : newJobPosition.tacheOccas.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={tache.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOccas')} onInput={handleInputResize} placeholder="Task Name" required style={styles.input} />
            <textarea name="description" value={tache.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOccas')} placeholder="Task Description" required style={styles.textarea} />
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem('tacheOccas')} style={styles.button}>Add Occasional Task</button>

        <label>TACHES STRATIGIQUES</label>
        {selectedJobPosition ? selectedJobPosition.tachesStrat.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={tache.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesStrat')} onInput={handleInputResize} placeholder="Task Name" required style={styles.input} />
            <textarea name="description" value={tache.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesStrat')} placeholder="Task Description" required style={styles.textarea} />
          </div>
        )) : newJobPosition.tachesStrat.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={tache.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesStrat')} onInput={handleInputResize} placeholder="Task Name" required style={styles.input} />
            <textarea name="description" value={tache.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesStrat')} placeholder="Task Description" required style={styles.textarea} />
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem('tachesStrat')} style={styles.button}>Add Strategic Task</button>

        <label>TACHES EP</label>
        {selectedJobPosition ? selectedJobPosition.tachesEP.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="titre" value={tache.titre || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesEP')} onInput={handleInputResize} placeholder="Titre" required style={styles.input} />
            <textarea name="int" value={tache.int || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesEP')} placeholder="Int Task" required style={styles.textarea} />
            <textarea name="moyOut" value={tache.moyOut || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesEP')} placeholder="Moy Out Task" required style={styles.textarea} />
          </div>
        )) : newJobPosition.tachesEP.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="titre" value={tache.titre || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesEP')} onInput={handleInputResize} placeholder="Titre" required style={styles.input} />
            <textarea name="int" value={tache.int || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesEP')} placeholder="Int Task" required style={styles.textarea} />
            <textarea name="moyOut" value={tache.moyOut || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesEP')} placeholder="Moy Out Task" required style={styles.textarea} />
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem('tachesEP')} style={styles.button}>AJOUTER TACHES </button>

        <label>KPIs QUANTITATIVES</label>
        <input type="text" name="kpiQuant" value={selectedJobPosition ? selectedJobPosition.kpiQuant : newJobPosition.kpiQuant || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Quantitative KPIs" required style={styles.input} />
        <label>KPIs QUALITATIVES</label>
        <input type="text" name="kpiQualt" value={selectedJobPosition ? selectedJobPosition.kpiQualt : newJobPosition.kpiQualt || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Qualitative KPIs" required style={styles.input} />
        <label>EVOLUTION VERTICALE</label>
        <input type="text" name="evolutionV" value={selectedJobPosition ? selectedJobPosition.evolutionV : newJobPosition.evolutionV || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Evolution Vision" required style={styles.input} />
        <label>EVOLUTION HORIZONTALE</label>
        <input type="text" name="evolutionH" value={selectedJobPosition ? selectedJobPosition.evolutionH : newJobPosition.evolutionH || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Evolution Horizon" required style={styles.input} />
        <label>LIMITES</label>
        <input type="text" name="limites" value={selectedJobPosition ? selectedJobPosition.limites : newJobPosition.limites || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Limitations" required style={styles.input} />
        <label>OBJECTIVES</label>
        {selectedJobPosition ? selectedJobPosition.objectifs.map((objectifs, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={objectifs.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'objectifs')} onInput={handleInputResize} placeholder="Objectifs Name" required style={styles.input} />
            <textarea name="description" value={objectifs.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'objectifs')} placeholder="Objectifs Description" required style={styles.textarea} />
          </div>
        )) : newJobPosition.objectifs.map((objectifs, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={objectifs.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'objectifs')} onInput={handleInputResize} placeholder="Objectifs Name" required style={styles.input} />
            <textarea name="description" value={objectifs.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'objectifs')} placeholder="Objectifs Description" required style={styles.textarea} />
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem('objectifs')} style={styles.button}>AJOUTER OBJECTIF</button>
        <label>Powers</label>
        <input type="text" name="pouvoirs" value={selectedJobPosition ? selectedJobPosition.pouvoirs : newJobPosition.pouvoirs || ''} onChange={handleInputChange} onInput={handleInputResize} placeholder="Powers" required style={styles.input} />

        {/* Required Skills */}
        <div>
          <h2>COMPETENCES REQUIS</h2>
          <div style={styles.skillsGrid}>
            {selectedJobPosition ?
              selectedJobPosition.requiredSkills.map((rs, index) => (
                <div key={index} style={styles.flexRow}>
                  <select name="skill" value={rs.skill} onChange={(e) => handleRequiredSkillChange(index, e)}>
                    {skills.map(skill => (
                      <option key={skill._id} value={skill._id}>{skill.code}</option>
                    ))}
                  </select>
                  <select name="level" value={rs.level} onChange={(e) => handleRequiredSkillChange(index, e)}>
                    {skillLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              ))
              :
              newJobPosition.requiredSkills.map((rs, index) => (
                <div key={index} style={styles.flexRow}>
                  <select name="skill" value={rs.skill} onChange={(e) => handleRequiredSkillChange2(index, e)}>
                    {skills.map(skill => (
                      <option key={skill._id} value={skill._id}>{skill.code}</option>
                    ))}
                  </select>
                  <select name="level" value={rs.level} onChange={(e) => handleRequiredSkillChange2(index, e)}>
                    {skillLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              ))
            }
          </div>
        </div>

        <button type="submit" style={styles.button}>{selectedJobPosition ? 'MàJ' : 'AJOUTER'} FICHES DE POSTE</button>
        {selectedJobPosition && (
          <button type="button" onClick={handleBackToList} style={styles.button}>REVENIR</button>
        )}
      </form>

      {/* Job Positions List */}
      <div style={styles.jobPositionsList}>
        <h2>FICHES DE POSTES</h2>
        <ul style={styles.jobPositionsUl}>
          {jobPositions.map(jobPosition => (
            <li key={jobPosition._id}>
              <span>{jobPosition.title}</span>
              <button onClick={() => handleSelectJobPosition(jobPosition)} style={styles.button}>MODIFIER</button>
              <button onClick={() => handleDeleteJobPosition(jobPosition._id)} style={styles.button}>SUPPRIMER</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  input: {
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  textarea: {
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical',
    minHeight: '40px'
  },
  flexRow: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    textAlign: 'center'
  },
  jobPositionsList: {
    marginTop: '20px'
  },
  jobPositionsUl: {
    listStyleType: 'none',
    padding: 0
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  },
};

export default ManageJobPositions;
