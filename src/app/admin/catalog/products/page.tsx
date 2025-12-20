'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAdminProducts } from '@/store/admin/product/productThunks';
import { AppDispatch } from '@/store';
import ProductTable from '@/components/admin/products/ProductTable';

export default function AdminProductsPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  return <ProductTable />;
}
