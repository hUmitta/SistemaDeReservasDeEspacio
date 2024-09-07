import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import ReservaGimnasio from './components/ReservaGimnasio';
import ReservaBiblioteca from './components/ReservaBiblioteca';
import ReservaSala from './components/ReservaSala';
import ReservaCubiculos from './components/ReservaCubiculos';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/reserva-gimnasio">Reserva Gimnasio</Link></li>
            <li><Link to="/reserva-biblioteca">Reserva Biblioteca</Link></li>
            <li><Link to="/reserva-sala">Reserva Sala</Link></li>
            <li><Link to="/reserva-cubiculos">Reserva Cubículos</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reserva-gimnasio" element={<ReservaGimnasio />} />
          <Route path="/reserva-biblioteca" element={<ReservaBiblioteca />} />
          <Route path="/reserva-sala" element={<ReservaSala />} />
          <Route path="/reserva-cubiculos" element={<ReservaCubiculos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
