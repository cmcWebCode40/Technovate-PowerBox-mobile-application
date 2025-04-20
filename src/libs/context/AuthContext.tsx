import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  HAS_VIEWED_WELCOME_SCREEN,
  USER_SESSION,
  deleteFromAsyncStore,
  getFromAsyncStore,
} from '../utils';
import {UserInfo} from '../types/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackScreens} from '@/navigation/type';
import { checkExpiration } from '../utils/authHelper';

type TCreateContext = {
  user?: UserInfo;
  updateUser: (data: UserInfo) => void;
  clearUser: () => void;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
};

export const AuthContext = createContext<TCreateContext>({
  clearUser: () => undefined,
  user: undefined,
  isAuthenticated: false,
  updateUser: () => undefined,
  isLoadingSession: false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<undefined | UserInfo>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackScreens>>();
  const updateUser = useCallback((data: UserInfo) => {
    setUser(data);
    setIsAuthenticated(true);
  }, []);

  const clearUser = useCallback(async () => {
    setIsAuthenticated(false);
    setUser(undefined);
    await deleteFromAsyncStore(USER_SESSION);
  }, []);


  useEffect(() => {
    (async () => {
      try {
        setIsLoadingSession(true);
        const hasTokenExpired = await checkExpiration();
        if (hasTokenExpired) {
          clearUser();
          return;
        }
        const session = await getFromAsyncStore<UserInfo>(USER_SESSION);
        if (session) {
          setUser(session);
          setIsAuthenticated(true);
        }
        const hasViewedWelcome = await getFromAsyncStore(
          HAS_VIEWED_WELCOME_SCREEN,
        );
        if (!session && !hasViewedWelcome) {
          navigation.navigate('Welcome');
          return;
        }
      } catch {
        clearUser();
      } finally {
        setIsLoadingSession(false);
      }
    })();
  }, [clearUser, navigation]);

  const authContextValues = {
    user,
    updateUser,
    clearUser,
    isLoadingSession,
    isAuthenticated,
  };
  return (
    <AuthContext.Provider value={authContextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
