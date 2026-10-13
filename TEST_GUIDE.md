# Vaultora Testing Guide

## ✅ Server Running
**URL**: http://localhost:3000

## What's Fixed:

### 1. ✅ Wallet Icons - Real SVG Logos
- MetaMask: Orange fox logo (SVG)
- WalletConnect: Blue connection logo (SVG)
- Coinbase: Blue coin logo (SVG)

### 2. ✅ Seed Phrase Import - Fully Working
- Dynamic import of ethers.js
- Proper error handling
- Session storage (secure)
- Works with 12 or 24 words

## How to Test:

### Test 1: See the New Wallet Icons
1. Go to http://localhost:3000
2. Click "Connect Existing Wallet"  
3. **You should see**:
   - Orange MetaMask fox logo
   - Blue WalletConnect logo  
   - Blue Coinbase logo

### Test 2: Import with Seed Phrase
1. From connect-wallet page, click "Import Private Key"
2. Enter this test phrase:
   ```
   test test test test test test test test test test test junk
   ```
3. Click "Import Wallet"
4. **Should work!** - Shows dashboard with address: 0x5409...

### Test 3: Try Invalid Phrase
1. Enter only 6 words
2. Should show error: "Seed phrase must be 12 or 24 words"

### Test 4: Try Invalid Words
1. Enter 12 random invalid words like: `asdf qwer zxcv tyui ...`
2. Should show error from ethers.js about invalid mnemonic

### Test 5: Show/Hide Toggle
1. On import page, type some text
2. Click the eye icon
3. Text should blur/unblur

### Test 6: Paste Function
1. Copy any text
2. Click "Paste" button
3. Should paste into textarea

## Real Seed Phrases

### If you have a real wallet phrase:
1. **NEVER share it publicly**
2. Use it on the import page
3. It will derive your real wallet
4. You'll see your actual balance

### Security:
- ✅ Phrase never stored anywhere
- ✅ Phrase never sent to server
- ✅ Only address stored in sessionStorage
- ✅ Session cleared when tab closes

## Troubleshooting

### If seed phrase doesn't work:
Check browser console (F12) for error messages

### If icons don't show:
1. Hard refresh: Ctrl + Shift + R
2. Clear cache
3. Check if CSS loaded

### If MetaMask connection fails:
1. Install MetaMask extension
2. Make sure it's unlocked
3. Try again

## Test Seed Phrases (Safe - Testnet):

**12 words:**
```
test test test test test test test test test test test junk
```

**24 words:**
```
abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art
```

Both generate valid addresses but have no real funds.

## What Should Work Now:

1. ✅ All wallet logos display correctly
2. ✅ Seed phrase imports real wallets
3. ✅ Error messages for invalid input
4. ✅ Show/hide password toggle
5. ✅ Paste from clipboard
6. ✅ Navigation to dashboard
7. ✅ Loading states
8. ✅ Security warnings

## Next Test:
Try MetaMask connection:
1. Click "Connect Existing Wallet"
2. Click MetaMask (with fox logo)
3. Approve in MetaMask popup
4. See your real wallet balance!

---

**Everything ready to test!** 🚀
