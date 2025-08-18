# KasiSave Dependency Installation Guide

## Quick Setup

Run these commands in your terminal:

```bash
# Install all dependencies
npm install

# Start the development server
npm run dev
```

## Manual Installation (if needed)

If you encounter any issues, install dependencies manually:

```bash
# Core React dependencies
npm install react react-dom

# TypeScript and build tools
npm install -D typescript @types/react @types/react-dom
npm install -D vite @vitejs/plugin-react

# Tailwind CSS v4
npm install -D @tailwindcss/vite tailwindcss autoprefixer

# UI Component dependencies
npm install lucide-react
npm install next-themes sonner
npm install class-variance-authority clsx tailwind-merge

# Radix UI components
npm install @radix-ui/react-slot
npm install @radix-ui/react-avatar
npm install @radix-ui/react-progress
npm install @radix-ui/react-select
npm install @radix-ui/react-label
npm install @radix-ui/react-dialog
npm install @radix-ui/react-switch
npm install @radix-ui/react-separator
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-accordion
npm install @radix-ui/react-alert-dialog
npm install @radix-ui/react-aspect-ratio
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-collapsible
npm install @radix-ui/react-context-menu
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-hover-card
npm install @radix-ui/react-menubar
npm install @radix-ui/react-navigation-menu
npm install @radix-ui/react-popover
npm install @radix-ui/react-radio-group
npm install @radix-ui/react-slider
npm install @radix-ui/react-tabs
npm install @radix-ui/react-toast
npm install @radix-ui/react-toggle
npm install @radix-ui/react-toggle-group
npm install @radix-ui/react-tooltip

# Additional utility libraries
npm install recharts date-fns react-day-picker
npm install vaul cmdk embla-carousel-react
npm install react-resizable-panels input-otp
npm install react-hook-form

# Development dependencies
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-plugin-react-hooks eslint-plugin-react-refresh
```

## Troubleshooting

1. **Clear npm cache**: `npm cache clean --force`
2. **Delete node_modules**: `rm -rf node_modules && npm install`
3. **Check Node.js version**: Make sure you have Node.js 18+ installed
4. **Update npm**: `npm install -g npm@latest`

## Verify Installation

After installation, check that everything works:

```bash
npm run dev
```

The app should start on http://localhost:3000