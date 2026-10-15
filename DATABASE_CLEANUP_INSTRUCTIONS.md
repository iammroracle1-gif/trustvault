# Database Cleanup Instructions

## Problem Summary

The database has users marked as `status='deleted'` that need to be permanently removed. When trying to register with emails that were previously deleted, the system says "Email already registered" because the user record still exists in the database.

## Current Database State

Based on the latest check:
- **Total users**: 3
- **Active**: 1 (abonejoseph@gmail.com)
- **Deleted**: 2 (mainoracle10@gmail.com, deoraclee@gmail.com)

## Solution

### Option 1: Use the Cleanup Page (Recommended)

1. **Navigate to the cleanup page**:
   ```
   https://trustvault-beige.vercel.app/admin/cleanup
   ```

2. **Enter admin password**: `admin123`

3. **Click "Delete All Deleted Users"**

4. **Result**: All users with status='deleted' will be permanently removed from the database

### Option 2: Use the Database Management Page

1. **Navigate to**:
   ```
   https://trustvault-beige.vercel.app/admin/database
   ```

2. **View all users** with their status

3. **For each deleted user**:
   - Click "Permanently Delete"
   - Enter admin password: `admin123`
   - Confirm deletion

## What Was Fixed

### 1. CORS Issues
- Added proper CORS headers to the cleanup endpoint
- Added OPTIONS handler for preflight requests
- All responses now include CORS headers

### 2. Missing Tables Error
- The `deposit_requests` table doesn't exist yet
- Created new endpoint `/api/admin/cleanup-direct` that handles missing tables gracefully
- Directly deletes users without trying to clean up related tables

### 3. New Endpoints Created

#### `/api/admin/cleanup-direct`
- Simple, direct deletion of users with status='deleted'
- Handles missing tables gracefully
- Includes CORS support
- Admin password protected

### 4. Updated Pages

#### `/admin/cleanup`
- Now uses `cleanup-direct` endpoint
- Better error messages
- Shows exactly which users were deleted
- Displays full API response for debugging

#### `/admin/database` (NEW)
- View all users and their status
- See database statistics
- Individually delete users marked as deleted
- Quick access to cleanup function

## After Cleanup

Once deleted users are removed, you can:

1. **Register with previously deleted emails** - They will now be available
2. **Test the full workflow**:
   - Register new account
   - Import wallet
   - Receive notifications
   - Get email alerts

## Important Notes

- **The active user** `abonejoseph@gmail.com` will NOT be deleted (status='active')
- If you want to re-register with `abonejoseph@gmail.com`, you need to:
  1. Delete that user from admin panel first
  2. Run cleanup
  3. Then register again

## Testing the Fix

1. Run cleanup at `/admin/cleanup`
2. Check result shows 2 users deleted
3. Try registering with `mainoracle10@gmail.com` or `deoraclee@gmail.com`
4. Should work without "Email already registered" error

## Admin Dashboard Access

Navigate to: `https://trustvault-beige.vercel.app/admin/dashboard`

Enter password: `admin123`

From there you can access:
- User Management
- Database Management (NEW)
- Cleanup Tools
