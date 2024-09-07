import React, { useState } from 'react';
import './Home.css'; // Importar el archivo de estilos

function Home() {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(prevState => !prevState);
  };

  return (
    <div className="home-container">
      <div className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Bienvenido a la Universidad Católica</h1>
          <p className="subtitle">
            Explora y reserva los diferentes espacios que ofrece nuestra universidad.
          </p>
          <button className="btn-primary" onClick={toggleOptions}>
            {showOptions ? 'Ocultar Opciones' : 'Reserva Ahora'}
          </button>
        </div>
      </div>
      
      {showOptions && (
        <div className="info-section">
          <div className="info-card">
            <img src="/src/assets/images/gimnasio.jpg" alt="Gimnasio" />
            <h3>Reserva Gimnasio</h3>
            <p>Mantente en forma y saludable con nuestro gimnasio completamente equipado.</p>
          </div>
          <div className="info-card">
            <img src="/src/assets/images/biblioteca.jpg" alt="Biblioteca" />
            <h3>Reserva Biblioteca</h3>
            <p>Un espacio tranquilo para estudiar, investigar y aprender.</p>
          </div>
          <div className="info-card">
            <img src="/src/assets/images/salas.jpg" alt="Salas" />
            <h3>Reserva Salas</h3>
            <p>Perfecto para reuniones, charlas o actividades grupales.</p>
          </div>
          <div className="info-card">
            <img src="/src/assets/images/cubiculos.jpg" alt="Cubículos" />
            <h3>Reserva Cubículos</h3>
            <p>Espacios individuales para que te concentres en tus estudios.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
