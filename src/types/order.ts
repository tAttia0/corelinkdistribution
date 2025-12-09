// src/types/order.ts

// ⚠️ DELETED: We no longer use this complex structure, we use string[]
// export interface ProductImage {
//  id: number;
//  url: string; // Placeholder, will be Firebase storage URL
// }

export interface Product {
  id: string;
  title: string;
  title_ar: string; // Arabic product title (from our latest discussion)
  // ⚠️ DELETED: We removed these from the Firestore structure to simplify
  // description: string;
  // description_ar: string; 
  price: number;
  images: string[]; // 💡 FIX 1: Simplified to use an array of strings (URLs)
}

export interface SelectedProduct extends Product {
  quantity: number;
}

export interface OrderState {
  companyName: string | null;
  selectedProducts: SelectedProduct[];
}

export interface OrderContextType extends OrderState {
  setCompanyName: (name: string | null) => void; // Allow setting back to null/clearing
  
  // 💡 FIX 2: Changed to 'addProduct' to match the component and context implementation
  addProduct: (product: Product, quantity: number) => void; 
  
  updateProductQuantity: (productId: string, quantity: number) => void;
  clearOrder: () => void;
}