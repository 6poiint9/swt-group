import React, { useState } from 'react';
// 1. WICHTIG: Importiere den useNavigate-Hook
import { useNavigate } from 'react-router-dom'; 
import './logreg.css';

import user_icon from '../Icons/user_icon.png';
import pass_icon from '../Icons/pass_icon.png';
// (Stelle sicher, dass diese Pfade stimmen!)

const Logreg = () => {
  // 2. Initialisiere den Hook
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');
  const [isError, setIsError] = useState(false);

  const handleLogin = async () => {
    setNotification('');
    setIsError(false);

    try {
      const url = 'http://localhost:3001/api/authenticateUser/login';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setNotification('Login erfolgreich!');
        setIsError(false);
        localStorage.setItem('token', data.token);

        // 3. HIER ist die Weiterleitung!
        // Wir warten 1 Sekunde, damit der User die Erfolgs-Nachricht sieht
        setTimeout(() => {
          navigate('/myView'); 
        }, 1000); // 1000ms = 1 Sekunde

      } else {
        setNotification(`Login fehlgeschlagen: ${data.message}`);
        setIsError(true);
        setPassword('');
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error);
      setNotification('Netzwerkfehler beim Login.');
      setIsError(true);
      setPassword('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    handleLogin();
  };

  // Dein JSX-Return-Block bleibt genau gleich
  return (
    <div className="container">
      
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>

      {notification && (
        <div className={isError ? 'notify-error' : 'notify-success'}>
          {notification}
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="Username" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          
          <div className="input">
            <img src={pass_icon} alt="Passwort" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
        </div>
        
        <div className="submit-container">
          <button type="submit" className="submit">
            Login
          </button>
        </div>
        
      </form>

    </div>
  );
};

export default Logreg;