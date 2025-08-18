# Contributing to KasiSave

Thank you for your interest in contributing to KasiSave! This document provides guidelines for contributing to this project.

## 🎯 Project Vision

KasiSave aims to make financial services accessible to South Africa's informal workers by combining traditional savings methods (like Stokvels) with modern technology and AI-powered guidance.

## 🤝 How to Contribute

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/kasave.git
   cd kasave
   ```
3. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

### Development Workflow

1. **Make your changes** following our coding standards
2. **Test your changes** thoroughly
3. **Commit your changes** with clear commit messages:
   ```bash
   git commit -m "feat: add new savings goal categories"
   ```
4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a Pull Request** on GitHub

## 📝 Coding Standards

### TypeScript
- Use TypeScript for all new files
- Define proper interfaces and types
- Avoid `any` types when possible

### React Components
- Use functional components with hooks
- Follow the existing component structure in `/screens/` and `/components/`
- Keep components focused and reusable

### Styling
- Use Tailwind CSS classes
- Follow our design system defined in `/styles/globals.css`
- Maintain the KasiSave color scheme (navy blue #1a2332, orange #ff6b35)

### File Organization
```
kasave/
├── screens/           # Main app screens
├── components/        # Reusable components
├── components/ui/     # Shadcn UI components (don't modify)
├── config/           # Configuration files
├── navigation/       # Navigation logic
└── styles/          # Global styles
```

## 🐛 Reporting Issues

### Bug Reports
When reporting bugs, please include:
- **Clear description** of the issue
- **Steps to reproduce** the bug
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS, etc.)

### Feature Requests
For new features, please provide:
- **Clear description** of the feature
- **Use case** - why is this needed?
- **Proposed solution** (if you have one)
- **Alternatives considered**

## 🎨 Design Guidelines

### UI/UX Principles
- **Mobile-first** design approach
- **Accessibility** - ensure WCAG 2.1 compliance
- **Simplicity** - intuitive for informal workers
- **South African context** - relevant to local users

### Color Scheme
```css
Primary: #ff6b35 (Orange)
Background: #1a2332 (Dark Navy)
Secondary: #2a3441 (Medium Gray)
Text: #ffffff (White)
```

### Typography
- Use system fonts for performance
- 16px base font size for accessibility
- Clear hierarchy with appropriate font weights

## 🌍 South African Context

When contributing, please consider:
- **Local terminology** (e.g., "Stokvel" not "group savings")
- **Currency format** (South African Rand - R)
- **Mobile data constraints** - optimize for low bandwidth
- **Local payment methods** (eWallet, MTN Money)
- **Cultural sensitivity** around financial topics

## 🤖 AI Integration

### OpenAI ChatGPT Integration
- Follow rate limiting guidelines in `config/ai-config.ts`
- Maintain fallback responses for offline functionality
- Ensure prompts include South African financial context
- Test both API and fallback modes

### Prompt Engineering
- Keep responses relevant to informal workers
- Include local financial advice (Stokvels, etc.)
- Maintain encouraging and supportive tone
- Reference user's actual savings data

## ✅ Pull Request Guidelines

### Before Submitting
- [ ] Code follows our styling standards
- [ ] All existing tests pass
- [ ] New features include appropriate tests
- [ ] Documentation is updated if needed
- [ ] AI features work in both API and fallback modes

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested in development environment
- [ ] Tested with AI API enabled/disabled
- [ ] Tested responsive design
- [ ] Tested accessibility features

## Screenshots (if applicable)
Add screenshots of UI changes
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] New user registration flow
- [ ] Returning user login
- [ ] Savings goal creation and tracking
- [ ] Stokvel creation and joining
- [ ] AI coach conversations
- [ ] Deposit and withdrawal flows
- [ ] Settings and biometric toggle

### Cross-browser Testing
- [ ] Chrome/Chromium
- [ ] Safari (iOS)
- [ ] Firefox
- [ ] Edge

### Mobile Testing
- [ ] Android Chrome
- [ ] iOS Safari
- [ ] Responsive design breakpoints

## 📚 Resources

### Documentation
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

### Design System
- See `/styles/globals.css` for color variables
- Follow existing component patterns in `/components/ui/`
- Use Lucide React for consistent iconography

## 🎯 Priority Areas

We're especially looking for contributions in:

1. **Accessibility Improvements**
   - Screen reader compatibility
   - Keyboard navigation
   - Color contrast optimization

2. **Performance Optimization**
   - Bundle size reduction
   - Loading time improvements
   - Mobile performance

3. **South African Localization**
   - Additional local payment methods
   - Afrikaans/isiZulu language support
   - Local financial regulations compliance

4. **AI Coach Enhancements**
   - More sophisticated financial advice
   - Better context awareness
   - Improved fallback responses

5. **Stokvel Features**
   - Advanced group management
   - Payment splitting algorithms
   - Social features for member engagement

## 💬 Community

### Getting Help
- **GitHub Discussions** for general questions
- **GitHub Issues** for bug reports and feature requests
- **Code Reviews** - we provide constructive feedback

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Maintain professional communication

## 🚀 Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Environment Setup
- Copy `.env.example` to `.env.local`
- Add your OpenAI API key for AI coach functionality
- Configure any additional environment variables

---

Thank you for contributing to KasiSave! Together, we're building financial inclusion for South Africa's informal workers. 🇿🇦

For questions, reach out via GitHub Issues or Discussions.