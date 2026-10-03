const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(/\/$/, "");

type ApiOptions = RequestInit & {
  token: string;
};

export async function apiRequest<T>(path: string, options: ApiOptions): Promise<T> {
  const { token, ...requestInit } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(requestInit.headers || {}),
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Permintaan ke server gagal.");
  }

  return payload as T;
}
