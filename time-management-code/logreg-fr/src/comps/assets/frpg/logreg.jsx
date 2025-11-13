import React, { useState } from 'react';
import './logreg.css';

import user_icon from '../Icons/user_icon.png';
import pass_icon from '../Icons/pass_icon.png';

const Logreg = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // F1: State für die Benachrichtigung auf der Seite
  const [notification, setNotification] = useState('');
  const [isError, setIsError] = useState(false);

  // handleLogin bleibt die Kern-API-Logik
  const handleLogin = async () => {
    // F1: Benachrichtigung beim Start zurücksetzen
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
        // F1: Erfolgs-Benachrichtigung setzen (statt alert)
        setNotification('Login erfolgreich!');
        setIsError(false);
        localStorage.setItem('token', data.token);
      } else {
        // F1: Fehler-Benachrichtigung setzen (statt alert)
        setNotification(`Login fehlgeschlagen: ${data.message}`);
        setIsError(true);
        // F2: Passwortfeld bei Fehler leeren
        setPassword('');
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error);
      // F1: Netzwerkfehler-Benachrichtigung setzen (statt alert)
      setNotification('Netzwerkfehler beim Login.');
      setIsError(true);
      // F2: Passwortfeld bei Fehler leeren
      setPassword('');
    }
  };

  // F3: Neue handleSubmit-Funktion für das <form>-Element
  // Diese fängt den "Enter"-Klick ab und verhindert das Neuladen der Seite
  const handleSubmit = (event) => {
    event.preventDefault(); // Verhindert das Standard-HTML-Formular-Neuladen
    handleLogin(); // Führt unsere Login-Logik aus
  };

  return (
    <div className="container">
      
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>

      {/* F1: Hier wird die Benachrichtigung angezeigt */}
      {notification && (
        <div className={isError ? 'notify-error' : 'notify-success'}>
          {notification}
        </div>
      )}

      {/* F3: Wir nutzen ein <form>-Element mit onSubmit */}
      <form onSubmit={handleSubmit} className="login-form">
        
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="Username" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required // Gute Praxis: Felder als erforderlich markieren
            />
          </div>
          
          <div className="input">
            <img src={pass_icon} alt="Passwort" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required // Gute Praxis
            />
          </div>
        </div>
        
        <div className="submit-container">
          {/* F3: Der Button ist jetzt type="submit", 
              dadurch löst er das <form> onSubmit aus (per Klick ODER Enter) */}
          <button type="submit" className="submit">
            Login
          </button>
        </div>
        
      </form> {/* F3: Ende des Formulars */}

    </div>
  );
};

export default Logreg;