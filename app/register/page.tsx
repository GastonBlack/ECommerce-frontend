"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/auth";
import { isValidName, isValidEmail } from "@/utils";

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

        if (!isValidName(fullName)) {
            return setError("El nombre no es válido. Solo se pueden utilizar letras.");
        }

        if (!isValidEmail(email)) {
            return setError("El email no es válido.");
        }

        if (!passwordValid)
            return setError("La contraseña no cumple los requisitos.");

        if (password !== repeatPassword)
            return setError("Las contraseñas no coinciden.");

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

    const FullNameIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 " viewBox="0 0 24 24">
            <path fill="currentColor" fillRule="evenodd" d="M23.939 21.429H0v-2.248c0-1.179.35-1.609 1.236-2.294 1.956-1.511 4.874-2.472 7.917-3.308.542-.149.42-.208.429-.762.01-.558 0-.506-.407-.849C5.797 9.116 6.061.597 11.97 0c5.908.597 6.172 9.116 2.794 11.968-.407.343-.417.291-.407.849.009.555-.113.613.429.762 3.043.836 5.961 1.797 7.917 3.308.886.685 1.236 1.115 1.236 2.294v2.248z" clipRule="evenodd"
            />
        </svg>
    );
    const TickIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 512 512">
            <path fill="currentColor" d="M223.9 329.7c-2.4 2.4-5.8 4.4-8.8 4.4s-6.4-2.1-8.9-4.5l-56-56 17.8-17.8 47.2 47.2L340 177.3l17.5 18.1-133.6 134.3z"></path>
        </svg>
    );
    const EmailIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 128 96">
            <path fill="currentColor" d="M0 11.283V8a8 8 0 0 1 8-8h112a8 8 0 0 1 8 8v3.283l-64 40zm66.12 48.11a4.004 4.004 0 0 1-4.24 0L0 20.717V88a8 8 0 0 0 8 8h112a8 8 0 0 0 8-8V20.717z"></path>
        </svg>
    );
    const PasswordIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,20H5a4,4,0,0,1-4-4V12A4,4,0,0,1,5,8H19a4,4,0,0,1,4,4v4A4,4,0,0,1,19,20ZM5,10a2,2,0,0,0-2,2v4a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2V12a2,2,0,0,0-2-2Z"></path>
            <path fill="currentColor" d="M19,10H5V8A7,7,0,0,1,19,8ZM7,8H17A5,5,0,0,0,7,8Z"></path>
            <path fill="currentColor" d="M19,9H5a3,3,0,0,0-3,3v4a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V12A3,3,0,0,0,19,9ZM6,15a1,1,0,1,1,1-1A1,1,0,0,1,6,15Zm4,0a1,1,0,1,1,1-1A1,1,0,0,1,10,15Zm4,0a1,1,0,1,1,1-1A1,1,0,0,1,14,15Zm4,0a1,1,0,1,1,1-1A1,1,0,0,1,18,15Z"></path>
        </svg>
    );


    return (
        <div className="w-full min-h-screen bg-white flex justify-center items-center px-6 text-black">

            <div className="relative w-full max-w-lg">

                {/* Flecha arriba izquierda */}
                <button
                    onClick={() => router.back()}
                    className="absolute left-0 text-gray-700 hover:text-black cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 32 32" >
                        <path fill="currentColor" d="M4 15.004a.999.999 0 0 0 .286.692l.006.012 6 6a1 1 0 0 0 1.414-1.414L7.414 16H27a1 1 0 0 0 0-2H7.414l4.292-4.292a1 1 0 0 0-1.414-1.414l-6 6-.006.01a.978.978 0 0 0-.208.314A.974.974 0 0 0 4 15v.004z"></path>
                    </svg>
                </button>

                {/* Link arriba derecha */}
                <p className="absolute right-0 text-xs text-gray-500">
                    Already member?{" "}
                    <a href="/login" className="text-black font-semibold underline">
                        Sign in
                    </a>
                </p>

                {/* Main Card */}
                <div className="p-10 rounded-2xl bg-white shadow-[0_0_40px_rgba(0,0,0,0.06)]">

                    <h1 className="w-full text-4xl font-bold text-gray-900 mb-8 text-center">Sign Up</h1>

                    {/* INPUT FULL NAME */}
                    <div className="relative mb-5">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:outline-blue-500"
                        />
                        {/* Icono izquierda */}
                        <span className="absolute left-3.5 top-4.5 text-black">{FullNameIcon}</span>


                        {/* Check a la derecha */}
                        {isValidName(fullName) && (
                            <span className="absolute right-3 top-2.5">{TickIcon}</span>
                        )}
                    </div>

                    {/* INPUT EMAIL */}
                    <div className="relative mb-5">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:outline-blue-500"
                        />
                        <span className="absolute left-3 top-4">{EmailIcon}</span>

                        {isValidEmail(email) && (
                            <span className="absolute right-3 top-2.5">{TickIcon}</span>
                        )}
                    </div>

                    {/* INPUT PASSWORD */}
                    <div className="relative mb-2">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:outline-blue-500"
                        />
                        <span className="absolute left-2.5 top-3.5">{PasswordIcon}</span>
                    </div>

                    {/* REPEAT PASSWORD */}
                    <div className="relative mt-1">
                        <input
                            type="password"
                            placeholder="Re-Type Password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:outline-blue-500"
                        />
                        <span className="absolute left-2.5 top-3.5">{PasswordIcon}</span>
                    </div>

                    {/* PASSWORD VALIDATION */}
                    <div className="ml-2 my-2 mb-8 text-sm space-y-1">
                        <p className={`${validLength ? "text-green-600" : "text-gray-400"}`}>
                            \*/ At least 8 characters
                        </p>
                        <p className={`${hasNumberSymbol ? "text-green-600" : "text-gray-400"}`}>
                            \*/ At least one number (09) or symbol
                        </p>
                        <p className={`${hasUpperLower ? "text-green-600" : "text-gray-400"}`}>
                            \*/ Lowercase (a-z) and uppercase (A-Z)
                        </p>
                    </div>



                    {/* BUTTON SIGN UP */}
                    <div className="flex items-center justify-center w-full flex-col">
                        {/* ERROR */}
                        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                        <button
                            onClick={handleRegister}
                            className="w-34 py-3 bg-black text-white font-semibold rounded-full transition disabled:opacity-50 cursor-pointer"
                            disabled={!isValidName(fullName) || !isValidEmail(email) || !passwordValid}
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </button>
                    </div>


                    {/* Divider OR */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="text-gray-500 text-sm">Or (not working)</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    {/* SOCIAL BUTTONS */}
                    <div className="flex justify-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 cursor-pointer" viewBox="0 0 1024 1024">
                            <path fill="#1877f2" d="M1024,512C1024,229.23016,794.76978,0,512,0S0,229.23016,0,512c0,255.554,187.231,467.37012,432,505.77777V660H302V512H432V399.2C432,270.87982,508.43854,200,625.38922,200,681.40765,200,740,210,740,210V336H675.43713C611.83508,336,592,375.46667,592,415.95728V512H734L711.3,660H592v357.77777C836.769,979.37012,1024,767.554,1024,512Z"></path>
                            <path fill="#fff" d="M711.3,660,734,512H592V415.95728C592,375.46667,611.83508,336,675.43713,336H740V210s-58.59235-10-114.61078-10C508.43854,200,432,270.87982,432,399.2V512H302V660H432v357.77777a517.39619,517.39619,0,0,0,160,0V660Z"></path>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 cursor-pointer" viewBox="0 0 256 262">
                            <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                            <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                            <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                            <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
