"use client";

type PaginationProps = {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
    className?: string;
};

export default function Pagination({
    page,
    totalPages,
    onChange,
    className = "",
}: PaginationProps) {
    const maxVisible = 5;

    const getPages = () => {
        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        let start = page - Math.floor(maxVisible / 2);
        let end = page + Math.floor(maxVisible / 2);

        if (start < 1) {
            start = 1;
            end = maxVisible;
        }

        if (end > totalPages) {
            end = totalPages;
            start = totalPages - maxVisible + 1;
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const pages = getPages();

    return (
        <div className={`flex justify-center mt-10 ${className}`}>
            <div className="flex items-center gap-2">
                {pages.map((p) => {
                    const isActive = p === page;

                    return (
                        <button
                            key={p}
                            onClick={() => onChange(p)}
                            className={`
                                select-none rounded-xl px-4 py-2 text-sm font-medium  transition-all duration-200 border border-gray-200
                                hover:-translate-y-[2px] hover:shadow-md cursor-pointer
                                ${isActive
                                    ? "bg-gray-900 text-white scale-110 shadow-lg border-gray-900"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                }
                            `}
                        >
                            {p}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}