// src/firebase/api_insert_init_data.ts

import { doc, setDoc } from 'firebase/firestore'; // 💡 doc and setDoc are used for writing
import { db } from './config'; // 💡 db instance should be exported from your config file

// Data structure based on initial product data
const INIT_PRODUCTS_DATA: Record<string, any> = { // 💡 Added type assertion for better safety

    "P001": {
        companyName: "Chinook",
        images: [
            "products/P001_F.jpg",
            "products/P001_B.jpg",
        ], 
        isSoldOut: false,
        price: 115.20,
        quantityDescription: "6 X 1kg",
        title: "Akawi Cheese Jar",
        title_ar: ""
    },

    "P002": {
        companyName: "Chinook",
        images: [
            "products/P002_F.jpg",
            "products/P002_B.jpg",
        ], 
        isSoldOut: false,
        price: 115.20,
        quantityDescription: "6 X 1kg",
        title: "Haloumi Cheese Jar",
        title_ar: ""
    },
    "P003": {
        companyName: "Chinook",
        images: [
            "products/P003_F.jpg",
            "products/P003_B.jpg",
        ], 
        isSoldOut: false,
        price: 115.20,
        quantityDescription: "6 X 1kg",
        title: "Nabulsi Cheese Jar",
        title_ar: ""
    },
    "P004": {
        companyName: "Chinook",
        images: [
            "products/P004_F.jpg",
            "products/P004_B.jpg",
        ], 
        isSoldOut: false,
        price: 188.00,
        quantityDescription: "6 X 1kg",
        title: "String Cheese Jar",
        title_ar: "(Twisted)"
    },
    "P005": {
        companyName: "Chinook",
        images: [
            "products/P005_F.jpg",
            "products/P005_B.jpg",
        ], 
        isSoldOut: false,
        price: 188.00,
        quantityDescription: "6 X 1kg",
        title: "Braided Cheese Jar",
        title_ar: "(Mujadalh)"
    },
    "P006": {
        companyName: "Chinook",
        images: [
            "products/P006_F.jpg",
        ], 
        isSoldOut: false,
        price: 53.00,
        quantityDescription: "12 X 450g",
        title: "Labneh",
        title_ar: ""
    },
    "P007": {
        companyName: "Chinook",
        images: [
            "products/P007_F.jpg",
        ], 
        isSoldOut: false,
        price: 95.00,
        quantityDescription: "12 X 1kg",
        title: "Labneh",
        title_ar: ""
    },
    "P008": {
        companyName: "Chinook",
        images: [
            "products/P008_F.jpg",
        ], 
        isSoldOut: false,
        price: 144.00,
        quantityDescription: "12 X 400g",
        title: "Ghee",
        title_ar: ""
    },
    "P009": {
        companyName: "Chinook",
        images: [
            "products/P009_F.jpg",
        ], 
        isSoldOut: false,
        price: 254.00,
        quantityDescription: "12 X 800g",
        title: "Ghee",
        title_ar: ""
    },
    "P010": {
        companyName: "Chinook",
        images: [
            "products/P010_F.jpg",
        ], 
        isSoldOut: false,
        price: 148.00,
        quantityDescription: "2 Balls X 200g / 24 packs",
        title: "Shanklish",
        title_ar: ""
    },
};

/**
 * ONLY run this function ONCE to populate the Firestore database.
 * Uses the document key (P002, P003, etc.) as the Document ID.
 */
export const seedProductsForTesting = async (): Promise<void> => {
    console.log("Starting client-side product seeding...");

    try {
        const productIds = Object.keys(INIT_PRODUCTS_DATA);
        const promises = productIds.map(docId => {
            const data = INIT_PRODUCTS_DATA[docId];
            const docRef = doc(db, 'products', docId);
            // Use setDoc to explicitly define the document ID
            return setDoc(docRef, data);
        });

        await Promise.all(promises);
        console.log(`✅ Successfully seeded ${promises.length} product documents!`);
    } catch (error) {
        console.error("❌ Error during database seeding:", error);
    }
};

// 💡 You should also ensure any other API functions you need (like getAccessCode)
// are available either here or in a separate file (e.g., api.ts).