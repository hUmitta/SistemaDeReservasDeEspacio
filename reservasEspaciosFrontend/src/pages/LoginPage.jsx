import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';

function LoginPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (user) {
      navigate('/home');
    } else {
      alert('Por favor selecciona un tipo de usuario.');
    }
  };
  const handleRegister = () => {
    if (user) {
      navigate('/registro');
    } else {
      alert('Por favor selecciona un tipo de usuario.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {user ? (
        <div>
          <p>Iniciar sesión como {user.tipoUsuario}</p>
          <button onClick={handleLogin}>Iniciar sesión</button>
          <p>No tienes cuenta? <button onClick={handleRegister}>Regístrate</button></p>
        </div>
      ) : (
        <p>Selecciona un tipo de usuario primero.</p>
      )}
    </div>
  );
}

export default LoginPage;
