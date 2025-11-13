import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyView = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(''); // Hier speichern wir Daten vom Server

  useEffect(() => {
    // 1. Prüfen: Ist der User überhaupt eingeloggt?
    const token = localStorage.getItem('token');

    if (!token) {
      // Kein Token? Sofort zurück zum Login!
      console.log("Kein Token gefunden, leite um...");
      navigate('/login');
      return;
    }

    // 2. Wenn Token da ist: Daten vom Server holen (geschützte Route)
    // (Hier nutzen wir deinen 'myView' Endpunkt als Beispiel)
    fetch('http://localhost:3001/api/myView', { // Pfad ggf. anpassen
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // WICHTIG: Token mitsenden!
      }
    })
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        // Token ungültig/abgelaufen? -> Rauswerfen
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error("Nicht autorisiert");
      }
      return res.json();
    })
    .then(data => {
      // Daten erfolgreich geladen
      setContent(JSON.stringify(data)); // Oder data.message, je nach Server-Antwort
    })
    .catch(err => console.error("Fehler beim Laden:", err));

  }, [navigate]); // Wird ausgeführt, sobald die Komponente "betreten" wird

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <h1>Willkommen im internen Bereich!</h1>
      <p>Du bist erfolgreich eingeloggt.</p>
      
      <div className="content-box" style={{ background: '#eee', padding: '10px', marginTop: '20px'}}>
        <h3>Deine Daten vom Server:</h3>
        <pre>{content ? content : "Lade Daten..."}</pre>
      </div>

      <button 
        onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}
        style={{ marginTop: '20px', padding: '10px 20px', background: 'red', color: 'white', border: 'none', cursor: 'pointer'}}
      >
        Logout
      </button>
    </div>
  );
};

export default MyView;