import { useAuth } from "../hooks/useAuth";
import type { Role } from "../utils/permissions";

interface Props {
  allowed: Role[];
  children: React.ReactNode;
}

const RoleBased: React.FC<Props> = ({ allowed, children }) => {
  const { user } = useAuth();
  const userRole = user?.role?.toUpperCase();
  const allowedRoles = allowed.map(role => role.toUpperCase());

  console.log("RoleBased user:", userRole, "allowed roles:", allowedRoles);

  if (!userRole || !allowedRoles.includes(userRole)) return null;
  return <>{children}</>;
};

export default RoleBased;
