import { jwtDecode } from "jwt-decode";

type JwtPayload = {
    sub: string;
    email: string;
    name: string;
    rol?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
};

export function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<JwtPayload>(token);

        return {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            rol:
                decoded.rol ||
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        };
    } catch {
        return null;
    }
}