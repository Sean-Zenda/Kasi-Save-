# KasiSave Development Guidelines

## Theme System Guidelines

KasiSave supports both light and dark modes to enhance user experience and accessibility.

### Theme Implementation
* Use the `ThemeProvider` wrapper around the entire application
* Access theme state via the `useTheme()` hook
* Theme preference is automatically saved to localStorage
* System theme preference is detected and applied by default

### Theme Colors
#### Light Mode
* Background: `#ffffff` (White)
* Foreground: `#0f1419` (Dark blue-gray)
* Secondary: `#f1f5f9` (Light gray)
* Primary: `#ff6b35` (Orange - consistent across themes)

#### Dark Mode
* Background: `#1a2332` (Dark navy)
* Foreground: `#ffffff` (White)
* Secondary: `#2a3441` (Medium gray)
* Primary: `#ff6b35` (Orange - consistent across themes)

### Usage Rules
* Always use CSS custom properties (e.g., `var(--background)`) instead of hardcoded colors
* Use Tailwind utility classes that reference the design tokens (e.g., `bg-background`, `text-foreground`)
* Include smooth transitions for theme changes using `transition-colors`
* Test all components in both light and dark modes

### Theme Toggle Components
* Use `<ThemeToggle variant="minimal" />` for icon-only toggles (e.g., in headers)
* Use `<ThemeToggle />` for full descriptive toggles
* Use `<AdvancedThemeToggle />` in settings for comprehensive theme selection

## General Guidelines

### Color System
* Primary action color: `#ff6b35` (Orange) - use for CTAs, primary buttons, and accents
* Keep the orange accent color consistent across both themes for brand recognition
* Use semantic color names in CSS variables (e.g., `--destructive` for error states)

### Typography
* Use system fonts for performance and native feel
* Base font size: 16px for accessibility
* Font weights: 400 (normal), 500 (medium)
* Maintain proper contrast ratios in both light and dark themes

### Responsive Design
* Mobile-first approach for South African users
* Test on various screen sizes and orientations
* Ensure touch targets are at least 44px for accessibility

### Accessibility
* Maintain WCAG 2.1 AA contrast ratios in both themes
* Support keyboard navigation
* Include proper ARIA labels and semantic HTML
* Test with screen readers

### South African Context
* Use "Stokvel" terminology for group savings features
* Display amounts in South African Rand (R)
* Consider low-bandwidth scenarios
* Optimize for Android devices (prevalent in SA market)

### Component Guidelines

#### Buttons
* Primary: Use `bg-primary` for main actions
* Secondary: Use `bg-secondary` for alternative actions
* Outline: Use `variant="outline"` for secondary actions
* Ghost: Use `variant="ghost"` for subtle actions

#### Cards
* Use `Card` component for content grouping
* Apply proper border and background colors that adapt to theme
* Include hover states for interactive cards

#### Forms
* Use consistent input styling with `InputField` component
* Maintain proper focus states in both themes
* Include validation states that work in both themes

### Performance
* Lazy load screens and components where appropriate
* Optimize images and use WebP format when possible
* Minimize API calls and implement proper caching
* Use efficient re-rendering patterns with React hooks

### AI Coach Integration
* Ensure API rate limiting is implemented
* Provide meaningful fallback responses
* Context should include user's savings data and South African financial context
* Test both online and offline scenarios

### Code Organization
* Screens in `/screens/` directory
* Reusable components in `/components/` directory
* UI components in `/components/ui/` (from shadcn/ui)
* Configuration in `/config/` directory
* Global styles in `/styles/globals.css`

### Testing Checklist
- [ ] Component works in both light and dark themes
- [ ] Responsive design on mobile and desktop
- [ ] Keyboard navigation support
- [ ] Proper contrast ratios maintained
- [ ] Loading states implemented
- [ ] Error states handled gracefully
- [ ] Offline functionality considered