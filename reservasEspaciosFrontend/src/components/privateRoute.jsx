import { useContext, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../userContext';
import PropTypes from 'prop-types';

function PrivateRoute({ children, role }) {
  const { user } = useContext(UserContext);

  const isAuthorized = useMemo(() => {
    if (!user) return false;
    if (role && user.tipoUsuario !== role) return false;
    return true;
  }, [user, role]);

  if (!isAuthorized) {
    return <Navigate to={user ? "/unauthorized" : "/"} />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};

export default PrivateRoute;
