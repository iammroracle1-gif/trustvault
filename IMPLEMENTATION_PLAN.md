# Vaultora Implementation Plan

## ✅ COMPLETED
1. Wallet customization reflects on dashboard
2. Wallet persistence with localStorage
3. Real-time crypto prices fixed

## 🔨 IN PROGRESS

### 1. Perps/DApps Page (Browser)
Trust Wallet iOS has a "Browser" tab for accessing DApps. We'll create a similar page with:
- DApp Browser UI
- Popular DApps list
- Search functionality
- Perps/DEX shortcuts (Uniswap, dYdX, GMX, etc.)

### 2. Notifications Page
From Trust Wallet iOS `NotificationsViewController.swift`:
- Notification list with icons
- Counters/badges
- Categories: Transactions, Price Alerts, News
- Settings toggle
- Empty state

### 3. Settings Pages
From Trust Wallet iOS Settings structure:
- ✅ Main Settings (exists)
- Profile/Wallet Management
- Security (Passcode, Biometrics, Backup)
- Networks/RPCs
- Browser Configuration
- Notifications Settings
- Privacy Policy
- Terms of Service
- About
- Developer Options

## 📋 TASK BREAKDOWN

### TASK 1: Create Perps/DApps Browser Page
**File**: `app/perps/page.tsx` (or `app/browser/page.tsx`)
**Features**:
- Header with search
- Popular DApps grid
- Categories: DeFi, NFT, Games, Perps
- Quick actions: Uniswap, PancakeSwap, dYdX, GMX
- Recent/Favorites
- WebView integration (iframe for now)

### TASK 2: Notifications System
**Files**:
- `app/notifications/page.tsx`
- `components/NotificationBadge.tsx`
**Features**:
- Notification counter badge
- List of notifications with icons
- Swipe to delete
- Mark as read
- Empty state
- Categories/filters

### TASK 3: Complete Settings Pages
**Files to create**:
- `app/settings/profile/page.tsx`
- `app/settings/security/backup/page.tsx`
- `app/settings/networks/page.tsx`
- `app/settings/browser/page.tsx`
- `app/settings/notifications/page.tsx`
- `app/settings/privacy/page.tsx`
- `app/settings/terms/page.tsx`
- `app/settings/about/page.tsx`

**From Trust Wallet iOS Settings**:
```swift
Settings
├── Wallets (wallet management)
├── Security (passcode, biometrics, backup)
├── Networks (RPC endpoints)
├── Browser (DApp settings)
├── Notifications (push settings)
├── Currency (fiat selection)
├── About (version, support)
├── Privacy Policy
└── Terms of Service
```

## 🎨 UI REFERENCES
- Trust Wallet iOS master folder: `Trust/Settings/ViewControllers/`
- Use same dark theme: `#0F1018`, `#191C2A`, `#202437`
- Icons from Trust Wallet: `Trust/Assets.xcassets/settings_*`
- Navigation: iOS-style back button

## 🚀 EXECUTION ORDER
1. ✅ Fix wallet customization persistence
2. 🔨 Create Perps/Browser page
3. 🔨 Add notification badge + page
4. 🔨 Complete all settings pages
5. ✅ Test everything
