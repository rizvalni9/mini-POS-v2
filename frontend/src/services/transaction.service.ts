import type { User } from "firebase/auth";
import type { CartItem, PaymentMethod, SaleTransaction } from "@/types/transaction";
import { apiRequest } from "@/lib/api";

type CheckoutInput = {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  paymentAmount: number;
};

async function token(user: User) {
  return user.getIdToken();
}

export async function checkout(user: User, input: CheckoutInput) {
  return apiRequest<{ transactionId: string; invoiceNumber: string; total: number }>(
    "/transactions/checkout",
    {
      method: "POST",
      token: await token(user),
      body: JSON.stringify(input),
    },
  );
}

export async function getTransactions(user: User): Promise<SaleTransaction[]> {
  return apiRequest<SaleTransaction[]>("/transactions", {
    method: "GET",
    token: await token(user),
  });
}

export async function getSaleTransaction(user: User, transactionId: string) {
  try {
    return await apiRequest<SaleTransaction>(`/transactions/${transactionId}`, {
      method: "GET",
      token: await token(user),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Transaksi tidak ditemukan.") return null;
    throw error;
  }
}
