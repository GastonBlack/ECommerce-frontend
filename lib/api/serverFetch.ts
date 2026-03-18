import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function serverFetch(path: string, options: RequestInit = {}) {
    // Obtiene el store de cookies.
    const cookieStore = await cookies();

    // Extrae el valor del JWT almacenado en la cookie 'token'.
    const token = cookieStore.get("token")?.value;

    // Fusiona los headers entrantes con los nuevos.
    const headers = new Headers(options.headers);

    if (token) {
        // Envía el token como Bearer para que ASP.NET lo valide mediante middleware de JWT.
        headers.set("Authorization", `Bearer ${token}`);

        // Envía la cookie manualmente ya que fetch en el servidor no la adjunta automáticamente.
        headers.set("Cookie", `token=${token}`);
    }

    return fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
        // Evita el almacenamiento en caché para obtener siempre datos nuevos de la API.
        cache: "no-store",
    });
}