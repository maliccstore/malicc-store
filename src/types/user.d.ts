
export interface AuthPayload {
    token: string;
    user: User;
}

export interface User {
    id: string;
    username?: string;
    email?: string;
    phoneNumber: string;
    role: string;
    isAdmin: boolean;
    isPhoneVerified: boolean;
}

export interface SignupInput {
    phoneNumber: string;
}