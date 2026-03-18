import UsersManager from "./UserManager";
import { serverFetch } from "@/lib/api/serverFetch";
import type { PagedResult } from "@/lib/types/PagedResult";
import type { AdminUser } from "@/lib/types/adminUser";

export default async function AdminUsersPage() {
    const res = await serverFetch("/admin/users?page=1&pageSize=25&includeDisabled=false");

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
    }

    const initialUsers: PagedResult<AdminUser> = await res.json();

    return (
        <main className="p-6 max-w-7xl mx-auto">
            <div id="adminTop" className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Usuarios</h1>
                <p className="text-gray-500 text-sm">Gestiona usuarios y estados.</p>
            </div>

            <UsersManager initialUsers={initialUsers} />
        </main>
    );
}