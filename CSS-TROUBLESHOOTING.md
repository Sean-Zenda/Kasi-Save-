# CSS Troubleshooting Guide for KasiSave

## Common CSS Issues and Solutions

### 1. Styles Not Loading
**Problem**: No styling appears or components look unstyled
**Solution**:
```bash
# Clear cache and restart
npm run dev -- --force
# or
rm -rf node_modules/.vite
npm run dev
```

### 2. Tailwind Classes Not Working
**Problem**: Tailwind utility classes are not being applied
**Solution**:
- Ensure `@import "tailwindcss";` is at the top of globals.css
- Check that `@tailwindcss/vite` plugin is properly configured
- Verify Vite is recognizing the CSS file

### 3. Theme Variables Not Updating
**Problem**: Dark/light mode switch doesn't change colors
**Solution**:
- Check that `ThemeProvider` wraps the entire app
- Verify CSS custom properties are defined correctly
- Ensure `@theme` block syntax is correct for Tailwind v4

### 4. Component Styles Overridden
**Problem**: Custom styles are being overridden by default styles
**Solution**:
- Use more specific CSS selectors
- Add `!important` for critical styles
- Check CSS cascade order in globals.css

## Quick Verification Steps

### 1. Check CSS Import
Verify that `globals.css` is imported in `src/main.tsx`:
```tsx
import '../styles/globals.css'
```

### 2. Verify Tailwind Config
Check `vite.config.ts` includes:
```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
})
```

### 3. Test Theme Variables
Open browser DevTools and check that CSS custom properties are defined:
```css
:root {
  --background: #ffffff; /* Light mode */
}

.dark {
  --background: #1a2332; /* Dark mode */
}
```

### 4. Verify Color Application
Check that colors are properly applied:
```css
body {
  background-color: var(--background);
  color: var(--foreground);
}
```

## Browser-Specific Issues

### Chrome/Edge
- Clear DevTools cache: Network tab → Disable cache
- Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

### Firefox
- Clear cache: Ctrl+Shift+Delete
- Disable cache in DevTools: F12 → Settings → Disable cache

### Safari
- Clear cache: Develop → Empty Caches
- Disable cache: Develop → Disable Caches

## Debug Commands

```bash
# Check if dependencies are installed
npm list @tailwindcss/vite tailwindcss

# Rebuild with fresh cache
npm run build -- --force

# Check for TypeScript errors
npm run type-check

# Verify Vite config
npm run dev -- --debug
```

## Manual CSS Verification

If issues persist, you can manually verify CSS loading:

1. Open browser DevTools (F12)
2. Go to Sources/Debugger tab
3. Look for `globals.css` in the file tree
4. Check if CSS custom properties are defined
5. Verify that Tailwind utilities are generated

## Emergency Fallback

If CSS completely fails to load, add this to `index.html` as a temporary fix:

```html
<style>
  body {
    font-family: system-ui, -apple-system, sans-serif;
    background: #1a2332;
    color: #ffffff;
    margin: 0;
    padding: 0;
  }
  
  .min-h-screen {
    min-height: 100vh;
  }
  
  .bg-primary {
    background-color: #ff6b35;
  }
</style>
```

## Still Having Issues?

1. Check browser console for CSS parsing errors
2. Verify file permissions on CSS files
3. Try a different browser
4. Check if antivirus is blocking CSS files
5. Restart your development server completely