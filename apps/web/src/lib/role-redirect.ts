export const ROLE_DEFAULT_DESTINATIONS: Record<string, string> = {
  SUPER_ADMIN: "/admin",
  ADMIN: "/admin",
  FACILITATOR: "/facilitator",
  PARTICIPANT: "/dashboard",
};

export const getRoleDefaultDestination = (role: string | null): string =>
  role ? (ROLE_DEFAULT_DESTINATIONS[role] ?? "/dashboard") : "/dashboard";

/**
 * Validates that an intended destination is appropriate for a given role.
 * Prevents a PARTICIPANT from being redirected to privileged areas (like /admin)
 * via a crafted `from` parameter.
 */
const PRIVILEGED_PREFIXES = ["/admin", "/facilitator", "/host"];

export const validateRoleDestination = (from: string, role: string | null): string => {
  const isPrivileged = PRIVILEGED_PREFIXES.some((prefix) => from.startsWith(prefix));
  const isPrivilegedRole = role === "ADMIN" || role === "SUPER_ADMIN" || role === "FACILITATOR";
  
  if (isPrivileged && !isPrivilegedRole) {
    return "/dashboard";
  }
  
  return from;
};

/**
 * Checks if a user role is permitted to authenticate on a specific login route.
 */
export const isRoleAllowedOnRoute = (route: string, role: string | null): boolean => {
  if (route.startsWith("/login/admin")) {
    return role === "ADMIN" || role === "SUPER_ADMIN";
  }
  if (route.startsWith("/login/facilitator")) {
    return role === "FACILITATOR" || role === "ADMIN" || role === "SUPER_ADMIN";
  }
  return true; // default /login accepts any
};

