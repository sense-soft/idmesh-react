import { createContext } from 'react';
import { AuthState, IDMeshContextInterface } from './interface';

const stub = (funcName: string) => {
  return (): never => {
    throw new Error(`${funcName} not implemented`);
  };
};

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
};

export const initialContext = {
  ...initialAuthState,
  buildAuthorizeUrl: stub('buildAuthorizeUrl'),
  buildLogoutUrl: stub('buildLogoutUrl'),
  getAccessTokenSilently: stub('getAccessTokenSilently'),
  getAccessTokenWithPopup: stub('getAccessTokenWithPopup'),
  getIdTokenClaims: stub('getIdTokenClaims'),
  loginWithRedirect: stub('loginWithRedirect'),
  loginWithPopup: stub('loginWithPopup'),
  logout: stub('logout'),
  handleRedirectCallback: stub('handleRedirectCallback'),
};

const IDMeshContext = createContext<IDMeshContextInterface>(initialContext);

export default IDMeshContext;
