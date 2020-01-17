import React, { useState } from 'react';

import './styles.css'

import api from '../../services/api'

export default function DevItem({ dev, onDelete }) {

  const [id] = useState(dev._id);

  function handleDelete() {
    if (!window.confirm('Confirma a exclusão?')) return
    onDelete(id)
  }
  return (
    <li className="dev-item">
      <header>
        <img src={dev.avatar_url} alt="gitHub" />
        <div className="user-info">
          <strong>{dev.name}</strong>
          <span>{dev.techs.join(', ')}</span>
        </div>

      </header>
      <p>{dev.bio}</p>
      <div className="item-footer">
        <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
        <button className="delete" onClick={handleDelete}>Excluir</button>
      </div>
    </li>
  );
}
