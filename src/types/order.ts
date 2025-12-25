// src/types/order.ts

export interface Product {
  id: string;
  title: string;
  quantityDescription: string;
  title_ar: string; 
  City: string;
  companyName:string;
  isSoldOut: boolean;
  price: number;
  images: string[]; 
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