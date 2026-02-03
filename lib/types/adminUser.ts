export type AdminUser = {
    id: number;
    fullName: string;
    email: string;
    rol: string; // "Admin" | "User"
    isDisabled: boolean;
    createdAt: string;
    disabledAt?: string | null;
};