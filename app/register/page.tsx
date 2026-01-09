"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/auth";
import { isValidName, isValidEmail } from "@/utils";
import FooterContact from "../components/FooterContact";
import { ArrowLeft, User, Mail, Lock, Check } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Validaciones
    const validLength = password.length >= 8;
    const hasNumberSymbol = /[0-9!@#$%^&*]/.test(password);
    const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
    const passwordValid = validLength && hasNumberSymbol && hasUpperLower;

    const handleRegister = async () => {
        setError("");

        if (!isValidName(fullName)) return setError("El nombre no es válido. Solo letras.");
        if (!isValidEmail(email)) return setError("El email no es válido.");
        if (!passwordValid) return setError("La contraseña no cumple los requisitos.");
        if (password !== repeatPassword) return setError("Las contraseñas no coinciden.");

        try {
            setLoading(true);
            await authService.register(fullName, email, password);
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.error || "Error inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white text-black">
            {/* CONTENT */}
            <main className="flex-1 px-6 py-10 flex justify-center">
                <div className="w-full max-w-lg">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-sm">Volver</span>
                        </button>

                        <p className="text-xs text-gray-500">
                            Already member?{" "}
                            <a href="/login" className="text-black font-semibold underline">
                                Sign in
                            </a>
                        </p>
                    </div>

                    {/* Card */}
                    <div className="p-10 rounded-2xl bg-white shadow-[0_0_40px_rgba(0,0,0,0.06)]">
                        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                            Sign Up
                        </h1>

                        {/* FULL NAME */}
                        <div className="mb-5">
                            <div className="flex items-center border border-gray-300 rounded-xl px-3">
                                <User className="w-5 h-5 text-black" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-3 py-3 outline-none rounded-xl"
                                />
                                {isValidName(fullName) && <Check className="w-5 h-5 text-green-600" />}
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="mb-5">
                            <div className="flex items-center border border-gray-300 rounded-xl px-3">
                                <Mail className="w-5 h-5 text-black" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-3 outline-none rounded-xl"
                                />
                                {isValidEmail(email) && <Check className="w-5 h-5 text-green-600" />}
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="mb-2">
                            <div className="flex items-center border border-gray-300 rounded-xl px-3">
                                <Lock className="w-5 h-5 text-black" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-3 outline-none rounded-xl"
                                />
                            </div>
                        </div>

                        {/* REPEAT PASSWORD */}
                        <div className="mt-2">
                            <div className="flex items-center border border-gray-300 rounded-xl px-3">
                                <Lock className="w-5 h-5 text-black" />
                                <input
                                    type="password"
                                    placeholder="Re-Type Password"
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                    className="w-full px-3 py-3 outline-none rounded-xl"
                                />
                            </div>
                        </div>

                        {/* PASSWORD RULES */}
                        <div className="ml-2 my-3 mb-8 text-sm space-y-1">
                            <p className={validLength ? "text-green-600" : "text-gray-400"}>
                                */ At least 8 characters
                            </p>
                            <p className={hasNumberSymbol ? "text-green-600" : "text-gray-400"}>
                                */ At least one number (09) or symbol
                            </p>
                            <p className={hasUpperLower ? "text-green-600" : "text-gray-400"}>
                                */ Lowercase (a-z) and uppercase (A-Z)
                            </p>
                        </div>

                        {/* ERROR + BUTTON */}
                        <div className="flex flex-col items-center">
                            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                            <button
                                onClick={handleRegister}
                                className="px-10 py-3 bg-black text-white font-semibold rounded-full transition disabled:opacity-50 cursor-pointer"
                                disabled={!isValidName(fullName) || !isValidEmail(email) || !passwordValid}
                            >
                                {loading ? "Creating Account..." : "Sign Up"}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="text-gray-500 text-sm">Or (not working)</span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>

                        {/* Socials (de momento) */}
                        <div className="flex justify-center gap-4">
                            <button className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 ">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 cursor-pointer" viewBox="0 0 256 262">
                                    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                    <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path> <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                                    <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER ABAJO */}
            <FooterContact />
        </div>
    );
}
