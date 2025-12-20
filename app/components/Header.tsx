

export default function Header(){
    return(
        <header className="w-full py-5 px-8 flex justify-between items-center border-b border-gray-200 bg-white">
            <h1 className="text-2xl font-bold tracking-tight">ECommerce</h1>

                <nav className="hidden md:flex gap-8 text-sm font-medium text-base">
                    <a href="#" className="hover:text-gray-600">Celulares</a>
                    <a href="#" className="hover:text-gray-600">Graficas</a>
                    <a href="#" className="hover:text-gray-600">Consolas</a>
                    <a href="#" className="hover:text-gray-600">Auriculares</a>
                </nav>

                <div className="flex items-center gap-6">
                    
                    <div className="h-full flex justify-between items-center">
                        <a href="/login" className="hover:text-gray-600 text-sm">Log In /&nbsp;</a>
                        <a href="/register" className="hover:text-gray-600 text-sm">Sign Up </a>
                    </div>

                    {/* Icono del carrito */}
                    <a href="/cart">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 92 92">
                            <path d="M91.8 27.3 81.1 61c-.8 2.4-2.9 4-5.4 4H34.4c-2.4 0-4.7-1.5-5.5-3.7L13.1 19H4c-2.2 0-4-1.8-4-4s1.8-4 4-4h11.9c1.7 0 3.2 1.1 3.8 2.7L36 57h38l8.5-27H35.4c-2.2 0-4-1.8-4-4s1.8-4 4-4H88c1.3 0 2.5.7 3.2 1.7.8 1 1 2.4.6 3.6zm-55.4 43c-1.7 0-3.4.7-4.6 1.9-1.2 1.2-1.9 2.9-1.9 4.6 0 1.7.7 3.4 1.9 4.6 1.2 1.2 2.9 1.9 4.6 1.9s3.4-.7 4.6-1.9c1.2-1.2 1.9-2.9 1.9-4.6 0-1.7-.7-3.4-1.9-4.6-1.2-1.2-2.9-1.9-4.6-1.9zm35.9 0c-1.7 0-3.4.7-4.6 1.9s-1.9 2.9-1.9 4.6c0 1.7.7 3.4 1.9 4.6 1.2 1.2 2.9 1.9 4.6 1.9 1.7 0 3.4-.7 4.6-1.9 1.2-1.2 1.9-2.9 1.9-4.6 0-1.7-.7-3.4-1.9-4.6s-2.9-1.9-4.6-1.9z"></path>
                        </svg>
                    </a>
                </div>
        </header>
    )
}