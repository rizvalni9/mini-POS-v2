export type CartItem = { productId: string; sku: string;  name: string; price: number; quantity: number; stock: number; }

export type PaymentMethod = "cash" | "transfer" | "qris";
