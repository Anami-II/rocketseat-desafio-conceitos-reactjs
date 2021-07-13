import React, { useEffect, useState } from "react";
import api from "./services/api";

import "./styles.css";

function App() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('repositories').then(({ data }) => {
      setProjects(data);
    });
  }, []);

  async function handleAddRepository() {
    const { data: project } = await api.post('repositories', {
      title: `Repositório ${new Date()}`,
      owner: 'Eduardo Anami'
    });

    const newProjects = [...projects, project];

    setProjects(newProjects);
  }

  async function handleRemoveRepository(id) {
    try {
      const response = await api.delete(`repositories/${id}`);

      if (response.status !== 204) {
        throw new Error('Não foi possível exluir o projeto.');
      }

      const newProjects = [...projects];

      const projectIndex = newProjects
        .findIndex(project => project.id === id);

      newProjects.splice(projectIndex, 1);

      setProjects(newProjects);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">

        {
          projects.map(repository => (
            <li key={repository.id}>
              { repository.title}

              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>
          ))
        }

      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
