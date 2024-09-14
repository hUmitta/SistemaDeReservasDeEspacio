import { useContext } from 'react';
import { UserContext } from '../userContext';

function Home() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <h1>Bienvenido, {user.tipoUsuario}</h1>

      {/*COMUN ENTRE USUARIOS*/}
      <p>ESTA ES LA PAGINA PRINCIPAL, LAS OPCIONES DEPENDEN DEL ROL DE USUARIO.</p>

      {/*PARA ESTUDIANTES*/}
      {user.tipoUsuario === 'estudiante' && (
        <div>
          <h2>Reservas disponibles para estudiantes:</h2>
          <ul>
            <li>Reservar cubículos</li>
            <li>Reservar gimnasio</li>
            <li>Reservar espacio en la biblioteca</li>
          </ul>
        </div>
      )}

      {/*PARA DOCENTES (TEMPORAL)*/}
      {user.tipoUsuario === 'docente' && (
        <div>
          <h2>Reservas disponibles para docentes:</h2>
          <ul>
            <li>Reservar cubículos</li>
            <li>Reservar gimnasio</li>
            <li>Reservar espacio en la biblioteca</li>
            <li>Reservar salas</li> {/*LA SALA ES EXCLUSIVA DE LOS DOCENTES*/}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
