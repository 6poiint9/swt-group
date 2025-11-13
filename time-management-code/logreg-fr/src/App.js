import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Importiere die Komponenten
import Logreg from './comps/assets/frpg/logreg';
import myView from './comps/assets/frpg/myView'; // <--- NEU IMPORTIEREN

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Logreg />} />
        
        {/* 2. Hier die neue Komponente verknüpfen */}
        <Route path="/myView" element={<myView />} /> 
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;