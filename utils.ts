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