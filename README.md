# 🏦 KasiSave - Smart Savings for Informal Workers

<div align="center">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />

</div>

## 📱 About KasiSave

KasiSave is a modern fintech application designed specifically for informal workers in South Africa. It combines traditional savings methods like Stokvels with cutting-edge technology, including AI-powered financial coaching, to help users build better financial habits and achieve their savings goals.

### 🎯 Key Features

- **📞 Phone Number Registration** - Simple, accessible onboarding process
- **🔐 Secure PIN & Biometric Authentication** - Multiple layers of security
- **🎯 Personalized Goal Setting** - Custom savings targets with progress tracking
- **🤖 AI Financial Coach** - ChatGPT-powered personalized financial advice
- **👥 Digital Stokvels** - Traditional group savings brought to mobile
- **💰 Flexible Deposits** - Multiple payment methods including eWallet/MTN Money
- **📊 Progress Analytics** - Visual tracking of savings growth and streaks
- **🌙 Dark Mode Design** - Professional South African-themed UI



## 🛠️ Technology Stack

### Frontend
- **React 18+** with TypeScript for type safety
- **Tailwind CSS v4** with custom design system
- **Shadcn/UI** components for consistent design
- **Lucide React** for iconography
- **Sonner** for toast notifications

### AI Integration
- **OpenAI ChatGPT API** for personalized financial coaching
- **Rate limiting & fallback system** for reliable responses
- **Context-aware prompts** with user savings data

### Development
- **Vite** for fast development and building
- **ESLint** for code quality
- **Modern file organization** with screens and components separation

## 🎨 Design System

KasiSave uses a carefully crafted design system inspired by South African fintech:

```css
/* Primary Colors */
--primary: #ff6b35        /* Vibrant Orange */
--background: #1a2332     /* Dark Navy */
--secondary: #2a3441      /* Medium Gray */

/* Typography */
Font: System fonts optimized for mobile
Base size: 16px for accessibility
```

## 📂 Project Structure

```
kasave/
├── screens/              # Main application screens
├── components/           # Reusable UI components
├── config/              # Configuration files (AI, etc.)
├── navigation/          # App navigation logic
├── styles/              # Global styles and Tailwind config
└── components/ui/       # Shadcn UI components
```

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional, for AI coach)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kasave.git
   cd kasave
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure AI Coach (Optional)**
   ```bash
   # Edit /config/ai-config.ts
   # Replace 'YOUR_OPENAI_API_KEY_HERE' with your actual API key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🤖 AI Coach Setup

KasiSave includes an intelligent AI financial coach powered by ChatGPT. 

### Getting Started
1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Edit `/config/ai-config.ts`:
   ```typescript
   OPENAI_API_KEY: 'sk-your-actual-api-key-here',
   ```
3. The AI coach will provide personalized advice based on user's:
   - Current savings amount
   - Savings goals and progress
   - South African financial context
   - KasiSave features like Stokvels

### Features
- **Smart Rate Limiting** - Prevents API errors and manages costs
- **Fallback Responses** - Works even without API key
- **Context Awareness** - References user's actual data
- **South African Focus** - Understands local financial culture

See [AI_SETUP_README.md](./AI_SETUP_README.md) for detailed configuration.

## 🏛️ Application Features

### 📱 User Onboarding
- **Phone Registration** with OTP verification
- **Name Entry** for personalization  
- **PIN Setup** with confirmation
- **Goal Setting** with custom amounts and names
- **Returning User Flow** for seamless login

### 💰 Savings Management
- **Goal Tracking** with visual progress indicators
- **Multiple Deposit Methods** - Bank transfer, eWallet, MTN Money
- **Withdrawal Functionality** with balance protection
- **Savings Streaks** to encourage consistency

### 👥 Stokvel Features
- **Create Stokvels** with custom goals and invite codes
- **Join Groups** using invite codes
- **Member Management** with contribution tracking
- **Progress Visualization** for group goals
- **Social Sharing** for member recruitment

### 🤖 AI Financial Coach
- **Personalized Advice** based on user's financial situation
- **Goal-Specific Tips** for reaching savings targets
- **Stokvel Guidance** on group savings strategies
- **Emergency Fund Planning** and budgeting advice
- **Motivational Support** for maintaining savings habits

### ⚙️ Settings & Security
- **Biometric Authentication** toggle
- **PIN Management** (placeholder for real implementation)
- **Language Selection** (placeholder for multi-language support)
- **Account Information** display

## 🎯 User Experience

### New User Journey
1. **Phone Registration** → Enter phone number
2. **OTP Verification** → Confirm identity
3. **Name Entry** → Personalize experience
4. **PIN Setup** → Secure account
5. **Goal Setup** → Set savings target
6. **Dashboard** → Start saving!

### Returning User Journey
1. **Phone Recognition** → Quick login option
2. **PIN/Biometric** → Secure authentication
3. **Dashboard** → Resume savings journey

### Core Features Demo
- **Smart Onboarding** - Progressive registration flow
- **Dashboard Analytics** - Savings progress and streaks
- **AI Coach Chat** - Interactive financial guidance
- **Stokvel Management** - Create, join, and manage groups
- **Transaction Flow** - Deposits and withdrawals

## 🛡️ Security Features

- **PIN-based Authentication** for quick access
- **Biometric Support** (Touch ID/Face ID ready)
- **Secure Data Handling** with no PII storage
- **Rate-Limited API Calls** to prevent abuse
- **Local Data Storage** for offline functionality

## 🌍 South African Context

KasiSave is built with deep understanding of South African informal economy:

- **Stokvel Integration** - Digital version of traditional group savings
- **Mobile-First Design** - Optimized for smartphone usage
- **Low Data Usage** - Minimal API calls and efficient loading
- **Accessible UI** - Clear typography and intuitive navigation
- **Local Payment Methods** - eWallet, MTN Money integration ready
- **Rand Currency** - All amounts displayed in South African Rand (R)

## 📊 Demo Data

The app includes realistic demo data for testing:

- **User Profile** - Sipho Mthembu with R1,250 saved
- **Savings Goal** - R5,000 Emergency Fund (25% complete)
- **Stokvel Groups** - "Family Circle" and "Work Friends" examples
- **AI Conversations** - Pre-built financial coaching scenarios

## 🤝 Contributing

We welcome contributions to make KasiSave even better!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/UI** for the beautiful component library
- **OpenAI** for ChatGPT API integration
- **Tailwind CSS** for the utility-first styling approach
- **Figma Make** for the development platform
- **South African Fintech Community** for inspiration

## 📞 Support

- 📧 Email: support@kasave.co.za (example)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/kasave/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/kasave/discussions)

---

<div align="center">
  <p>Built with ❤️ for the South African informal economy</p>
  <p>
    <a href="#top">Back to top ↑</a>
  </p>
</div>
