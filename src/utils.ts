import { Version } from './consts';
import { AppState, IDMeshProviderOptions } from './interface';

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;

export const hasAuthParams = (searchParams = window.location.search): boolean =>
  (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) &&
  STATE_RE.test(searchParams);

export const deprecateRedirectUri = (options?: any) => {
  if (options?.redirectUri) {
    console.warn(
      'Using `redirectUri` has been deprecated, please use `authorizationParams.redirect_uri` instead as `redirectUri` will be no longer supported in a future version'
    );
    options.authorizationParams = options.authorizationParams || {};
    options.authorizationParams.redirect_uri = options.redirectUri;
    delete options.redirectUri;
  }

  if (options?.authorizationParams?.redirectUri) {
    console.warn(
      'Using `authorizationParams.redirectUri` has been deprecated, please use `authorizationParams.redirect_uri` instead as `authorizationParams.redirectUri` will be removed in a future version'
    );
    options.authorizationParams.redirect_uri =
      options.authorizationParams.redirectUri;
    delete options.authorizationParams.redirectUri;
  }
};

export const defaultOnRedirectCallback = (appState?: AppState): void => {
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

export class OAuthError extends Error {
  constructor(public error: string, public error_description?: string) {
    super(error_description || error);
    Object.setPrototypeOf(this, OAuthError.prototype);
  }
}

export const toIDMeshClientOptions = (
  opts: IDMeshProviderOptions
): IDMeshProviderOptions => {
  deprecateRedirectUri(opts);

  return {
    ...opts,
    idmeshClient: {
      name: 'idmesh-react',
      version: Version,
    },
  };
};

const normalizeErrorFn =
  (fallbackMessage: string) =>
  (error: any): Error => {
    if (error instanceof Error) {
      return error;
    }
    if (
      error !== null &&
      typeof error === 'object' &&
      'error' in error &&
      typeof error.error === 'string'
    ) {
      if (
        'error_description' in error &&
        typeof error.error_description === 'string'
      ) {
        return new OAuthError(error.error, error.error_description);
      }
      return new OAuthError(error.error);
    }
    return new Error(fallbackMessage);
  };

export const loginError = normalizeErrorFn('Login failed');

export const tokenError = normalizeErrorFn('Get access token failed');
