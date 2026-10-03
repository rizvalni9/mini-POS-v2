# MiniPOS — Frontend & Backend

Proyek ini sudah dipisahkan menjadi dua aplikasi:

```text
mini-POS-separated/
├── frontend/   # Next.js + Firebase Authentication (browser)
└── backend/    # Express + Firebase Admin + Firestore
```

## Arsitektur

```text
Browser
  │
  │ Firebase Authentication
  ▼
frontend (Next.js :3000)
  │
  │ Bearer Firebase ID Token
  ▼
backend (Express :4000)
  │
  │ Firebase Admin SDK
  ▼
Firestore
```

Frontend **tidak lagi membaca/menulis Firestore secara langsung** untuk produk dan transaksi. Frontend hanya:
- melakukan login melalui Firebase Authentication;
- mendapatkan Firebase ID token;
- mengirim token tersebut ke backend;
- menampilkan data dari API.

Backend:
- memverifikasi Firebase ID token;
- mengambil `uid` dari token, bukan dari request body;
- mengakses Firestore dengan Firebase Admin SDK;
- menjalankan checkout + pengurangan stok dalam transaksi Firestore.

## 1. Firebase

Di Firebase Console:
1. Pastikan Authentication > Sign-in method > Email/Password aktif.
2. Pastikan Firestore sudah dibuat.
3. Untuk backend, buat Service Account melalui Firebase/Google Cloud dan ambil credential-nya.

**Jangan pernah memasukkan private key Service Account ke frontend atau Git.**

## 2. Frontend

```bash
cd frontend
npm install
```

Buat `.env.local` dari `.env.example`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Lalu:

```bash
npm run dev
```

Frontend berjalan di `http://localhost:3000`.

## 3. Backend

```bash
cd backend
npm install
```

Buat `.env` dari `.env.example`:

```env
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CORS_ORIGIN=http://localhost:3000
PORT=4000
```

Lalu:

```bash
npm run dev
```

Backend berjalan di `http://localhost:4000`.

Cek:

```text
http://localhost:4000/health
```

## Catatan keamanan

- `.env` dan `.env.local` jangan di-commit.
- `NEXT_PUBLIC_FIREBASE_*` adalah konfigurasi Web SDK dan memang dapat terlihat di browser.
- `FIREBASE_PRIVATE_KEY` adalah credential rahasia dan hanya boleh berada di backend.
- Backend tidak menerima `uid` dari frontend sebagai sumber identitas. UID diambil dari Firebase ID token yang sudah diverifikasi.
- Firestore Security Rules tetap disertakan untuk akses client-side langsung yang mungkin diperlukan di masa depan. Operasi backend menggunakan Admin SDK dan karena itu tidak melewati Security Rules; keamanan backend bergantung pada verifikasi token dan pembatasan path berdasarkan UID.

## Endpoint backend

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/health` | Tidak |
| GET | `/api/products` | Ya |
| GET | `/api/products/:id` | Ya |
| POST | `/api/products` | Ya |
| PUT | `/api/products/:id` | Ya |
| DELETE | `/api/products/:id` | Ya |
| GET | `/api/transactions` | Ya |
| GET | `/api/transactions/:id` | Ya |
| POST | `/api/transactions/checkout` | Ya |
