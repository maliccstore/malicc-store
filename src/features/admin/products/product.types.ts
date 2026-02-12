import { Control, UseFormHandleSubmit, FieldErrors } from 'react-hook-form';
import { AdminCategory } from '@/features/admin/categories/category.types';

export type AdminProductStatus = 'ACTIVE' | 'INACTIVE';

export interface AdminProductInventory {
  quantity: number;
  availableQuantity: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  // stock: number; // Removing flat stock in favor of inventory object
  inventory: AdminProductInventory;
  status: AdminProductStatus;
  category?: {
    id: string;
    name: string;
  } | string; // Supporting both object (from backend) and string (legacy/ID)
  sku?: string;
  //   healthTags?: string[];
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProductFormValues = {
  title: string;
  description: string;
  imageUrl: string;
  status: AdminProductStatus;
  price: number;
  sku: string;
  categoryId: string;
  inventoryQuantity: number;
  inventoryAvailable: number;
};

export interface ProductFormProps {
  product?: AdminProduct;
  isEdit: boolean;
  categories: AdminCategory[];
  isLoadingCategories: boolean;
  control: Control<ProductFormValues>;
  handleSubmit: UseFormHandleSubmit<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  isSubmitting: boolean;
  onSubmit: (data: ProductFormValues) => void;
  handleDelete: () => void;
  imageUrl: string;
  onDiscard: () => void;
}
