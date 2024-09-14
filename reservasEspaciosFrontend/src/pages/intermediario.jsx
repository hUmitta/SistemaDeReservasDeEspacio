import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';

function Intermediario() {
  const { updateUser,  } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSelection = (tipoUsuario) => {
    updateUser({ tipoUsuario}); 
    navigate('/login'); 
  };

  return (
    <div>
      <h1>¿Cómo deseas ingresar?</h1>
      <button onClick={() => handleSelection('estudiante')}>Ingresar como Estudiante</button>
      <button onClick={() => handleSelection('docente')}>Ingresar como Docente</button>
    </div>
  );
}

export default Intermediario;
