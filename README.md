# CoreLink Distribution Platform
**A high-performance link management and distribution system built with the modern web stack.**

## 🚀 The Vision
CoreLink is designed for scalability and speed. It serves as a central hub for managing and distributing links efficiently, ensuring that startups and businesses can track their digital assets with a **"pixel-perfect"** user interface and robust logic.

## 🕹️ Interactive Demo
To explore the live application, use the following credentials on the login screen:
* **Company Name:** Any name
* **City:** Any city
* **Access Code:** `1234`

**🔗 Live Link:** [https://corelinkdistribution-app.web.app/](https://corelinkdistribution-app.web.app/)

## 🛠️ Tech Stack
* **Frontend:** React, TypeScript, Tailwind CSS, Material UI
* **Backend:** Firebase (Firestore, Hosting, Auth logic)
* **Architecture:** Component-based architecture optimized for high-performance data flow.

## ✨ Key Features
* **Real-time Sync:** Leverages **Firebase Firestore** for live order data management and persistence.
* **Responsive Dashboard:** Fully optimized for Mobile, Tablet, and Desktop views.
* **Serverless Architecture:** Deployed via Firebase Hosting for **99.9% uptime** and zero server maintenance.
* **Type-Safe Development:** Leveraging TypeScript to ensure data integrity across the entire application.

## 🧠 Technical Challenges & Solutions

### 1. Real-time State Synchronization
**Challenge:** Ensuring that the "Order Summary" stayed perfectly in sync with the product selection across different devices while minimizing database reads.
**Solution:** Implemented custom hooks to manage Firestore listeners, ensuring data only updates when changes occur. This keeps the UI snappy and optimizes Firebase resource usage.

### 2. Complex Responsive Layouts
**Challenge:** Displaying high-density product cards and order summaries that remain functional on small mobile screens.
**Solution:** Utilized **Tailwind CSS Grid and Flexbox** combined with **Material UI components** to create a fluid layout that prioritizes information hierarchy based on screen size.

### 3. Secure Gated Access
**Challenge:** Creating a simple yet secure way for authorized users to enter the distribution flow without a complex signup process.
**Solution:** Developed a lightweight authentication logic using an **Access Code** validation system that interacts with the backend to unlock the application state.

## 📦 Getting Started
### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Installation
1. Clone the repository
   ```bash
    git clone [https://github.com/tAttia0/corelinkdistribution.git](https://github.com/tAttia0/corelinkdistribution.git)

2. install dependencies
   ```bash
    npm install

3. Start the development server
   ```bash
    npm run dev

# 👨‍💻 About the Developer
I am a Full Stack Developer specializing in Frontend Startup solutions. I bridge the gap between complex business requirements and intuitive user interfaces.

### Location: Serving all of New Jersey (NJ/NYC) & Remote.
### LinkedIn: linkedin.com/in/tattia0
### Services: MVP Development, UI/UX Implementation, and Custom Software Solutions.

## 📱 Responsive UI Showcase
|| Desktop View | Tablet View | Mobile View |
| :--- | :--- | :--- | :--- |
|Login | ![Desktop](screenshots/screen_1.jpg) | ![Tablet](screenshots/screen_1.jpg) | ![Mobile](screenshots/screen_1.jpg) |
|Selection | ![Desktop](screenshots/screen_2_desktop.jpg) | ![Tablet](screenshots/screen_2_Tablet.jpg) | ![Mobile](screenshots/screen_2_Mobile.jpg) |
|Summary | ![Desktop](screenshots/screen_3_desktop.jpg) | ![Tablet](screenshots/screen_3_Tablet.jpg) | ![Mobile](screenshots/screen_3_Mobile.jpg) |