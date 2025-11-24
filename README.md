# Interlock - Custom Wooden Puzzle Creator

Transform your favorite memories into handcrafted wooden puzzles. Choose from two thoughtful paths: create a collaborative puzzle with someone special, or design a personal gift filled with meaningful moments.

## 🎨 Design Philosophy

This application features a warm **Digital Scrapbook** aesthetic with:
- Handcrafted feel with paper textures and organic shapes
- Warm color palette: Cream, Terracotta, Sage, and Stone
- Serif typography (Fraunces) for headings, rounded sans-serif (Quicksand) for body text
- Polaroid-style previews and washi tape effects
- Tactile interactions with stamp-press buttons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v18.0 or higher ([Download](https://nodejs.org/))
- **npm** v9.0 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

Check your versions:
```bash
node --version
npm --version
git --version
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd custom-shape-puzzle
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI components
- Framer Motion

### 3. Start Development Server
```bash
npm run dev
```

The application will open at **http://localhost:5173**

The dev server features:
- ⚡ Hot Module Replacement (HMR) - instant updates
- 🔍 Type checking in the background
- 🎨 Tailwind CSS JIT compilation

### 4. Preview the Application

Open your browser and navigate to the local development URL. You'll see:
- **Homepage** with two product options: "Together" ($65) and "For Someone Special" ($65)
- **Shape Selection** with 100+ meaningful shapes across 12 categories
- **Design Customization** with photo upload or color mapping
- **Box Design** with standard or mystery options
- **Checkout** with optional Keepsake Edition upgrade ($139 total)
- **Order Confirmation** with referral incentives

## 🏗️ Building for Production

### Create Production Build
```bash
npm run build
```
This command:
1. Type-checks your TypeScript code
2. Optimizes and bundles assets with Vite
3. Outputs production files to the `dist/` directory

### Preview Production Build Locally
```bash
npm run preview
```
Access the production build at **http://localhost:4173**

## 🚢 Deployment Options

### Option 1: Vercel (Recommended)
**Why Vercel?**
- Zero-config deployment for Vite apps
- Automatic HTTPS and CDN
- Instant rollbacks
- Preview deployments for branches

**Steps:**
1. Install Vercel CLI:
```bash
npm install -g vercel
```
2. Deploy:
```bash
vercel
```
3. Follow the prompts to link your project
4. For production deployment:
```bash
vercel --prod
```
**Using Vercel Dashboard:**
1. Visit [vercel.com](https://vercel.com)
2. Import your Git repository
3. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click "Deploy"

### Option 2: Netlify
**Steps:**
1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```
2. Build the project:
```bash
npm run build
```
3. Deploy:
```bash
netlify deploy --prod --dir=dist
```
**Using Netlify Dashboard:**
1. Visit [netlify.com](https://netlify.com)
2. Drag and drop the `dist/` folder
3. Or connect your Git repository with these settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

### Option 3: GitHub Pages
1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```
2. Add to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```
3. Update `vite.config.ts` with your repository name:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```
4. Deploy:
```bash
npm run deploy
```

### Option 4: AWS S3 + CloudFront
1. Build the project:
```bash
npm run build
```
2. Install AWS CLI and configure credentials
3. Create S3 bucket and enable static website hosting
4. Upload files:
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```
5. (Optional) Set up CloudFront distribution for CDN and HTTPS

## 📁 Project Structure
```
custom-shape-puzzle/
├── public/              # Static assets
├── src/
│   ├── components/
│   │   ├── ui/         # Reusable UI primitives (Button, Card, Input)
│   │   ├── HomePage.tsx
│   │   ├── ShapeSelection.tsx
│   │   ├── DesignChoice.tsx
│   │   ├── BoxDesign.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── PartnerWaiting.tsx
│   │   ├── PuzzlePiece.tsx
│   │   ├── ShapeIcon.tsx
│   │   └── TemplatePreview.tsx
│   ├── lib/
│   │   ├── constants.ts   # Shape library (100+ shapes), pricing
│   │   ├── types.ts       # TypeScript definitions
│   │   └── utils.ts       # Utility functions
│   ├── App.tsx            # Main app component with routing logic
│   ├── index.css          # Global styles, design system tokens
│   └── main.tsx           # App entry point
├── index.html             # HTML entry, Google Fonts
├── tailwind.config.js     # Tailwind customization
├── vite.config.ts         # Vite build configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🛠️ Technology Stack
### Core Framework
- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server

### Styling
- **Tailwind CSS v4** - Utility-first CSS with custom design tokens
- **CSS Custom Properties** - For theming (colors, fonts)
- **Radix UI** - Accessible, unstyled component primitives

### Animation & Interaction
- **Framer Motion** - Smooth animations and transitions
- **Phosphor Icons** - Beautiful icon library

### Typography
- **Google Fonts** - Fraunces (serif), Quicksand (sans-serif), Caveat (handwriting)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript Compiler** - Type checking

## 🎨 Design System
### Color Palette
- **Cream** (#F9F7F2) - Primary background
- **Charcoal** (#3C3633) - Text color
- **Terracotta** (#E07A5F) - Primary accent
- **Sage** (#81B29A) - Secondary accent
- **Stone** (#E8E3DC) - Borders and subtle backgrounds

### Typography
- **Headings:** Fraunces (serif, 9-144 optical sizing)
- **Body:** Quicksand (rounded sans-serif, 400-700 weight)
- **Accents:** Caveat (handwritten, 400-700 weight)

### Texture & Effects
- **Paper Texture:** 3% opacity SVG noise overlay
- **Shadows:** Colored shadows using Terracotta and Sage
- **Borders:** 2px Stone borders, rounded corners
- **Buttons:** Stamp-press effect with translateY animation

## 🐛 Troubleshooting
### Port Already in Use
If port 5173 is occupied:
```bash
npm run dev -- --port 3000
```
### Build Fails with Type Errors
Run type checking separately:
```bash
npx tsc --noEmit
```
### Fonts Not Loading
1. Check `index.html` for Google Fonts link
2. Verify CSS variables in `src/index.css`:
```css
--font-fraunces: 'Fraunces', serif;
--font-quicksand: 'Quicksand', sans-serif;
--font-caveat: 'Caveat', cursive;
```
### Tailwind Classes Not Working
1. Clear Tailwind cache:
```bash
rm -rf node_modules/.cache
```
2. Restart dev server:
```bash
npm run dev
```
### Module Not Found Errors
Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🔧 Environment Variables
This project currently runs entirely client-side with no backend. For future payment processing or API integration:
1. Create `.env` file in project root
2. Add variables (never commit sensitive keys):
```env
VITE_API_URL=your_api_url
VITE_STRIPE_KEY=your_stripe_public_key
```
3. Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## ⚡ Performance Optimization
- **Code Splitting:** React.lazy() for route-based splitting
- **Image Optimization:** Use WebP format, lazy loading
- **Bundle Analysis:** Run `npm run build -- --mode analyze`
- **CDN:** Deploy static assets to CDN (Cloudflare, AWS CloudFront)
- **Caching:** Configure cache headers for static assets

## 📦 Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🚀 Ready to Launch?
1. ✅ Run `npm run build` to create production build
2. ✅ Test with `npm run preview` locally
3. ✅ Choose deployment platform (Vercel recommended)
4. ✅ Deploy and share your custom puzzle creator!

## 📝 Product Overview
### Two Paths at $65
- **Together:** Collaborative puzzle where two people each choose 5 meaningful shapes
- **For Someone Special:** Solo design with 10 pieces capturing private moments

### Premium Tier at $139
- **Keepsake Edition Upgrade** (+$74):
  - Solid walnut storage box with custom engraved dedication
  - Printed linen "Our Story" card explaining all ten pieces
  - Premium gift wrapping + handwritten note
  - Chosen by 68% of anniversary couples

### Features
- 100+ shapes across 12 categories (flora, fauna, celestial, creative, etc.)
- Photo upload or color mapping for each piece
- Standard or mystery box design (hints laser-engraved on lid)
- Free shipping in the US
- Ships within 2 weeks
- Handcrafted with love

---
Built with ❤️ using React, TypeScript, and Tailwind CSS
