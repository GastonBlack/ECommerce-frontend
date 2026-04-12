import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
    variant?: 'home' | 'products';
}

export default function SearchBar({
    onSearch,
    placeholder = 'Buscar productos...',
    variant = 'products'
}: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch?.(query.trim());
        }
    };

    const maxWidthClass = variant === 'home' ? 'max-w-2xl' : 'max-w-sm';

    return (
        <div className={`w-full flex items-center justify-center ${maxWidthClass} mx-auto mt-3`}>
            <form
                onSubmit={handleSubmit}
                className="w-full bg-white rounded-md border border-gray-300 hover:scale-102 transition-all duration-40"
            >
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-4 py-2 border-none rounded-lg focus:outline-none"
                    />
                </div>
            </form>
            <button
                onClick={() => query.trim() && onSearch?.(query.trim())}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer hover:scale-102 transition"
            >
                Buscar
            </button>
        </div>
    );
}