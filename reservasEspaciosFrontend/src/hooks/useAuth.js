import { useContext } from 'react';
import { UserContext } from '../userContext';

export function useAuth() {
  const { user } = useContext(UserContext);
  return {
    isAuthenticated: !!user, 
  };
}
