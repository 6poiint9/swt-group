import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Importiere die Komponenten
import Logreg from './comps/assets/frpg/logreg';
import MyView from './comps/assets/frpg/myView';  // ✅ groß

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Logreg />} />
        
        {/* 2. Hier die neue Komponente verknüpfen */}
       <Route path="/myView" element={<MyView />} />    // ✅ groß
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;