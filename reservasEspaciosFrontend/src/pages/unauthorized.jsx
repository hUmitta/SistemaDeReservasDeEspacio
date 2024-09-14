import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div>
      <h1>Acceso Denegado</h1>
      <p>No tienes los permisos para acceder a esta página.</p>
      <Link to="/">Regresar al inicio</Link>
    </div>
  );
}

export default Unauthorized;
