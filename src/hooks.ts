import { User } from 'idmesh-spa-js';
import { useContext } from 'react';
import IDMeshContext from './context';
import { IDMeshContextInterface } from './interface';

export const useIDMesh = <TUser extends User = User>(
  context = IDMeshContext
): IDMeshContextInterface<TUser> =>
  useContext(context) as IDMeshContextInterface<TUser>;
