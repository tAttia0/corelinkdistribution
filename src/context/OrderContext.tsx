// src/context/OrderContext.tsx

import { createContext, useState, useContext, type ReactNode } from 'react';
// Assuming your types file exports all necessary interfaces
import type { Product, OrderState, OrderContextType, SelectedProduct } from '../types/order'; 

// --- Initial State ---

const initialOrderState: OrderState = {
  companyName: null, // Initialized as null for explicit check
  selectedProducts: [],
};

// --- Context Definition ---

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// --- Provider Component ---

export const OrderProvider = ({ children}: {children: ReactNode}) => {
  const [order, setOrder] = useState<OrderState>(initialOrderState);

  // Function to set the company name
  const setCompanyName = (name: string | null) => {
    setOrder(prev => ({ ...prev, companyName: name }));
  };

  /**
   * Function to add a product or update its quantity.
   * This is equivalent to your previous toggleProduct logic where quantity > 0.
   * This handles the required 'addProduct' signature.
   */
  const addProduct = (product: Product, quantity: number) => {
    if (quantity <= 0) return; // Only adds/updates if quantity is positive

    setOrder(prev => {
      const existingProduct = prev.selectedProducts.find(p => p.id === product.id);

      if (existingProduct) {
        // If the product exists, update its quantity
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.map(p =>
            p.id === product.id ? { ...p, quantity: quantity } : p
          ),
        };
      } else {
        // If the product is new, add it
        const newSelectedProduct: SelectedProduct = { ...product, quantity };
        return {
          ...prev,
          selectedProducts: [...prev.selectedProducts, newSelectedProduct],
        };
      }
    });
  };


  // Function to update quantity of an already selected product (used on summary page)
  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      // If quantity is 0 or less, remove the product
      setOrder(prev => ({
        ...prev,
        selectedProducts: prev.selectedProducts.filter(p => p.id !== productId),
      }));
    } else {
      // Update quantity
      setOrder(prev => ({
        ...prev,
        selectedProducts: prev.selectedProducts.map(p =>
          p.id === productId ? { ...p, quantity } : p
        ),
      }));
    }
  };

  // Function to clear the order state (for "Place Order" success or reset)
  const clearOrder = () => {
    setOrder(initialOrderState);
  };

  const contextValue: OrderContextType = {
    companyName: order.companyName,
    selectedProducts: order.selectedProducts,
    setCompanyName,
    addProduct, // 💡 FIX: Exposing the function expected by ProductSelectionPage.tsx
    updateProductQuantity,
    clearOrder,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

// --- Custom Hook ---

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};