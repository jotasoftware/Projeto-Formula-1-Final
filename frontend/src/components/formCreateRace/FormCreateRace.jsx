import React, { useState } from 'react';
import './FormCreateRace.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const FormCreateRace = () => {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [circuito, setCircuito] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    const novaCorrida = {
      nome,
      data,
      circuito,
      latitude,
      longitude
    };

    try {
      const token = localStorage.getItem('token');
      const resposta = await fetch('https://localhost:3001/circuitos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(novaCorrida)
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        toast.error(data.message || 'Erro ao criar corrida');
        return;
      }

      toast.success('Corrida criada com sucesso!');
      navigate('/races');
    } catch (err) {
      toast.error('Erro ao criar corrida: ' + err.message);
    }
  };

  return (
    <div className='formDiv'>
      <form onSubmit={handleCreate} className="divForm">
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input type="date" placeholder="Data" value={data} onChange={(e) => setData(e.target.value)} required />
        <input type="text" placeholder="Circuito" value={circuito} onChange={(e) => setCircuito(e.target.value)} required />
        <input type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
        <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
        <button type="submit">Criar Corrida</button>
      </form>
    </div>
  );
};

export default FormCreateRace;
