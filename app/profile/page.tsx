"use client";

import { ArrowLeft, LogOut, Save, Shield } from "lucide-react";
import FooterContact from "../components/FooterContact";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { UserMe } from "@/lib/types/user";
import { userService } from "@/lib/api/user";
import { authService } from "@/lib/api/auth";
import { isValidPhone } from "@/utils";

export default function HomePage() {
    const router = useRouter();

    const [me, setMe] = useState<UserMe | null>(null);
    const [loading, setLoading] = useState(true);

    // Mensaje general para errores o confirmaciones.
    const [msg, setMsg] = useState<string>("");
    const [msgType, setMsgType] = useState<"success" | "error" | "">(""); // Para el color.

    // Forms
    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    // Password forms
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    // Al iniciar obtiene los datos del usuario y los carga.
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        (async () => {
            try {
                setLoading(true);
                const data = await userService.getMe();

                setMe(data);
                setFullName(data.fullName ?? "");
                setAddress(data.address ?? "");
                setPhone(data.phone ?? "");
            } catch (e) {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        })();
    }, [router]);

    const hasChanges = useMemo(() => {
        if (!me) return false;
        return (
            fullName.trim() !== (me.fullName ?? "") ||
            address.trim() !== (me.address ?? "") ||
            phone.trim() !== (me.phone ?? "")
        );
    }, [me, fullName, address, phone]);

    const saveProfile = async () => {
        setMsg("");

        if (!me) return;

        if (fullName.trim().length < 2) {
            setMsg("El nombre debe tener al menos 2 caracteres.");
            return;
        }

        if (phone.trim() !== "" && !isValidPhone(phone)) {
            setMsg("Teléfono inválido. Usá 7 a 15 dígitos.");
            return;
        }

        try {
            const updated = await userService.updateMe({
                fullName: fullName.trim(),
                address: address.trim() === "" ? null : address.trim(),
                phone: phone.trim() === "" ? null : phone.trim(),
            });

            setMe(updated);

            // Para q el Header se actualice.
            localStorage.setItem("userName", updated.fullName);

            setMsg("Perfil actualizado");
            setMsgType("success");
            setTimeout(() => setMsg(""), 2500);
        } catch (err: any) {
            setMsg(err?.response?.data?.error || "Error al guardar.");
            setMsgType("error");
        }
    };

    const changePassword = async () => {
        setMsg("");

        if (currentPassword.trim() === "" || newPassword.trim() === "") {
            setMsg("Completá ambas contraseñas.");
            setMsgType("error");
            return;
        }

        if (currentPassword.trim() == newPassword.trim()) {
            setMsg("Las contraseñas no pueden ser iguales.");
            setMsgType("error");
            return;
        }

        if (newPassword.length < 8) {
            setMsg("La nueva contraseña debe tener al menos 8 caracteres.");
            setMsgType("error");
            return;
        }

        try {
            await userService.changePassword({
                currentPassword,
                newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");

            setMsg("Contraseña actualizada");
            setMsgType("success");
            setTimeout(() => {
                setMsg("");
                setMsgType("");
            }, 2500);
        } catch (err: any) {
            setMsg(err?.response?.data?.error || "Error al cambiar contraseña.");
            setMsgType("error");
        }
    };

    const logout = () => {
        authService.logout();
        router.push("/");
    };

    return (
        <div className="min-h-screen flex flex-col bg-white text-black">
            <main className="flex-1 w-full">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start">
                        <div className="w-full lg:w-auto">
                            <button
                                onClick={() => router.back()}
                                className="
                                    w-full lg:w-auto
                                    flex items-center justify-center gap-2
                                    cursor-pointer hover:scale-[1.01] transition
                                    px-4 py-3 border border-gray-200 rounded-xl shadow-md
                                "
                            >
                                <ArrowLeft className="w-6 h-6" />
                                <span className="font-semibold text-sm">Volver</span>
                            </button>
                        </div>

                        <div className="w-full border rounded-xl shadow-xl border-gray-200 px-5 sm:px-8 py-6 sm:py-8">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-gray-200 pb-6">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold">Mi perfil</h1>

                                    {loading ? (
                                        <p className="text-sm text-gray-500 mt-2">Cargando...</p>
                                    ) : (
                                        <>
                                            <p className="text-sm text-gray-500 mt-1">{me?.email}</p>
                                            <p className="text-xl sm:text-2xl font-semibold mt-5">
                                                {me?.fullName}
                                            </p>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={logout}
                                    className="
                                        w-full sm:w-auto
                                        flex h-12 justify-center items-center border rounded-xl px-4 border-gray-300 font-semibold gap-2 text-red-700 cursor-pointer
                                        hover:scale-[1.01] transition
                                    "
                                >
                                    <LogOut className="w-4 h-4" />
                                    Cerrar sesión
                                </button>
                            </div>

                            {/* Mensaje general */}
                            {msg && (
                                <div
                                    className={`
                                        mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold
                                        ${msgType === "success"
                                            ? "bg-green-50 border border-green-300 text-green-600"
                                            : "bg-red-50 border border-red-300 text-red-600"
                                        }
                                    `}
                                >
                                    {msg}
                                </div>
                            )}


                            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                                {/* DATOS PERSONALES */}
                                <section className="border border-gray-200 rounded-xl p-5 sm:p-6">
                                    <h2 className="text-lg font-bold mb-4">Datos personales</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-semibold mb-2">Nombre</p>
                                            <input
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-400"
                                                placeholder="Tu nombre"
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold mb-2">Dirección</p>
                                            <input
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-400"
                                                placeholder="Calle, ciudad..."
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold mb-2">Teléfono</p>
                                            <input
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-400"
                                                placeholder="+598..."
                                                disabled={loading}
                                                inputMode="numeric"
                                            />
                                        </div>

                                        <button
                                            onClick={saveProfile}
                                            disabled={loading || !hasChanges}
                                            className="
                                                w-full mt-2 flex items-center justify-center gap-2 rounded-full bg-black text-white font-semibold py-3
                                                disabled:opacity-50 cursor-pointer
                                            "
                                        >
                                            <Save className="w-4 h-4" />
                                            Guardar cambios
                                        </button>
                                    </div>
                                </section>

                                {/* SEGURIDAD */}
                                <section className="border border-gray-200 rounded-xl p-5 sm:p-6">
                                    <h2 className="text-lg font-bold mb-4">Seguridad</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-semibold mb-2">
                                                Contraseña actual
                                            </p>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-400"
                                                placeholder="••••••••"
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold mb-2">
                                                Nueva contraseña
                                            </p>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-400"
                                                placeholder="mínimo 8 caracteres"
                                                disabled={loading}
                                            />
                                        </div>

                                        <button
                                            onClick={changePassword}
                                            disabled={loading}
                                            className="
                                                w-full mt-2 flex items-center justify-center gap-2 rounded-full border border-gray-300 py-3 font-semibold
                                                hover:bg-gray-50 cursor-pointer
                                            "
                                        >
                                            <Shield className="w-4 h-4" />
                                            Cambiar contraseña
                                        </button>
                                    </div>
                                </section>
                            </div>

                            <div className="mt-8 sm:mt-10 border border-gray-200 rounded-xl p-5 sm:p-6">
                                <h2 className="text-lg font-bold mb-2">Mis pedidos</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Acá podés ver el historial de pedidos. (TODO: implementar)
                                </p>

                                <button
                                    onClick={() => router.push("/orders")}
                                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-black text-white font-semibold hover:opacity-90 cursor-pointer"
                                >
                                    Ver pedidos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <FooterContact />
        </div>
    );
}