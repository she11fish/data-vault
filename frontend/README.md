# Data Vault Frontend

A Next.js application providing a user interface for Data Vault, built with TypeScript, Tailwind CSS, and shadcn/ui components.

## 🏗️ Architecture

```
frontend/
├── app/                      # Next.js app directory
│   ├── api/                 # API route handlers
│   │   ├── auth/           # Authentication endpoints
│   │   └── data/           # Data management endpoints
│   ├── dashboard/          # Dashboard page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── layout.tsx         # Root layout
├── components/             # Reusable components
│   ├── ui/               # UI components (shadcn/ui)
│   └── theme-provider.tsx # Theme configuration
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── public/                # Static assets
└── styles/               # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm

### Development Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
pnpm build
pnpm start
```

## 🔧 Configuration

Key environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📡 API Integration

The frontend communicates with the backend through:

- Authentication endpoints (`/api/auth/*`)
- Data management endpoints (`/api/data/*`)
- File conversion endpoints (`/api/data/convert/*`)
- Image processing endpoints (`/api/data/image/*`)
