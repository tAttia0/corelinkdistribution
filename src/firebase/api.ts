// src/firebase/api.ts

import { db, storage } from './config';
import { doc, getDoc, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import type { Product, SelectedProduct } from '../types/order'; // Import necessary types

// --- 1. Order Saving Types ---

export interface OrderPayload {
  companyName: string;
  selectedProducts: SelectedProduct[]; 
  totalAmount: number;
}

// --- 2. Image Retrieval Helper ---

/**
 * Converts a storage path (e.g., 'products/p001/image1.jpg') 
 * into a public download URL using Firebase Storage.
 */
const getImageUrl = async (path: string): Promise<string> => {
    try {
        const imageRef = ref(storage, path);
        const url = await getDownloadURL(imageRef);
        return url;
    } catch (error) {
        console.error(`Error fetching image URL for path: ${path}`, error);
        // Fallback placeholder image
        return 'https://via.placeholder.com/300x200?text=Image+Missing'; 
    }
};

// --- 3. Access Code Function ---

/**
 * Fetches the required access code from the 'settings/app_control' document.
 */
export const getAccessCode = async (): Promise<string | null> => {
  try {
    const docRef = doc(db, 'settings', 'app_control'); 
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().accessCode || null; 
    }
    return null;
  } catch (error) {
    console.error("Error fetching access code:", error);
    return null;
  }
};

// --- 4. Product Fetching Function ---

/**
 * Fetches all products from the Firestore 'products' collection, 
 * converting Storage paths in the 'images' field into public URLs.
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const productsCollectionRef = collection(db, 'products');
  try {
    const snapshot = await getDocs(productsCollectionRef);
    
    if (snapshot.empty) {
        console.log("No products found in Firestore.");
        return [];
    }

    const productsPromises = snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const imagePaths: string[] = data.images || []; // Firestore field holds paths
      
      // Convert all image paths for this product into public URLs concurrently
      const imageUrlsPromises = imagePaths.map(getImageUrl);
      const imageUrls = await Promise.all(imageUrlsPromises);

      return {
        id: doc.id,
        ...data,
        images: imageUrls, // 💡 Replace paths with actual URLs
      } as Product;
    });

    return await Promise.all(productsPromises);

  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// --- 5. Order Saving Function ---

/**
 * Saves the final customer order to the 'orders' collection.
 * Returns the newly created Order ID.
 */
export const saveOrder = async (orderData: OrderPayload): Promise<string> => {
  const ordersCollectionRef = collection(db, 'orders');
  
  try {
    const docRef = await addDoc(ordersCollectionRef, {
      ...orderData,
      // Add a server timestamp for accurate order tracking
      orderDate: serverTimestamp(),
      status: 'New', // Initial status
    });
    
    // Return the newly generated document ID
    return docRef.id;
  } catch (error) {
    console.error("Error saving order:", error);
    throw new Error("Failed to save order to the database.");
  }
};