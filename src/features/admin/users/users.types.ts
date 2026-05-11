export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
    SUPERADMIN = 'super_admin',
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
