# Quick Installation Guide

## The npm slowness issue - Here are your options:

### Option 1: Use Yarn (Usually Faster)
```bash
npm install -g yarn
cd vaultora
yarn install
yarn dev
```

### Option 2: Use pnpm (Fastest)
```bash
npm install -g pnpm
cd vaultora
pnpm install
pnpm dev
```

### Option 3: Standard npm with clean cache
```bash
cd vaultora
npm cache clean --force
npm install --legacy-peer-deps
npm run dev
```

### Option 4: Offline from another machine
If you have another computer with better connection:
1. Run `npm install` there
2. Copy the entire `node_modules` folder
3. Paste it into your vaultora directory
4. Run `npm run dev`

## What's Already Built

✅ **Complete UI Structure**
- Splash screen with animated logo
- Welcome/onboarding screen
- Wallet connection options
- View-only wallet tracker
- Full dashboard with:
  - Portfolio overview
  - Asset list
  - Transaction history
  - Send/Receive buttons

✅ **Design System**
- Custom Vaultora color palette
- Responsive layouts
- Dark mode optimized
- Premium feel with animations

✅ **Navigation Flow**
- Smooth routing between all screens
- Back navigation
- Demo data clearly labeled

## Once Dependencies Install

Just run:
```bash
npm run dev
```

Then open: http://localhost:3000

The app will work immediately!
