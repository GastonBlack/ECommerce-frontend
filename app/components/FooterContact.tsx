import {
    Mail,
    MapPin,
    Phone,
    Facebook,
    Instagram,
    Globe,
} from "lucide-react";

export default function FooterContact() {
    return (
        <footer className="w-full bg-black text-gray-300 px-10 pt-14 pb-6 ">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                <div className="flex flex-col items-center justify-center text-sm leading-relaxed">
                    <h2 className="text-white text-2xl font-bold mb-3">ECommerce</h2>
                    <p>Tu tienda online de tecnología de última generación.</p>
                    <p>Comprá fácil, rápido y seguro.</p>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">Ayuda</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-white cursor-pointer">Centro de ayuda</li>
                        <li className="hover:text-white cursor-pointer">Seguimiento de pedidos</li>
                        <li className="hover:text-white cursor-pointer">Cambios y devoluciones</li>
                        <li className="hover:text-white cursor-pointer">Métodos de pago</li>
                        <li className="hover:text-white cursor-pointer">Envíos</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">Empresa</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-white cursor-pointer">Sobre nosotros</li>
                        <li className="hover:text-white cursor-pointer">Trabajá con nosotros</li>
                        <li className="hover:text-white cursor-pointer">Términos y condiciones</li>
                        <li className="hover:text-white cursor-pointer">Política de privacidad</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">Contacto</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-3">
                            <MapPin className="w-5 h-5" />
                            <span>Montevideo, Uruguay</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5" />
                            <span>contacto@ecommerce.com</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5" />
                            <span>+598 99 123 456</span>
                        </li>
                    </ul>

                    <div className="flex gap-4 mt-6">
                        <Globe className="w-5 h-5 hover:text-white cursor-pointer" />
                        <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
                        <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 hover:text-white cursor-pointer" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L13.348 9.23779L9.07342 3.40865C8.88504 3.15177 8.58555 3 8.267 3H4C3.62317 3 3.27833 3.21184 3.108 3.54798C2.93766 3.88412 2.97075 4.28747 3.19359 4.59135L9.45538 13.1304L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L10.652 14.7622L14.9266 20.5914C15.115 20.8482 15.4145 21 15.733 21H20C20.3768 21 20.7217 20.7882 20.892 20.452C21.0623 20.1159 21.0293 19.7125 20.8064 19.4086L14.5446 10.8696L20.7071 4.70711ZM12.3703 11.2865C12.4012 11.338 12.4371 11.3872 12.4781 11.4336L18.0266 19H16.2398L5.97338 5H7.76026L12.3703 11.2865Z"></path>
                        </svg> {/* No hay Icono de X en Lucide */}
                    </div>
                </div>

            </div>

            <div className="border-t border-gray-400 pt-6 text-center text-sm text-gray-400">
                © 2026 ECommerce. Todos los derechos reservados.
            </div>

        </footer>
    );
}
