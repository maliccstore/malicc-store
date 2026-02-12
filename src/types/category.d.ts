export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    parentId?: string;
    children?: Category[];
    sortOrder?: number;
}

export interface CategoryFilterInput {
    isActive?: boolean;
    search?: string;
    parentId?: string;
}
