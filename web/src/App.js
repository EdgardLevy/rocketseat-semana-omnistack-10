import React, { useState, useEffect } from 'react';
import api from './services/api'
import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevItem from './componentes/DevItem';
import DevForm from './componentes/DevForm';

function App() {

  const [devs, setDevs] = useState([])

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('devs');
      setDevs(response.data)
    }
    loadDevs()
  }, [])

  async function handleAddDev(data) {

    const response = await api.post('devs', data)

    setDevs([...devs,response.data])
  }

  async function handleDelete(id){
    await api.delete(`dev/${id}`)
    let idx = devs.findIndex(item=>item._id === id)
    if (idx > -1){
      let _devs = [...devs];
      _devs.splice(idx,1)
      setDevs(_devs)
    }
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev}/>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem
              key={dev._id}
              dev={dev}
              onDelete={handleDelete}/>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
