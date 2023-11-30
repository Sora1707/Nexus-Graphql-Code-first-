import { Role } from "../user/enum/Role";

export function RoleGuard(roles: Role[], userRoles: Role[]): boolean {
    for (const role of roles) {
        if (!userRoles.includes(role)) return false;
    }
    return true;
}
