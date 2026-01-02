// src/context/OrderContext.tsx

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { OrderContextType, OrderState, Product, SelectedProduct } from '../types/order';

// --- Initial State ---

const initialOrderState: OrderState = {
  companyName: null,
  city: null,
  whatsappNumber: null,
  selectedProducts: [],
};

// --- Context Definition ---

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// --- Provider Component ---

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<OrderState>(initialOrderState);

  // Function to set the company name
  const setCompanyName = (name: string | null) => {
    setOrder(prev => ({ ...prev, companyName: name }));
  };

  const setCity = (cityName: string | null) => {
    setOrder(prev => ({ ...prev, city: cityName }));
  };

  const setWhatsappNumber = (number: string) => {
    setOrder(prev => ({ ...prev, whatsappNumber: number }));
  };

  /**
   * Function to add a product or update its quantity.
   * Fixed: Now correctly removes the product if quantity is 0.
   */
  const addProduct = (product: Product, quantity: number) => {
    setOrder(prev => {
      const existingProduct = prev.selectedProducts.find(p => p.id === product.id);

      // 1. Handle Removal (If quantity is 0 or less)
      if (quantity <= 0) {
        if (!existingProduct) return prev; // Nothing to remove
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.filter(p => p.id !== product.id),
        };
      }

      // 2. Handle Update (If product exists)
      if (existingProduct) {
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.map(p =>
            p.id === product.id ? { ...p, quantity: quantity } : p
          ),
        };
      }

      // 3. Handle Add (If product is new)
      const newSelectedProduct: SelectedProduct = { ...product, quantity };
      return {
        ...prev,
        selectedProducts: [...prev.selectedProducts, newSelectedProduct],
      };
    });
  };

  // Function to update quantity on the summary page
  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setOrder(prev => ({
        ...prev,
        selectedProducts: prev.selectedProducts.filter(p => p.id !== productId),
      }));
    } else {
      setOrder(prev => ({
        ...prev,
        selectedProducts: prev.selectedProducts.map(p =>
          p.id === productId ? { ...p, quantity } : p
        ),
      }));
    }
  };

  // Function to clear the order state while preserving the WhatsApp number
  const clearOrder = () => {
    setOrder(prev => ({
      ...initialOrderState,
      whatsappNumber: prev.whatsappNumber,
    }));
  };

  const contextValue: OrderContextType = {
    companyName: order.companyName,
    city: order.city,
    whatsappNumber: order.whatsappNumber,
    selectedProducts: order.selectedProducts,
    setCompanyName,
    setCity,
    setWhatsappNumber,
    addProduct,
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