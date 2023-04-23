import { IdmeshClientOptions, User } from 'idmesh-spa-js';
import React from 'react';
import { AppState } from './app-state';
import { IDMeshContextInterface } from './context';

export interface IDMeshProviderOptions extends IdmeshClientOptions {
  children?: React.ReactNode;
  onRedirectCallback?: (appState?: AppState, user?: User) => void;
  skipRedirectCallback?: boolean;
  context?: React.Context<IDMeshContextInterface>;
}

