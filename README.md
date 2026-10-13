# Trust Vault 🔐

A modern, secure cryptocurrency wallet application built with Next.js 16, featuring real-time market data and a comprehensive admin panel.

![Trust Vault](./public/trust-wallet-logo.png)

## ✨ Features

### User Features
- 🔐 **Secure Wallet Management** - Create, import, and manage multiple wallets
- 💰 **Live Market Data** - Real-time cryptocurrency prices from CoinPaprika API
- 📊 **Trading Interface** - Spot and perpetual futures trading
- 🔔 **Smart Notifications** - Activity tracking and price alerts
- 🎨 **Modern iOS Design** - Clean, glass-morphism UI with smooth animations
- 🔍 **Advanced Search** - Quick access to 100+ cryptocurrencies
- 📱 **Responsive Design** - Optimized for mobile and desktop

### Admin Features
- 👥 **User Management** - View and manage all user accounts
- 💸 **Fund Deposits** - Add funds to user wallets
- 🚫 **Withdrawal Controls** - Restrict/unrestrict withdrawals
- 📈 **Transaction History** - Complete audit trail
- 📊 **Dashboard Analytics** - Real-time stats and monitoring

## 🚀 Tech Stack

- **Framework:** Next.js 16.2.9 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Lightweight Charts
- **Blockchain:** Ethers.js v6
- **QR Codes:** qrcode.react
- **Database:** Vercel Postgres (Production)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/iammroracle1-gif/trustvault.git

# Navigate to project
cd trustvault

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=Trust Vault
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Database (Vercel Postgres - Auto-configured in production)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
```

## 🗄️ Database Setup

### Development
Uses in-memory storage for quick development.

### Production (Vercel)
1. Create Vercel Postgres database in your project
2. Run the initialization SQL from deployment guide
3. Environment variables are auto-injected

## 📱 Pages

- `/` - Home/Landing page
- `/dashboard` - User wallet dashboard
- `/markets` - Cryptocurrency markets
- `/perps` - Perpetual futures trading
- `/search` - Search cryptocurrencies
- `/notifications` - Activity notifications
- `/settings` - User preferences
- `/admin/login` - Admin panel login
- `/admin/dashboard` - Admin control panel

## 🔐 Admin Access

**Development Credentials:**
- Username: `admin`
- Password: `admin123`

**Change these in production!**

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iammroracle1-gif/trustvault)

1. Click "Deploy with Vercel" button above
2. Connect your GitHub account
3. Create Vercel Postgres database in Storage tab
4. Add environment variables
5. Deploy!

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 📊 API Integration

### CoinPaprika API
- **Endpoint:** `https://api.coinpaprika.com/v1/`
- **Features:** Live cryptocurrency prices, market data
- **Rate Limit:** Free tier with generous limits
- **Fallback:** Mock data for development

## 🎨 Design System

### Colors
- **Primary:** `#4938F5` (Blue)
- **Success:** `#34C759` (Green)
- **Error:** `#FF453A` (Red)
- **Warning:** `#FF9500` (Orange)
- **Background:** `#0F1018` (Dark)
- **Surface:** `#191C2A` (Card)

### Typography
- **Font:** System UI (iOS style)
- **Sizes:** 13px, 15px, 17px scale

### Effects
- Glass morphism backgrounds
- Smooth transitions
- iOS-style interactions

## 🔒 Security Features

- Session-based admin authentication
- Withdrawal restriction system
- Transaction audit logging
- Secure wallet address generation
- Environment variable protection

## 📈 Performance

- Server-side rendering (SSR)
- API route caching
- Optimized images
- Code splitting
- Edge runtime support

## 🛠️ Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## 📝 Project Structure

```
vaultora/
├── app/              # Next.js app directory
│   ├── admin/        # Admin panel pages
│   ├── api/          # API routes
│   ├── dashboard/    # User dashboard
│   ├── markets/      # Market pages
│   ├── perps/        # Trading pages
│   └── ...           # Other pages
├── components/       # React components
├── lib/              # Utilities and helpers
├── public/           # Static assets
└── styles/           # Global styles
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Trust Wallet for logo and inspiration
- CoinPaprika for market data API
- Vercel for hosting platform
- Next.js team for the amazing framework

## 📞 Support

For support, email support@trustvault.app or open an issue.

---

**Built with ❤️ using Next.js 16**
