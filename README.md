# Baby Growth Tracker PWA 👶📈

![App Screenshot](./screenshot.png)

A modern, responsive, privacy-focused Progressive Web Application (PWA) to track your baby's weight, height, and head circumference, and visualize their growth against the official World Health Organization (WHO) child growth standards (0-24 months).

## Features

- **Comprehensive Tracking**: Log Weight (kg), Length/Height (cm), and Head Circumference (cm).
- **Interactive History**: View all past records in a clean list with full inline editing support. Update metrics or change dates on the fly.
- **Privacy First (Local Storage)**: All data including baby profile and records are stored completely locally on your device using `localStorage`. No data is ever sent to a server.
- **Progressive Web App (PWA)**: Designed to be installable on your mobile device. You can "Add to Home Screen" to use it just like a native app. Includes a smart update prompt so you instantly get the latest features when a new version is released.
- **WHO Growth Curves Integration**: Automatically plots your baby's metrics over the official WHO percentiles reference curves (3rd, 15th, 50th, 85th, and 97th percentiles) for boys and girls. Tab between metrics to instantly compare their development.
- **Premium UI & UX**: Hand-crafted UI with pure Vanilla CSS featuring glassmorphism elements, soft gradients, responsive design, and smooth micro-animations. Support for both light and dark system preferences.
- **Interactive Charts**: Powered by Recharts for a dynamic, hoverable overview of the growth trajectory across all three key metrics.

## Technology Stack

- **React 18** & **Vite**
- **TypeScript** for robust type safety
- **Vanilla CSS** with modern CSS Variables design system
- **Recharts** for visualizing the growth curve
- **Lucide React** for beautiful, consistent iconography
- **vite-plugin-pwa** for generating the Service Worker and Web Manifest

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation & Running Locally

1. Clone the repository:
   ```bash
   git clone git@github.com:tiant167/baby-weight-tracker.git
   cd baby-weight-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

## Deployment

Because this app operates entirely on the client-side (no backend required), it's completely straightforward to deploy to modern static hosting services like Vercel, Netlify, or GitHub Pages. 

### Deploying to Vercel

1. Push your code to your GitHub repository.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
3. Click **Add New... > Project**.
4. Import your `baby-weight-tracker` repository.
5. Vercel will automatically detect Vite. The default build settings (`npm run build` as Build Command and `dist` as Output Directory) are correct.
6. Click **Deploy**.

## License

MIT License
