export const ROLES = {
    ESTUDIANTE: 'estudiante',
    DOCENTE: 'docente',
    ADMINISTRATIVO: 'administrativo'
  };
  
  export const AuthService = {
    currentUser: null,
  
    login: async (tipoUsuario) => {
      AuthService.currentUser = { tipoUsuario, email: 'user@example.com' };
      localStorage.setItem('user', JSON.stringify(AuthService.currentUser));
    },
  
    logout: async () => {
      AuthService.currentUser = null;
      localStorage.removeItem('user');
    },
  
    getCurrentUser: () => {
      if (!AuthService.currentUser) {
        const storedUser = localStorage.getItem('user');
        AuthService.currentUser = storedUser ? JSON.parse(storedUser) : null;
      }
      return AuthService.currentUser;
    },
  
    isAuthenticated: () => !!AuthService.getCurrentUser(),
  
    getUserRole: () => {
      const user = AuthService.getCurrentUser();
      return user ? user.tipoUsuario : null;
    }
  };
  