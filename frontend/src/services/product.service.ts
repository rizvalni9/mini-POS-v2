import type { Product, ProductInput } from "@/types/product";
import { apiRequest } from "@/lib/api";
import type { User } from "firebase/auth";

async function token(user: User) {
  return user.getIdToken();
}

export async function getProducts(user: User): Promise<Product[]> {
  return apiRequest<Product[]>("/products", { method: "GET", token: await token(user) });
}

export async function getProduct(user: User, productId: string): Promise<Product | null> {
  try {
    return await apiRequest<Product>(`/products/${productId}`, {
      method: "GET",
      token: await token(user),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Produk tidak ditemukan.") return null;
    throw error;
  }
}

export async function createProduct(user: User, input: ProductInput) {
  return apiRequest<Product>("/products", {
    method: "POST",
    token: await token(user),
    body: JSON.stringify(input),
  });
}

export async function updateProduct(user: User, productId: string, input: ProductInput) {
  return apiRequest<Product>(`/products/${productId}`, {
    method: "PUT",
    token: await token(user),
    body: JSON.stringify(input),
  });
}

export async function deleteProduct(user: User, productId: string) {
  return apiRequest<{ message: string }>(`/products/${productId}`, {
    method: "DELETE",
    token: await token(user),
  });
}
