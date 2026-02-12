export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
    SUPERADMIN = 'SUPERADMIN',
}

export interface AdminUser {
    id: number;
    username?: string;
    phoneNumber: string;
    isPhoneVerified: boolean;
    role: UserRole;
    email?: string;
    createdAt: string;
    updatedAt: string;
}
