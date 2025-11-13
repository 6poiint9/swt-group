import './App.css';
// 1. Importiere die Routing-Komponenten
import { Routes, Route, Navigate } from 'react-router-dom';
// 2. Importiere deine Login-Seite
import Logreg from './comps/assets/frpg/logreg'; 
// (Stelle sicher, dass dieser Pfad zu deiner logreg.jsx stimmt!)

// 3. Platzhalter-Komponente für deine Ressourcen
function Dashboard() {
  return (
    <div>
      <h1>Willkommen!</h1>
      <p>Hier sind deine geschützten Ressourcen.</p>
    </div>
  );
}

// 4. Die App-Komponente definiert nur noch die Routen
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Route 1: Die Login-Seite */}
        <Route path="/login" element={<Logreg />} />

        {/* Route 2: Die geschützte Dashboard-Seite */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Route 3: Weiterleitung von der Haupt-URL (/) zum Login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;