// AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface AuthState {
  isAuthenticate: boolean;
  // Otros campos de estado si los tienes
}

interface AuthContextType {
  authState: AuthState;
  dispatch: ReturnType<typeof useDispatch>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC = ({ children }: any) => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth); // Accede al estado del slice

  // Verifica si el usuario está autenticado y realiza alguna acción si es necesario
  useEffect(() => {
    if (authState.isAuthenticate) {
      // El usuario está autenticado, realiza acciones aquí si es necesario
    } else {
      // El usuario no está autenticado, realiza acciones aquí si es necesario
    }
  }, [authState.isAuthenticate]);

  return (
    <AuthContext.Provider value={{ authState, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
