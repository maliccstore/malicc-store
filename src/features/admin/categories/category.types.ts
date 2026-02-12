export interface AdminCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    parentId?: string;
    parent?: {
        id: string;
        name: string;
    };
    children?: AdminCategory[];
    sortOrder?: number;
    createdAt: string;
    updatedAt: string;
}

export type CategoryFormValues = {
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    parentId?: string;
    sortOrder?: number;
};

export interface CategoryFormProps {
    initialValues?: CategoryFormValues;
    onSubmit: (data: CategoryFormValues) => Promise<void>;
    isSubmitting: boolean;
    isEditMode?: boolean;
}

export interface CategoryTableProps {
    categories: AdminCategory[];
    loading: boolean;
    onDelete: (id: string) => void;
}