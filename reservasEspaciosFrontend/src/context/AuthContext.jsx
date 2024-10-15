import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export const AuthContext = createContext({
  user: null,
  loginWithGoogle: async () => {},
  loginGeneric: async () => {},
  registerUser: async () => {},
  logout: async () => {},
  getUserReservations: async () => {}, // Añadir la función aquí
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          avatar: session.user.user_metadata.avatar_url,
          name: session.user.user_metadata.name,
        });
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          avatar: session.user.user_metadata.avatar_url,
          name: session.user.user_metadata.name,
        });
      } else {
        setUser(null);
      }
    });

    checkUserSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
      if (error) throw new Error("Error al hacer login con Google");
    } catch (error) {
      console.error(error);
    }
  };

  const loginGeneric = async (userEmail, userPassword) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword
      });

      if (error) {
        console.error("Error con el login generico:", error.message);
        return null;
      }

      if (!data || !data.user) {
        alert("Usuario no encontrado. Verifica las credenciales.");
        return null;
      }

      setUser({
        id: data.user.id,
        email: data.user.email,
        avatar: data.user.user_metadata?.avatar_url,
        name: data.user.email.split('@')[0],
      });

      return data.user;

    } catch (error) {
      console.error("Error al iniciar el login generico:", error);
      return null; 
    }
  };

  const registerUser = async (email, password) => {
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      
      if (signUpError) {
        console.log("Error al registrar usuario: ", signUpError.message);
        return null;
      }

      if (!data || !data.user) {
        console.log("Usuario no registrado correctamente. Verifica la respuesta.");
        return null;
      }

      setUser({
        id: data.user.id,
        email: data.user.email,
        avatar: data.user.user_metadata?.avatar_url,
        name: email.split('@')[0]
      });

      return data.user;

    } catch (error) {
      console.error("Error general al registrarse:", error);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Nueva función para obtener reservas del usuario
  const getUserReservations = async () => {
    if (!user) return []; // Si no hay usuario, retorna un array vacío

    const userId = user.id; // Obtén el ID del usuario desde el contexto
    const { data: reservations, error } = await supabase
      .from('reservas')
      .select(`
        id,
        horario_id,
        horarios (
          fecha,
          hora_inicio,
          hora_fin,
          recurso_id
        )
      `)
      .eq('usuario_id', userId);

    if (error) {
      console.error('Error al obtener reservas:', error);
      return [];
    }

    return reservations.map(reservation => ({
      id: reservation.id,
      recurso_id: reservation.horarios.recurso_id,
      fecha: reservation.horarios.fecha,
      hora_inicio: reservation.horarios.hora_inicio,
      hora_fin: reservation.horarios.hora_fin,
    }));
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, loginGeneric, registerUser, logout, getUserReservations }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
