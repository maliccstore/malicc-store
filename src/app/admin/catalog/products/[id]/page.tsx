'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProductById } from '@/store/admin/product/productThunks';
import { RootState, AppDispatch } from '@/store';
import ProductForm from '@/components/admin/products/ProductForm';
import { useProductForm } from '@/features/admin/products/hooks/useProductForm';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const product = useSelector(
    (state: RootState) => state.adminProducts.current
  );

  // Use a state to store the resolved id
  const [id, setId] = React.useState<string>('');

  useEffect(() => {
    // Resolve the params promise
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminProductById(id));
    }
  }, [id, dispatch]);

  const productFormProps = useProductForm(product);

  if (!product) return <div>Loading…</div>;

  return (
    <ProductForm
      {...productFormProps}
      product={product}
      onDiscard={() => productFormProps.router.back()}
    />
  );
}
