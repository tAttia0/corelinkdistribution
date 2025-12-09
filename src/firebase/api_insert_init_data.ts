// src/firebase/api_insert_init_data.ts

import { doc, setDoc } from 'firebase/firestore'; // 💡 doc and setDoc are used for writing
import { db } from './config'; // 💡 db instance should be exported from your config file

// Data structure based on initial product data
const INIT_PRODUCTS_DATA: Record<string, any> = { // 💡 Added type assertion for better safety

    "P001": {
        "images": ["https://picsum.photos/300/200?random=akawi1"],
        "price": 30,
        "title": "Chinook Cheese: Akawi",
        "title_ar": "جبنة عكاوي"
    },

    "P002": {
        "images": ["https://picsum.photos/300/200?random=akawi2"],
        "price": 30,
        "title": "Chinook Cheese: Braided Cheese",
        "title_ar": "جبنة مجدلة"
    },
    "P003": {
        "images": ["https://picsum.photos/300/200?random=akawi3"],
        "price": 30,
        "title": "Chinook Cheese: Ghee",
        "title_ar": "سمن عربي بلدي"
    },
    "P004": {
        "images": ["https://picsum.photos/300/200?random=akawi4"],
        "price": 30,
        "title": "Chinook Cheese: String_Cheese",
        "title_ar": "جبنة مشللة"
    },
    "P005": {
        "images": ["https://picsum.photos/300/200?random=akawi5"],
        "price": 30,
        "title": "Chinook Cheese: Haloumi",
        "title_ar": "جبنة حلومي"
    },
    "P006": {
        "images": ["https://picsum.photos/300/200?random=akawi6"],
        "price": 30,
        "title": "Chinook Cheese: Labneh",
        "title_ar": "لبنه"
    },
    "P007": {
        "images": ["https://picsum.photos/300/200?random=akawi7"], // Changed random seed to 7
        "price": 30,
        "title": "Chinook Cheese: Nabulsi",
        "title_ar": "جبنة نابولسي"
    }
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