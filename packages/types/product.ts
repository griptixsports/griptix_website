export type ProductCategory = "Pistol" | "Rifle";
export type ProductStatus = "available" | "discontinued" | "pre_order";

export interface Product {
  id: string;
  title: string;
  sku: string;
  description: string;
  price: number;
  image_url: string;
  category: ProductCategory;
  status: ProductStatus;
  weight_grams?: number;
  material?: string;
  created_at: string;
}

export interface ProductListItem {
  id: string;
  title: string;
  sku: string;
  price: number;
  image_url: string;
  category: ProductCategory;
  status: ProductStatus;
}

export interface ProductCustomization {
  color: string;
  material: string;
  engraving?: string;
}
