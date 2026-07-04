# Professional Developer Portfolio & Android Apps Showcase

A premium, responsive, and SEO-optimized software engineering portfolio website designed to showcase Android applications and web projects, featuring a fully secured administrative Content Management System (CMS) dashboard. Built with Next.js (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, and Firebase.

---

## 🚀 Key Features

* **Dynamic Landing Page**: Responsive hero, bilingual localization (English / Bangla), skills bars, featured apps, service cards, development workflow, and a verified contact form.
* **App Directory**: Live debounced search, taxonomies filtering, and popularity/feature sorting.
* **Dynamic App Details**: Large banners, screenshot sliders, changelogs, technologies badges, dynamic FAQ dropdowns, related apps suggestions, and app specifications (sizes, packages, rating).
* **Telegram Redirection Flow**: Downloads are logged to analytics and incremented in Firestore before redirecting users to the Telegram channel containing the verified APK files.
* **Fully Secured Admin Panel (`/admin`)**: Protected by Firebase Auth guards, featuring a stats dashboard, CRUD panels for Apps, Categories, Skills, Services, Testimonials, and Landing Page settings, and a contact Messages Inbox.
* **Firebase Storage Integration**: Directly upload logos, banners, and screenshots from the forms with progress loaders, plus manual URL override fallback inputs.
* **High Performance**: Optimized with Next.js image loading remote patterns, code splitting, and layout route groups.

---

## 🛠 Tech Stack

* **Core**: Next.js 15 (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS v3 (custom theme config + glassmorphism filters)
* **Animation**: Framer Motion
* **Database & Auth**: Firebase Auth, Cloud Firestore, Firebase Storage
* **Forms**: React Hook Form, Zod Validation, `@hookform/resolvers`
* **Icons**: React Icons (Fa, Fi, etc.)

---

## 📦 Local Installation Guide

### Prerequisites
* **Node.js** v20+ or v22+
* **npm** v10+
* A **Firebase Project** configured in the Firebase Console.

### Steps
1. Clone the repository and navigate to the directory:
   ```bash
   git clone <your-repo-url>
   cd Portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your Environment Variables:
   Copy the `.env.example` file to `.env.local` and fill in your Firebase Web App credentials:
   ```bash
   cp .env.example .env.local
   ```
   Modify `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

4. Run the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 🔥 Firebase Setup Guide

To initialize the database and access the admin panel, perform the following configurations in your Firebase console:

### 1. Authentication
* Go to **Build > Authentication** and click **Get Started**.
* Enable the **Email/Password** provider under Sign-in method.
* Create a user account (e.g., `admin@example.com` / `securepassword123`). This will be your login credentials for `/admin/login`.

### 2. Cloud Firestore
* Go to **Build > Firestore Database** and click **Create Database**.
* Start in **Production Mode**.
* Go to the **Rules** tab, paste the rules from `firebase/rules.txt`, and click **Publish**.

### 3. Firebase Storage
* Go to **Build > Storage** and click **Get Started**.
* Paste the Storage rules from `firebase/rules.txt` into the rules tab.
* In the **Cors** configuration of your bucket, make sure to allow reads from your domains (`localhost` and your custom Vercel domain) to prevent CORS errors during client-side canvas processing or direct fetch requests.

---

## ⚡ Vercel Deployment Instructions

The project is optimized for deployment on Vercel:

1. Push your local project code to a GitHub repository.
2. Log in to the [Vercel Dashboard](https://vercel.com) and click **Add New > Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add all keys from your `.env.local` file.
5. Click **Deploy**. Vercel will automatically compile the Next.js bundle and publish the project.
