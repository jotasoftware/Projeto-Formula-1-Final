import React, { useState, useContext } from 'react';
import './FormCreateTeam.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SeasonContext } from '../../context/SeasonContext';

const FormCreateTeam = () => {
  const [nome, setNome] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [vitorias, setVitorias] = useState('');
  const [pontos, setPontos] = useState('');

  const { yearSeason } = useContext(SeasonContext);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    const novaEquipe = {
      nome,
      nacionalidade,
      vitorias: Number(vitorias),
      pontos: parseFloat(pontos),
      temporada: yearSeason
    };

    try {
      const token = localStorage.getItem('token');
      const resposta = await fetch('https://localhost:3001/equipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify(novaEquipe)
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        toast.error(data.message || 'Erro ao criar equipe');
        return;
      }

      toast.success('Equipe criada com sucesso!');
      navigate('/teams');
    } catch (err) {
      toast.error('Erro ao criar equipe: ' + err.message);
    }
  };

  return (
    <div className='formDiv'>
      <form onSubmit={handleCreate} className="divForm">
        <input
          type="text"
          placeholder="Nome da Equipe"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nacionalidade"
          value={nacionalidade}
          onChange={(e) => setNacionalidade(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Vitórias"
          value={vitorias}
          onChange={(e) => setVitorias(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Pontos"
          step="0.1"
          value={pontos}
          onChange={(e) => setPontos(e.target.value)}
          required
        />
        <button type="submit">Criar Equipe</button>
      </form>
    </div>
  );
};

export default FormCreateTeam;
