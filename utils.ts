// Validar nombre (solo letras y espacios, minimo 3).
export function isValidName(name: string): boolean {
    const regex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{3,50}$/;
    return regex.test(name.trim());
}

// Validar email basico.
export function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
}

// Validar número de celular.
export function isValidPhone(phone: string): boolean {
    const value = phone.trim();

    // Permite +59899123456 o 099123456.
    return /^\+?\d{7,15}$/.test(value);
}

// Mueve la scrollbar del usuario a un sitio en concreto.
export function scrollToId(id: string) {
    if (typeof window === "undefined") return;

    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

// Para elegir n numeros random de un array sin repetir.
export function pickRandom<T>(arr: T[], n: number) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
}