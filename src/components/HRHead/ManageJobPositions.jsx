import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const skillLevels = ['N/A','N', 'A', 'M', 'E'];

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
    tachesEP: [{titre :'', int: '', moyOut: '' }],
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
        tachesEP: [{titre:'', int: '', moyOut: '' }],
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

  const handleUpdateJobPosition = async (e) => {
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
    const requiredSkillsCopy = [...selectedJobPosition.requiredSkills] ;
    requiredSkillsCopy[index][name] = value;
   
    setSelectedJobPosition({ ...selectedJobPosition, requiredSkills: requiredSkillsCopy });
    
  };

  const handleRequiredSkillChange2 = (index, e) => {
    const { name, value } = e.target;
    const requiredSkillsCopy =  [...newJobPosition.requiredSkills];
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
      tachesEP: jobPosition.tachesEP || [{ titre:'',int: '', moyOut: '' }],
      objectifs: jobPosition.objectifs || [{ name: '', description: '' }],
      requiredSkills: initializeRequiredSkills(jobPosition.requiredSkills)
    };
    setSelectedJobPosition(initializedJobPosition);
  };

  const handleBackToList = () => {
    setSelectedJobPosition(null);
  };

  const handleAddArrayItem = (arrayName) => {
    const newItem = arrayName === 'tachesEP' ? {titre:'', int: '', moyOut: '' } : { name: '', description: '' };
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

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Manage Job Positions</h1>
      <form onSubmit={selectedJobPosition ? handleUpdateJobPosition : handleAddJobPosition} style={styles.form}>
        <label>Title</label>
        <input type="text" name="title" value={selectedJobPosition ? selectedJobPosition.title : newJobPosition.title || ''} onChange={handleInputChange} placeholder="Title" required style={styles.input} />
        <label>Reference</label>
        <input type="text" name="ref" value={selectedJobPosition ? selectedJobPosition.ref : newJobPosition.ref || ''} onChange={handleInputChange} placeholder="Reference" required style={styles.input} />
        <label>Service</label>
        <input type="text" name="service" value={selectedJobPosition ? selectedJobPosition.service : newJobPosition.service || ''} onChange={handleInputChange} placeholder="Service" required style={styles.input} />
        <label>Location</label>
        <input type="text" name="lieu" value={selectedJobPosition ? selectedJobPosition.lieu : newJobPosition.lieu || ''} onChange={handleInputChange} placeholder="Location" required style={styles.input} />
        <label>Interim</label>
        <input type="text" name="interimaire" value={selectedJobPosition ? selectedJobPosition.interimaire : newJobPosition.interimaire || ''} onChange={handleInputChange} placeholder="Interim" required style={styles.input} />
        <label>Hierarchical Connections</label>
        <input type="text" name="liaisonsHiera" value={selectedJobPosition ? selectedJobPosition.liaisonsHiera : newJobPosition.liaisonsHiera || ''} onChange={handleInputChange} placeholder="Hierarchical Connections" required style={styles.input} />
        <label>Functional Connections</label>
        <input type="text" name="liaisonsFonc" value={selectedJobPosition ? selectedJobPosition.liaisonsFonc : newJobPosition.liaisonsFonc || ''} onChange={handleInputChange} placeholder="Functional Connections" required style={styles.input} />
        <label>Reason</label>
        <input type="text" name="raison" value={selectedJobPosition ? selectedJobPosition.raison : newJobPosition.raison || ''} onChange={handleInputChange} placeholder="Reason" required style={styles.input} />

        <label>Mission</label>
        {selectedJobPosition ? selectedJobPosition.mission.map((mission, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={mission.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'mission')} placeholder="Mission Name" required style={styles.input} />
            <input type="text" name="description" value={mission.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'mission')} placeholder="Mission Description" required style={styles.input} />
          </div>
        )) : newJobPosition.mission.map((mission, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={mission.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'mission')} placeholder="Mission Name" required style={styles.input} />
            <input type="text" name="description" value={mission.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'mission')} placeholder="Mission Description" required style={styles.input} />
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem('mission')} style={styles.button}>Add Mission</button>

        <label>Operational Tasks</label>
        {selectedJobPosition ? selectedJobPosition.tacheOper.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={tache.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOper')} placeholder="Task Name" required style={styles.input} />
            <input type="text" name="description" value={tache.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOper')} placeholder="Task Description" required style={styles.input} />
          </div>
        )) : newJobPosition.tacheOper.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={tache.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOper')} placeholder="Task Name" required style={styles.input} />
            <input type="text" name="description" value={tache.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOper')} placeholder="Task Description" required style={styles.input} />
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem('tacheOper')} style={styles.button}>Add Operational Task</button>

        <label>Occasional Tasks</label>
        {selectedJobPosition ? selectedJobPosition.tacheOccas.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={tache.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOccas')} placeholder="Task Name" required style={styles.input} />
            <input type="text" name="description" value={tache.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOccas')} placeholder="Task Description" required style={styles.input} />
          </div>
        )) : newJobPosition.tacheOccas.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={tache.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOccas')} placeholder="Task Name" required style={styles.input} />
            <input type="text" name="description" value={tache.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'tacheOccas')} placeholder="Task Description" required style={styles.input} />
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem('tacheOccas')} style={styles.button}>Add Occasional Task</button>

        <label>Strategic Tasks</label>
        {selectedJobPosition ? selectedJobPosition.tachesStrat.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={tache.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesStrat')} placeholder="Task Name" required style={styles.input} />
            <input type="text" name="description" value={tache.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesStrat')} placeholder="Task Description" required style={styles.input} />
          </div>
        )) : newJobPosition.tachesStrat.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={tache.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesStrat')} placeholder="Task Name" required style={styles.input} />
            <input type="text" name="description" value={tache.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesStrat')} placeholder="Task Description" required style={styles.input} />
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem('tachesStrat')} style={styles.button}>Add Strategic Task</button>

        <label>EP Tasks</label>
        {selectedJobPosition ? selectedJobPosition.tachesEP.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="titre" value={tache.titre || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesEP')} placeholder="Titre" required style={styles.input} />
            <input type="text" name="int" value={tache.int || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesEP')} placeholder="Int Task" required style={styles.input} />
            <input type="text" name="moyOut" value={tache.moyOut || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesEP')} placeholder="Moy Out Task" required style={styles.input} />
          </div>
        )) : newJobPosition.tachesEP.map((tache, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="titre" value={tache.titre || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesEP')} placeholder="Titre" required style={styles.input} />
            <input type="text" name="int" value={tache.int || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesEP')} placeholder="Int Task" required style={styles.input} />
            <input type="text" name="moyOut" value={tache.moyOut || ''} onChange={(e) => handleArrayInputChange(index, e, 'tachesEP')} placeholder="Moy Out Task" required style={styles.input} />
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem('tachesEP')} style={styles.button}>Add EP Task</button>

        <label>Quantitative KPIs</label>
        <input type="text" name="kpiQuant" value={selectedJobPosition ? selectedJobPosition.kpiQuant : newJobPosition.kpiQuant || ''} onChange={handleInputChange} placeholder="Quantitative KPIs" required style={styles.input} />
        <label>Qualitative KPIs</label>
        <input type="text" name="kpiQualt" value={selectedJobPosition ? selectedJobPosition.kpiQualt : newJobPosition.kpiQualt || ''} onChange={handleInputChange} placeholder="Qualitative KPIs" required style={styles.input} />
        <label>Evolution Vision</label>
        <input type="text" name="evolutionV" value={selectedJobPosition ? selectedJobPosition.evolutionV : newJobPosition.evolutionV || ''} onChange={handleInputChange} placeholder="Evolution Vision" required style={styles.input} />
        <label>Evolution Horizon</label>
        <input type="text" name="evolutionH" value={selectedJobPosition ? selectedJobPosition.evolutionH : newJobPosition.evolutionH || ''} onChange={handleInputChange} placeholder="Evolution Horizon" required style={styles.input} />
        <label>Limitations</label>
        <input type="text" name="limites" value={selectedJobPosition ? selectedJobPosition.limites : newJobPosition.limites || ''} onChange={handleInputChange} placeholder="Limitations" required style={styles.input} />
        <label>Objectives</label>
        {selectedJobPosition ? selectedJobPosition.objectifs.map((objectifs, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={objectifs.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'objectifs')} placeholder="Objectifs Name" required style={styles.input} />
            <input type="text" name="description" value={objectifs.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'objectifs')} placeholder="Objectifs Description" required style={styles.input} />
          </div>
        )) : newJobPosition.objectifs.map((objectifs, index) => (
          <div key={index} style={styles.flexRow}>
            <input type="text" name="name" value={objectifs.name || ''} onChange={(e) => handleArrayInputChange(index, e, 'objectifs')} placeholder="Objectifs Name" required style={styles.input} />
            <input type="text" name="description" value={objectifs.description || ''} onChange={(e) => handleArrayInputChange(index, e, 'objectifs')} placeholder="Objectifs Description" required style={styles.input} />
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem('objectifs')} style={styles.button}>Add Objectif</button>
        <label>Powers</label>
        <input type="text" name="pouvoirs" value={selectedJobPosition ? selectedJobPosition.pouvoirs : newJobPosition.pouvoirs || ''} onChange={handleInputChange} placeholder="Powers" required style={styles.input} />

        {/* Required Skills */}
        <div>
          <h2>Required Skills</h2>
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

        <button type="submit" style={styles.button}>{selectedJobPosition ? 'Update' : 'Add'} Job Position</button>
        {selectedJobPosition && (
          <button type="button" onClick={handleBackToList} style={styles.button}>Back to List</button>
        )}
      </form>

      {/* Job Positions List */}
      <div style={styles.jobPositionsList}>
        <h2>Job Positions</h2>
        <ul style={styles.jobPositionsUl}>
          {jobPositions.map(jobPosition => (
            <li key={jobPosition._id}>
              <span>{jobPosition.title}</span>
              <button onClick={() => handleSelectJobPosition(jobPosition)} style={styles.button}>Edit</button>
              <button onClick={() => handleDeleteJobPosition(jobPosition._id)} style={styles.button}>Delete</button>
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
    width: '100%',  // Updated to 100% width
    padding: '12px',  // Increased padding
    fontSize: '16px',  // Increased font size
    border: '1px solid #ddd',
    borderRadius: '4px'
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
