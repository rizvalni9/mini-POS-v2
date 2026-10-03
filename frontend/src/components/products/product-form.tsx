/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import React, { FormEvent, useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
// import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { ProductInput} from '@/types/product';

const defaultValue: ProductInput ={
    name:"",
    sku:"",
    price:0,
    stock:0,
};

type Props = {
    initialValues?: ProductInput;
    submitLabel?:string;
    onSubmit: (data: ProductInput) => Promise<void>;
};

// nilai bawaan (default values)

// komponent utama  
export function ProductForm({initialValues, submitLabel="Simpan Produk", onSubmit}: Props){
        
    const [form, setForm] = useState<ProductInput>(initialValues ?? defaultValue);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(()=>{
        if(initialValues) setForm(initialValues);
    }, [initialValues]);

    // helper untuk update input field
    function setField<K extends keyof ProductInput>(field:K, value: ProductInput[K]){
        setForm((current)=>({
            ...current,
            [field]: value
        }));
    }
    
    // definisikan tipe dan fungsi validasi
    type FormErrors = Partial<Record<keyof ProductInput, string>>;
    
    // handler untuk submit form
    // const [errors, setErrors] = useState<FormErrors>({});

    // function validateProduct(values: ProductInput){
    //     const errors: FormErrors = {};
        
    
    //     if(!values.name.trim()){
    //         errors.name = "Nama produk wajib diisi.";
    //     }
    
    //     if(!values.sku.trim()){
    //         errors.sku ="SKU wajib diisi";
    //     }
    
    //     if(values.price<=0){
    //         errors.price = "Harga harus lebih dari 0.";
    //     }
    
    //     if(values.stock<0){
    //         errors.stock ="Stock tidak boleh minus.";
    //     }
    
    //     return errors;
    // }


    async function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        setError("");

        if(!form.name.trim()|| !form.sku.trim()) return setError("Nama dan SKU wajib diisi.");

        if(form.price<=0) return setError("Harga harus lebih dari 0.");

        if(form.stock<0) return setError("Stok tidak boleh negatif.");

        try{
            setLoading(true);
            await onSubmit({...form, name: form.name.trim(),sku: form.sku.trim().toUpperCase()});
        }catch (err) {
            setError(err instanceof Error? err.message : "Gagal menyimpan produk.");
        }finally{
            setLoading(false);
        }

        // const validationErrors = validateProduct(values);
        // setErrors(validationErrors);
        
        // if(Object.keys(validationErrors).length > 0){
        //     return;
        // }
        // onSubmit(values);
    }

    return(
        // <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        //     <div>
        //         <label className="text-sm font-bold text-slate-700">
        //             Nama Produk
        //         </label>

        //         <Input value={values.name} onChange={(event)=> updateField("name",event.target.value)} placeholder="Contoh: Kopi Susu"/>

        //         {errors.name &&(<p className="mt-1 text-sm font-semibold text-red-600">{errors.name}</p>)}

        //     </div>
        //     <div>
        //         <label className="text-sm font-bold text-slate-700">
        //             SKU
        //         </label>

        //         <Input value={values.sku} onChange={(event)=> updateField("sku",event.target.value)} placeholder="Contoh: KOPi001"/>

        //         {errors.sku &&(<p className="mt-1 text-sm font-semibold text-red-600">{errors.sku}</p>)}

        //     </div>
        //     <div>
        //         <label className="text-sm font-bold text-slate-700">
        //             Harga
        //         </label>

        //         <Input type="number" value={values.price} onChange={(event)=> updateField("price",event.target.value)} placeholder="Contoh: 18.000"/>

        //         {errors.price &&(<p className="mt-1 text-sm font-semibold text-red-600">{errors.price}</p>)}

        //     </div>
        //     <div>
        //         <label className="text-sm font-bold text-slate-700">
        //             Stok Barang
        //         </label>

        //         <Input type="number" value={values.stock} onChange={(event)=> updateField("stock",event.target.value)} placeholder="Contoh: 10"/>

        //         {errors.stock &&(<p className="mt-1 text-sm font-semibold text-red-600">{errors.stock}</p>)}

        //     </div>
            
        //     <div className="flex items-center justify-end gap-3">
        //         <Button variant="secondary">
        //             <Link href="/products">
        //                 Batal
        //             </Link>
        //         </Button>

        //         <Button type="submit" className='cursor-pointer'>
        //             {submitLabel}
        //         </Button>
        //     </div>
        // </form>

        <form onSubmit={handleSubmit} className='grid gap-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6'>
            <Input label='Nama Produk' placeholder="Contoh: Kopi Susu" value={form.name} onChange={(e)=> setField("name", e.target.value)}/>
            <Input label='SKU' placeholder="Contoh: KOPI001" value={form.sku} onChange={(e)=> setField("sku", e.target.value)}/>
            <div className='grid gap-5 sm:grid-cols-2'>
                <Input label="harga" type="number" min="1" value={form.price || ""} onChange={(e)=> setField("price", Number(e.target.value))}/>
                <Input label="Stok" type="number" min="0" value={form.stock} onChange={(e)=> setField("stock", Number(e.target.value))}/>
            </div>
            {error && <div className='rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700'>{error}</div>}
            <Button type="submit" disabled={loading} className="sm:w-fit">
                {loading && <LoaderCircle size={18} className='animate-spin'/>}
                {loading ? "Menyimpan..." : submitLabel}
            </Button>
        </form>
    );
    
};

