export type AdminProduct = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    reservedStock: number;
    totalSold: number;
    imageUrl: string | null;
    categoryId: number;
};