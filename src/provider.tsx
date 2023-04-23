import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  IdmeshClient,
  PopupConfigOptions,
  PopupLoginOptions,
  RedirectLoginResult,
  User,
} from 'idmesh-spa-js';
import IDMeshContext, { initialAuthState } from './context';
import { IDMeshProviderOptions, LogoutOptions, RedirectLoginOptions } from './interface';
import reducer from './reducer';
import { defaultOnRedirectCallback, deprecateRedirectUri, hasAuthParams, loginError, toIDMeshClientOptions, tokenError } from './utils';

const IDMeshProvider = (opts: IDMeshProviderOptions): JSX.Element => {
  const {
    children,
    skipRedirectCallback,
    onRedirectCallback = defaultOnRedirectCallback,
    context = IDMeshContext,
    ...clientOpts
  } = opts;
  const [client] = useState(
    () => new IdmeshClient(toIDMeshClientOptions(clientOpts))
  );
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const didInitialise = useRef(false);

  useEffect(() => {
    if (didInitialise.current) {
      return;
    }
    didInitialise.current = true;
    (async (): Promise<void> => {
      try {
        let user: User | undefined;
        if (hasAuthParams() && !skipRedirectCallback) {
          const { appState } = await client.handleRedirectCallback();
          user = await client.getUser();
          onRedirectCallback(appState, user);
        } else {
          await client.checkSession();
          user = await client.getUser();
        }
        dispatch({ type: 'INITIALISED', user });
      } catch (error) {
        dispatch({ type: 'ERROR', error: loginError(error) });
      }
    })();
  }, [client, onRedirectCallback, skipRedirectCallback]);

  const loginWithRedirect = useCallback(
    (opts?: RedirectLoginOptions): Promise<void> => {
      deprecateRedirectUri(opts);

      return client.loginWithRedirect(opts);
    },
    [client]
  );

  const loginWithPopup = useCallback(
    async (
      options?: PopupLoginOptions,
      config?: PopupConfigOptions,
    ): Promise<void> => {
      dispatch({ type: 'LOGIN_POPUP_STARTED' });
      try {
        await client.loginWithPopup(options, config);
      } catch (error) {
        dispatch({ type: 'ERROR', error: loginError(error) });
        return;
      }
      const user = await client.getUser();
      dispatch({ type: 'LOGIN_POPUP_COMPLETE', user });
    },
    [client]
  );

  const logout = useCallback(
    async (opts: LogoutOptions = {}): Promise<void> => {
      await client.logout(opts);
      if (opts.openUrl || opts.openUrl === false) {
        dispatch({ type: 'LOGOUT' });
      }
    },
    [client]
  );

  const getAccessTokenSilently = useCallback(
    async (opts?: GetTokenSilentlyOptions): Promise<any> => {
      let token;
      try {
        token = await client.getTokenSilently(opts);
      } catch (error) {
        throw tokenError(error);
      } finally {
        dispatch({
          type: 'GET_ACCESS_TOKEN_COMPLETE',
          user: await client.getUser(),
        });
      }
      return token;
    },
    [client]
  );

  const getAccessTokenWithPopup = useCallback(
    async (
      opts?: GetTokenWithPopupOptions,
      config?: PopupConfigOptions
    ): Promise<string | undefined> => {
      let token;
      try {
        token = await client.getTokenWithPopup(opts, config);
      } catch (error) {
        throw tokenError(error);
      } finally {
        dispatch({
          type: 'GET_ACCESS_TOKEN_COMPLETE',
          user: await client.getUser(),
        });
      }
      return token;
    },
    [client]
  );

  const getIdTokenClaims = useCallback(
    () => client.getIdTokenClaims(),
    [client]
  );

  const handleRedirectCallback = useCallback(
    async (url?: string): Promise<RedirectLoginResult> => {
      try {
        return await client.handleRedirectCallback(url);
      } catch (error) {
        throw tokenError(error);
      } finally {
        dispatch({
          type: 'HANDLE_REDIRECT_COMPLETE',
          user: await client.getUser(),
        });
      }
    },
    [client]
  );

  const contextValue = useMemo(() => {
    return {
      ...state,
      getAccessTokenSilently,
      getAccessTokenWithPopup,
      getIdTokenClaims,
      loginWithRedirect,
      loginWithPopup,
      logout,
      handleRedirectCallback,
    };
  }, [
    state,
    getAccessTokenSilently,
    getAccessTokenWithPopup,
    getIdTokenClaims,
    loginWithRedirect,
    loginWithPopup,
    logout,
    handleRedirectCallback,
  ]);

  return <context.Provider value={contextValue}>{children}</context.Provider>;
};

export default IDMeshProvider;
