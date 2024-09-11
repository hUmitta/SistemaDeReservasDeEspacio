import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Home from "./components/Home";
import ReservaGimnasio from './components/ReservaGimnasio';
import ReservaBiblioteca from './components/ReservaBiblioteca';
import ReservaSala from './components/ReservaSala';
import ReservaCubiculos from './components/ReservaCubiculos';
import CommentSection from './components/CommentSection';
import './App.css';

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'black', // default color
  '&:hover': {
    color: 'blue', // change to blue on hover
  },
  '&:active': {
    color: 'blue', // change to blue on click
  },
}));

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><StyledLink to="/">Home</StyledLink></li>
            <li><StyledLink to="/reserva-gimnasio">Reserva Gimnasio</StyledLink></li>
            <li><StyledLink to="/reserva-biblioteca">Reserva Biblioteca</StyledLink></li>
            <li><StyledLink to="/reserva-sala">Reserva Sala</StyledLink></li>
            <li><StyledLink to="/reserva-cubiculos">Reserva Cubículos</StyledLink></li>
            <li><StyledLink to="/comentarios">Comentarios</StyledLink></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reserva-gimnasio" element={<ReservaGimnasio />} />
          <Route path="/reserva-biblioteca" element={<ReservaBiblioteca />} />
          <Route path="/reserva-sala" element={<ReservaSala />} />
          <Route path="/reserva-cubiculos" element={<ReservaCubiculos />} />
          <Route path="/comentarios" element={<CommentSection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;