export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    EMPLOYEE = 'employee',
}

export const getUserRoles: UserRole[] = [
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.EMPLOYEE,
];