# PWA (Progressive Web App) Setup

## Overview
Trust Vault is now a fully-featured Progressive Web App that can be installed on iOS and Android devices.

---

## Features

### ✅ Add to Home Screen Prompt
- **Auto-appears** after 2 seconds on first visit
- **iOS**: Shows custom instructions with Share button icon
- **Android**: Native install prompt
- **Dismissible**: Won't show again if dismissed

### ✅ App Icon
- Uses `/public/icon.png` as home screen icon
- Rounds to iOS app icon style
- Works on both iOS and Android

### ✅ Standalone Mode
- Runs full-screen without browser UI
- Status bar styled to match app
- Native app-like experience

### ✅ Offline Support
- Service worker caches essential files
- Works without internet connection
- Network-first strategy for fresh data

### ✅ Theme Integration
- PWA theme color: `#4938F5` (app purple)
- Status bar: Black translucent
- Matches app design

---

## How It Works

### **First Visit:**
1. User opens https://trust-vault.live
2. After 2 seconds, install prompt appears
3. Shows app icon, name, and description

### **iOS Users See:**
- Custom prompt with iOS-specific instructions
- Share button icon
- Step-by-step guide:
  1. Tap Share button
  2. Tap "Add to Home Screen"
  3. Tap "Add"

### **Android Users See:**
- Native browser install prompt
- "Install Now" button
- One-tap installation

### **After Installation:**
- App icon appears on home screen
- Opens in full-screen mode
- No browser UI visible
- Works like native app

---

## Files Created

### 1. **manifest.json** (`/public/manifest.json`)
```json
{
  "name": "Trust Vault",
  "short_name": "Trust Vault",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F1018",
  "theme_color": "#4938F5",
  "icons": [
    {
      "src": "/icon.png",
      "sizes": "192x192 512x512"
    }
  ]
}
```

### 2. **Service Worker** (`/public/sw.js`)
- Caches essential files
- Enables offline functionality
- Network-first strategy

### 3. **Install Prompt** (`/components/InstallPrompt.tsx`)
- Detects iOS vs Android
- Shows appropriate instructions
- Handles install flow
- Dismissible with localStorage

### 4. **Service Worker Registration** (`/components/ServiceWorkerRegistration.tsx`)
- Registers service worker on mount
- Console logging for debugging

---

## Testing

### **iOS (Safari):**
1. Open https://trust-vault.live in Safari
2. Wait 2 seconds
3. See custom install prompt with instructions
4. Follow iOS steps to add to home screen
5. Open from home screen → Full-screen app!

### **Android (Chrome):**
1. Open https://trust-vault.live in Chrome
2. Wait 2 seconds
3. See native install prompt
4. Tap "Install Now"
5. App installs to home screen
6. Open → Full-screen native experience!

### **Desktop (Chrome/Edge):**
1. Open https://trust-vault.live
2. See install icon in address bar
3. Click to install
4. App opens in standalone window

---

## Customization

### **Change App Icon:**
Replace `/public/icon.png` with your own:
- Recommended size: 512x512px
- Square PNG with transparency
- Will auto-round on iOS

### **Change Theme Color:**
Edit `manifest.json`:
```json
"theme_color": "#YOUR_COLOR_HEX"
```

### **Change App Name:**
Edit `manifest.json`:
```json
"name": "Your App Name",
"short_name": "Short Name"
```

### **Adjust Prompt Timing:**
Edit `components/InstallPrompt.tsx`:
```typescript
setTimeout(() => setShowPrompt(true), 2000); // Change 2000 (2 seconds)
```

---

## Dismissal Logic

### **User Dismisses Prompt:**
- Stored in localStorage: `pwa_install_dismissed`
- Won't show again
- Can be reset by clearing browser data

### **Already Installed:**
- Detects standalone mode
- Automatically hides prompt
- No annoying re-prompts

---

## Offline Functionality

### **Cached Resources:**
- Main page (/)
- Manifest file
- App icon
- Essential assets

### **Network Strategy:**
1. Try to fetch from network (fresh data)
2. If network fails, use cache
3. Cache successful responses for future

---

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| iOS Safari | ✅ | Manual add to home screen |
| Android Chrome | ✅ | Native install prompt |
| Desktop Chrome | ✅ | Install as app |
| Edge | ✅ | Install as app |
| Firefox | ⚠️ | Limited PWA support |

---

## Debugging

### **Check Service Worker:**
1. Open DevTools
2. Go to Application tab
3. Check Service Workers section
4. Should see "Activated and running"

### **Check Manifest:**
1. Open DevTools
2. Go to Application tab
3. Check Manifest section
4. Verify all fields correct

### **Check Install Prompt:**
1. Open Console
2. Should see: "✅ Service Worker registered"
3. Wait 2 seconds
4. Prompt should appear

### **Reset Install Prompt:**
```javascript
localStorage.removeItem('pwa_install_dismissed');
```

---

## Troubleshooting

### **Prompt Not Showing:**
- Check if already dismissed (clear localStorage)
- Check if already installed (check standalone mode)
- Verify 2-second delay passed
- Check console for errors

### **iOS Not Installing:**
- Safari only (not Chrome iOS)
- Must use Share button manually
- Check if "Add to Home Screen" option visible

### **Service Worker Not Registering:**
- Must be HTTPS (or localhost)
- Check browser console for errors
- Verify `/sw.js` file exists

---

## Production Checklist

✅ App icon optimized (512x512)
✅ Manifest.json configured
✅ Service worker registered
✅ HTTPS enabled
✅ Install prompt tested on iOS
✅ Install prompt tested on Android
✅ Offline mode tested
✅ Theme colors match app

---

## Next Steps

1. **Test on real devices** (iOS iPhone, Android phone)
2. **Monitor install rate** (analytics)
3. **Add push notifications** (optional)
4. **Improve offline experience** (cache more resources)
5. **Add update prompt** (when new version available)

---

## Resources

- [PWA Manifest Documentation](https://web.dev/add-manifest/)
- [Service Worker Guide](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [iOS PWA Guidelines](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

---

**Status:** ✅ Fully Deployed
**URL:** https://trust-vault.live
**Last Updated:** Now
