import React, { useState, useContext } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContext';
import { toast } from 'react-toastify';

const Login = () => {

  const { login } = useContext(LoginContext);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch('https://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        toast.error(data.message || 'Erro ao fazer login');
        return;
      }

      login(data.token);
      localStorage.setItem('token', data.token);
      navigate('/pilots');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className='loginDiv'>
      <form onSubmit={handleLogin} className="loginForm">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
