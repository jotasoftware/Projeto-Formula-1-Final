import React, { useState, useContext } from 'react';
import './FormCreateDriver.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SeasonContext } from '../../context/SeasonContext';

const FormCreateDriver = () => {
  const [nome, setNome] = useState('');
  const [numero, setNumero] = useState('');
  const [vitorias, setVitorias] = useState('');
  const [equipe, setEquipe] = useState('');
  const [pontos, setPontos] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [link, setLink] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');

  const { yearSeason } = useContext(SeasonContext);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    const novoPiloto = {
      nome,
      numero: Number(numero),
      vitorias: Number(vitorias),
      equipe,
      pontos: parseFloat(pontos),
      nascimento,
      link,
      temporada: yearSeason,
      nacionalidade
    }

    console.log(novoPiloto)

    try {
      const token = localStorage.getItem('token');
      const resposta = await fetch('https://localhost:3001/pilotos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(novoPiloto)
      })

      const data = await resposta.json();

      if (!resposta.ok) {
        toast.error(data.message || 'Erro ao criar piloto');
        return;
      }

      toast.success('Piloto criado com sucesso!');
      navigate('/pilots');
    }catch (err){
      toast.error('Erro ao criar piloto: ' + err.message);
    }
  };

  return (
    <div className='formDiv'>
      <form onSubmit={handleCreate} className="divForm">
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input type="number" placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} required />
        <input type="text" placeholder="Nacionalidade" value={nacionalidade} onChange={(e) => setNacionalidade(e.target.value)} required />
        <input type="date" placeholder="Nascimento" value={nascimento} onChange={(e) => setNascimento(e.target.value)} required />
        <input type="number" placeholder="Vitórias" value={vitorias} onChange={(e) => setVitorias(e.target.value)} />
        <input type="text" placeholder="Equipe" value={equipe} onChange={(e) => setEquipe(e.target.value)} required />
        <input type="number" placeholder="Pontos" step="0.1" value={pontos} onChange={(e) => setPontos(e.target.value)} required />
        <input type="url" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />
        <button type="submit">Criar Piloto</button>
      </form>
    </div>
  );
};

export default FormCreateDriver;
