import UsersManager from "./UserManager";

export default function AdminUsersPage() {
    return (
        <main className="p-6 max-w-7xl mx-auto">
            <div id="adminTop" className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Usuarios</h1>
                <p className="text-gray-500 text-sm">Gestiona usuarios y estados.</p>
            </div>

            <UsersManager/>
        </main>
    );
}