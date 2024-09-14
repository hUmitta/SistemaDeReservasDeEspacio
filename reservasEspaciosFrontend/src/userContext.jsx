import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthService, ROLES } from './firebase/authService.js';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setMenu(true)
    }
  }, []);

  const login = async (tipoUsuario) => {
    await AuthService.login(tipoUsuario);
    setUser(AuthService.getCurrentUser());
    setMenu(false)
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    setMenu(false);
  };

  


  const updateUser = (newUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserData,
    }));
  };

  return (
    <UserContext.Provider value={{ user, menu, login, logout, updateUser, ROLES }}>
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
