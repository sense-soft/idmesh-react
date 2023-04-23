import {
  GetTokenSilentlyOptions,
  GetTokenSilentlyVerboseResponse,
  GetTokenWithPopupOptions,
  IdToken,
  LogoutOptions as SPALogoutOptions,
  PopupConfigOptions,
  PopupLoginOptions,
  RedirectLoginOptions as SPARedirectLoginOptions,
  RedirectLoginResult,
  User,
} from 'idmesh-spa-js';
import { AppState } from './app-state';
import { AuthState } from './auth-state';

export interface RedirectLoginOptions<TAppState = AppState> extends Omit<SPARedirectLoginOptions<TAppState>, 'onRedirect'> {}

export interface LogoutOptions extends Omit<SPALogoutOptions, 'onRedirect'> {}


export interface IDMeshContextInterface<TUser extends User = User> extends AuthState<TUser> {
  getAccessTokenSilently: {
    (
      options: GetTokenSilentlyOptions & { detailedResponse: true }
    ): Promise<GetTokenSilentlyVerboseResponse>;
    (options?: GetTokenSilentlyOptions): Promise<string>;
    (options: GetTokenSilentlyOptions): Promise<
      GetTokenSilentlyVerboseResponse | string
    >;
  };
  getAccessTokenWithPopup: (
    options?: GetTokenWithPopupOptions,
    config?: PopupConfigOptions
  ) => Promise<string | undefined>;
  getIdTokenClaims: () => Promise<IdToken | undefined>;
  loginWithRedirect: (
    options?: RedirectLoginOptions<AppState>
  ) => Promise<void>;
  loginWithPopup: (
    options?: PopupLoginOptions,
    config?: PopupConfigOptions
  ) => Promise<void>;
  logout: (options?: LogoutOptions) => void;
  handleRedirectCallback: (url?: string) => Promise<RedirectLoginResult>;
}
