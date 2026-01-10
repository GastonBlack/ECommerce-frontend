export type CartItem = {
    cartItemId: number;
    productId: number;
    productName: string;
    imageUrl: string | null;
    price: number;
    quantity: number;
};