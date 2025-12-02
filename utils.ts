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
