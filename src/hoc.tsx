import React, { ComponentType } from 'react';
import IDMeshContext from './context';
import { IDMeshContextInterface } from './interface';

export interface WithIDMeshProps {
  auth0: IDMeshContextInterface;
}

export const withIDMesh = <P extends WithIDMeshProps>(
  Component: ComponentType<P>,
  context = IDMeshContext,
): ComponentType<Omit<P, keyof WithIDMeshProps>> => {
  return function WithAuth(props): JSX.Element {
    return (
      <context.Consumer>
        {(auth: IDMeshContextInterface): JSX.Element => (
          <Component {...(props as P)} idmesh={auth} />
        )}
      </context.Consumer>
    );
  };
};
