import React from 'react'
import './Menu.css';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { SeasonContext } from '../../context/SeasonContext';
import { toast } from 'react-toastify';
import FindYear from '../findYear/FindYear';
import { LoginContext } from '../../context/LoginContext';

const Menu = () => {

  const navigate = useNavigate();
  const { yearSeason } = useContext(SeasonContext);

  const { isLoggedIn, logout } = useContext(LoginContext);


  const handleClickEdit = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.warning('Você precisa estar logado para acessar a edição de pontos!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/login');
    }
  }

  const handleClickCreate = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.warning('Você precisa estar logado para criar algo!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/login');
    }
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://localhost:3001/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Erro ao realizar logout');
      }
      localStorage.removeItem('token');
      logout();
  
      toast.success('Logout realizado com sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  
      navigate('/login');
    }catch (error){
      toast.error('Erro ao fazer logout. Tente novamente.', {
        position: "top-right",
        autoClose: 5000,
      })
      console.error('Logout error:', error);
    }
  };
  

  return (
    <div className='menuDiv'>
        <div className='logo'>
            <img src="https://logodownload.org/wp-content/uploads/2016/11/formula-1-logo-7.png" alt="" />
            <p>{yearSeason}</p>
        </div>
        <div className='menuItens'>
            <div className='menuLink'><NavLink to="/pilots" className={({ isActive }) => isActive ? 'active' : ''}>Pilotos</NavLink></div>
            <div className='menuLink'><NavLink to="/teams" className={({ isActive }) => isActive ? 'active' : ''}>Equipes</NavLink></div>
            <div className='menuLink'><NavLink to="/races" className={({ isActive }) => isActive ? 'active' : ''}>Corridas</NavLink></div>
            <div className='menuLink'><NavLink to="/editpilots" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleClickEdit}>Pontos Pilotos</NavLink></div>
            <div className='menuLink'><NavLink to="/editteams" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleClickEdit}>Pontos Equipes</NavLink></div>
            <div className='menuLink'><NavLink to="/create" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleClickCreate}>Criar</NavLink></div>
        </div>
        
        <div className='endItens'>
          <FindYear />
          {!isLoggedIn ? (
            <div className='menuLink'><Link to="/login">Login</Link></div>
          ) : (
            <div className='menuLink'><Link to="/login" onClick={handleLogout}>Logout</Link></div>
          )}
        </div>
    </div>
  )
}

export default Menu;