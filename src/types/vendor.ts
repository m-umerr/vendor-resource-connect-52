

export type ResourceCategory = 
  | "Material" 
  | "Equipment" 
  | "Labor" 
  | "Subcontractor" 
  | "Other";

export type ResourceUnit = 
  | "Each" 
  | "Hour" 
  | "Day" 
  | "Week" 
  | "Month" 
  | "Square Foot" 
  | "Cubic Yard" 
  | "Ton";

export interface Vendor {
  id: string;
  name: string;
  logo?: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  rating: number;
  location: string;
}

export interface Resource {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  category: ResourceCategory;
  price: number;
  unit: ResourceUnit;
  availability: string;
  imageUrl: string;
  featured: boolean;
  specifications?: Record<string, string | number> | null;
  createdAt: string;
}

export interface ResourceFilter {
  search: string;
  category: ResourceCategory | "All";
  minPrice: number | null;
  maxPrice: number | null;
  vendorId: string | null;
}

