type Role = "ADMIN" | "SALES" | "SUPPORT";
type Ability = "read" | "create" | "update" | "delete";
type Resource =
  | "dashboard"
  | "customers"
  | "products"
  | "sales"
  | "reports"
  | "users"
  | "tickets"
  | "audit"
  | "calendar";

const policy: Record<Role, Partial<Record<Resource, Ability[]>>> = {
  ADMIN: {
    dashboard: ["read"],
    customers: ["read", "create", "update", "delete"],
    products: ["read", "create", "update", "delete"],
    sales: ["read", "create", "update", "delete"],
    reports: ["read"],
    users: ["read", "create", "update", "delete"],
    tickets: ["read", "create", "update", "delete"],
    audit: ["read"],
    calendar: ["read"],
  },
  SALES: {
    dashboard: ["read"],
    customers: ["read", "create", "update"],
    products: ["read"],
    sales: ["read", "create", "update", "delete"],
    reports: ["read"],
    tickets: ["read"],
    audit: [],
    calendar: ["read"],
  },
  SUPPORT: {
    dashboard: ["read"],
    customers: ["read", "update"],
    products: ["read"],
    sales: ["read"],
    reports: ["read"],
    users: [],
    tickets: ["read", "create", "update"],
    audit: [],
    calendar: ["read"],
  },
};

export function can(role: Role, resource: Resource, ability: Ability) {
  const allowed = policy[role]?.[resource] ?? [];
  return allowed.includes(ability);
} 