import { User } from 'idmesh-spa-js';

export interface AuthState<TUser extends User = User> {
  error?: Error;
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: TUser;
}
