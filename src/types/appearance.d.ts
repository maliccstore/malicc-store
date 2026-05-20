export interface StoreAppearance {
  id: string;
  store_name: string;
  tagline: string | null;
  logo_url: string | null;
  logo_width: number | null;
  logo_position: 'left' | 'center' | 'right' | null;
  createdAt?: string;
  updatedAt?: string;
}
