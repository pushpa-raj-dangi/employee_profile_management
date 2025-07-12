import { AuthChecker } from 'type-graphql';
import { CustomContext } from '../../types';

export const customAuthChecker: AuthChecker<CustomContext> = ({ context }, roles) => {
  const { userId, role } = context.req.session;

  if (!userId || !role) return false;

  if (roles.length === 0) return true;

  return roles.includes(role);
};
