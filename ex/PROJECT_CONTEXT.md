# PROJECT CONTEXT - CryptoYield Platform

## Project Overview
- **Name:** CryptoYield - Premium HYIP Investment Platform
- **Type:** Full-stack web + mobile application
- **Frontend:** React 18.2.0 with TypeScript + Vite
- **State Management:** React Context API
- **Routing:** React Router DOM v6
- **Mobile:** Flutter (Dart)
- **Node:** v18+ / pnpm v10.24.0

---

## Technology Stack

### Frontend Dependencies:
- React 18.2.0 + React DOM 18.2.0
- React Router DOM 6.22.3
- Recharts 2.12.2 (charts/visualizations)
- Lucide React 0.454.0 (icons)
- Google Generative AI 0.21.0 (AI Agent)
- Next.js 16.1.1

### Dev Dependencies:
- Vite 6.4.1 (build tool)
- TypeScript 5.8.3
- @vitejs/plugin-react 5.1.2
- @types/node 22.19.3

### Styling:
- Tailwind CSS (CDN via index.html)

---

## Current Status: OPERATIONAL ✅

**Dev Server:** Running on `http://localhost:3001/`  
**Build System:** Vite configured and working  
**Dependencies:** All installed (184 packages)  
**Compilation:** No errors  

---

## Recent Fixes Applied

| File | Issue | Solution | Status |
|------|-------|----------|--------|
| `package.json` | Wrong package name `@google/genai` | Changed to `@google/generative-ai@^0.21.0` | ✅ Fixed |
| `index.html` | ImportMap referenced old package | Updated to `@google/generative-ai` ESM | ✅ Fixed |
| `components/AIAgent.tsx` | Incorrect import & API usage | Updated imports and API methods | ✅ Fixed |
| `tsconfig.json` | Missing node types error | Removed problematic types config | ✅ Fixed |

---

## Project Structure

```
d:\Edge2\
├── Configuration Files
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── manifest.json
│   └── metadata.json
├── Source Code
│   ├── App.tsx (main router)
│   ├── index.tsx (entry point)
│   ├── constants.ts
│   ├── types.ts
│   ├── components/
│   │   ├── AIAgent.tsx ⭐ (AI chatbot)
│   │   ├── Auth.tsx
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── AdminShared.tsx
│   │   └── ToastContainer.tsx
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Admin.tsx
│   │   ├── Invest.tsx
│   │   ├── Transactions.tsx
│   │   ├── Referrals.tsx
│   │   ├── Settings.tsx
│   │   ├── Support.tsx
│   │   └── PublicPlans.tsx
│   ├── services/
│   │   └── api.ts
│   ├── store/
│   │   └── AppContext.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── app/ (Next.js routing structure)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── (dashboard)/
│   │       ├── admin/page.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── invest/page.tsx
│   │       ├── referrals/page.tsx
│   │       └── transactions/page.tsx
│   └── mobile/ (Flutter app)
│       ├── main.dart
│       ├── api_service.dart
│       └── screens/dashboard.dart
└── Dependencies
    └── node_modules/ (184 packages)
```

---

## Complete File List

### Root Configuration Files (13 files):
1. `package.json` - Dependencies & scripts ✅ **UPDATED**
2. `tsconfig.json` - TypeScript configuration ✅ **UPDATED**
3. `vite.config.ts` - Vite build configuration
4. `index.html` - Main HTML entry point ✅ **UPDATED**
5. `index.tsx` - React entry point
6. `App.tsx` - Main React application component
7. `manifest.json` - PWA manifest
8. `metadata.json` - Project metadata
9. `.gitignore` - Git ignore rules
10. `README.md` - Project documentation
11. `pnpm-lock.yaml` - Dependency lock file
12. `constants.ts` - Application constants
13. `types.ts` - Type definitions

### Components Directory (6 files):
1. `components/AIAgent.tsx` - AI chatbot component ✅ **UPDATED**
2. `components/Auth.tsx` - Authentication form
3. `components/Layout.tsx` - Layout wrapper
4. `components/Navbar.tsx` - Navigation bar
5. `components/AdminShared.tsx` - Shared admin components
6. `components/ToastContainer.tsx` - Toast notifications

### Pages Directory (9 files):
1. `pages/Landing.tsx` - Landing page
2. `pages/Dashboard.tsx` - User dashboard
3. `pages/Admin.tsx` - Admin panel
4. `pages/Invest.tsx` - Investment page
5. `pages/Transactions.tsx` - Transaction history
6. `pages/Referrals.tsx` - Referral system
7. `pages/Settings.tsx` - User settings
8. `pages/Support.tsx` - Support page
9. `pages/PublicPlans.tsx` - Investment plans

### Services Directory (1 file):
1. `services/api.ts` - API service layer

### Store/Context Directory (2 files):
1. `store/AppContext.tsx` - State management
2. `context/AppContext.tsx` - Alternative context (duplicate?)

### Types Directory (1 file):
1. `types/index.ts` - TypeScript type definitions

### App Directory (Next.js Structure - 10 files):
1. `app/layout.tsx` - Root layout
2. `app/page.tsx` - Root page
3. `app/globals.css` - Global styles
4. `app/(auth)/login/page.tsx` - Login page
5. `app/(auth)/register/page.tsx` - Register page
6. `app/(dashboard)/layout.tsx` - Dashboard layout
7. `app/(dashboard)/dashboard/page.tsx` - Dashboard page
8. `app/(dashboard)/admin/page.tsx` - Admin page
9. `app/invest/page.tsx` - Invest page
10. `app/referrals/page.tsx` - Referrals page
11. `app/transactions/page.tsx` - Transactions page

### Mobile Directory (Dart/Flutter - 3 files):
1. `mobile/main.dart` - Flutter app entry point
2. `mobile/api_service.dart` - Flutter API service
3. `mobile/screens/dashboard.dart` - Flutter dashboard screen

**Total Project Files: 46 files**

---

## Errors Resolved ✅

### 1. Package Installation Error
**File:** `package.json`
**Location:** Line 18
**Issue:** Incorrect package name `@google/genai@0.21.0` doesn't exist on npm registry
**Error Message:** 
```
ERR_PNPM_NO_MATCHING_VERSION  No matching version found for @google/genai@0.21.0
```
**Root Cause:** The Google AI package was renamed from `@google/genai` to `@google/generative-ai`
**Solution:** Changed to `@google/generative-ai@^0.21.0`
```diff
- "@google/genai": "0.21.0"
+ "@google/generative-ai": "^0.21.0"
```
**Status:** ✅ Fixed - Dependencies installed successfully (184 packages)

---

### 2. HTML Import Map Error
**File:** `index.html`
**Location:** Lines 38-48
**Issue:** ImportMap referenced non-existent package `@google/genai` ESM URL
**Error Message:** Module not found during browser loading
**Root Cause:** package.json was updated but importmap wasn't synchronized
**Solution:** Updated importmap to use correct package name and ESM URL
```diff
- "@google/genai": "https://esm.sh/@google/genai@0.21.0"
+ "@google/generative-ai": "https://esm.sh/@google/generative-ai@0.21.0"
```
**Status:** ✅ Fixed

---

### 3. React Component Import Error
**File:** `components/AIAgent.tsx`
**Location:** Line 2
**Issue:** Importing from old non-existent `@google/genai` package
**Error Message:**
```
Pre-transform error: Failed to resolve import "@google/genai" from "components/AIAgent.tsx"
Internal server error: Failed to resolve import "@google/genai"
```
**Root Cause:** Component was written for outdated API
**Solution:** Updated import statement to use correct package
```diff
- import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
+ import { GoogleGenerativeAI } from '@google/generative-ai';
```
**Status:** ✅ Fixed

---

### 4. Outdated API Usage Error
**File:** `components/AIAgent.tsx`
**Location:** Lines 52-87 (handleSendMessage function)
**Issue:** Using old GoogleGenAI API methods that don't exist in new package
**Error Message:** API methods undefined - `ai.chats.create()`, `chat.sendMessageStream()`
**Root Cause:** Google Generative AI library API changed significantly between versions
**Solution:** Updated to use new API structure:

**Old Code:**
```typescript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
const chat = ai.chats.create({
  model: 'gemini-3-flash-preview',
  config: { 
    systemInstruction,
    temperature: 0.1,
  },
});
const responseStream = await chat.sendMessageStream({ message: userMessage });
for await (const chunk of responseStream) {
  const c = chunk as GenerateContentResponse;
  const text = c.text;
  // ... streaming logic
}
```

**New Code:**
```typescript
const ai = new GoogleGenerativeAI(process.env.API_KEY || '');
const model = ai.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  systemInstruction,
});
const chat = model.startChat({
  generationConfig: { 
    temperature: 0.1,
  },
});
const response = await chat.sendMessage(userMessage);
const text = response.response.text();
setMessages(prev => [...prev, { role: 'model', text }]);
```

**Changes Made:**
- Constructor syntax: `new GoogleGenAI({ apiKey })` → `new GoogleGenerativeAI(apiKey)`
- Model access: `ai.chats.create()` → `ai.getGenerativeModel()`
- Chat initialization: `chats.create()` → `model.startChat()`
- Message sending: `chat.sendMessageStream()` → `chat.sendMessage()`
- Model name: `gemini-3-flash-preview` → `gemini-1.5-flash` (available model)
- Response handling: Streaming → Direct response

**Status:** ✅ Fixed

---

### 5. TypeScript Configuration Error
**File:** `tsconfig.json`
**Location:** Lines 13-15
**Issue:** Compiler couldn't find type definitions for node module
**Error Message:**
```
Cannot find type definition file for 'node'.
The file is in the program because:
  Entry point of type library 'node' specified in compilerOptions
```
**Root Cause:** Project is client-side only (browser) but tsconfig.json was configured for Node.js environment types
**Solution:** Removed the problematic `types` array entry
```diff
"skipLibCheck": true,
- "types": [
-   "node"
- ],
"moduleResolution": "bundler",
```
**Status:** ✅ Fixed

---

## Key Features

1. **Authentication System** - Login/Register (Auth.tsx)
2. **User Dashboard** - Investment tracking & analytics
3. **Admin Panel** - Platform management
4. **Investment Plans** - Browse & invest in HYIP plans
5. **AI Agent** - ChatBot with Google Generative AI integration ⭐
6. **Referral System** - Earn commissions
7. **Transaction History** - View all transactions
8. **Settings & Support** - User management

---

## API Integration

- **Google Generative AI**: For the AI Agent chatbot feature
  - API Endpoint: Google Cloud AI
  - Model: `gemini-1.5-flash`
  - Configuration: System instruction, temperature 0.1
- **Custom Backend API**: Via `services/api.ts`
- **State Management**: React Context (AppContext)

---

## Available Scripts

```bash
# Install dependencies
pnpm i

# Start development server (http://localhost:3001)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## Development Environment Configuration

**Vite Configuration (`vite.config.ts`):**
```typescript
- Port: 3000 (fallback: 3001)
- Host: 0.0.0.0 (accessible from network)
- React plugin enabled
- API_KEY and GEMINI_API_KEY environment variables
- Module alias: @/* → root directory
```

**Tailwind CSS:**
- Dark mode: class-based
- Brand colors configured
- Custom box shadows for premium UI
- Custom font families (Inter, JetBrains Mono)

**TypeScript Configuration:**
- Target: ES2022
- Module: ESNext
- Module Resolution: bundler
- JSX: react-jsx
- Isolated modules: true

---

## Known Issues & Notes

⚠️ **Duplicate Context Files:** 
- Both `context/AppContext.tsx` and `store/AppContext.tsx` exist
- Verify which one is being used by the app
- Consider consolidating to avoid confusion

⚠️ **Next.js + Vite Hybrid:**
- Project uses both Next.js and Vite
- Might cause configuration conflicts
- Consider choosing one build system for consistency

⚠️ **Environment Variables:**
- `GEMINI_API_KEY` required for AI features
- `API_KEY` used as fallback
- Ensure .env file is configured

✅ **Mobile App:**
- Flutter app included for iOS/Android deployment
- Separate from web app

✅ **PWA Ready:**
- Manifest.json configured
- Progressive web app ready for installation

---

## Last Updates

**Date:** December 24, 2025  
**Time:** 6:42 PM (Last dev server restart)  
**Status:** ✅ All errors resolved  
**Build Status:** ✅ Success  
**Runtime Status:** ✅ No errors  

### Changes Summary:
- ✅ Fixed 5 critical errors
- ✅ Updated 4 files
- ✅ Dev server running successfully
- ✅ All dependencies resolved
- ✅ Ready for development

---

## How to Continue Development

1. **Start dev server:**
   ```bash
   pnpm dev
   ```
   Access at `http://localhost:3001/`

2. **Configure environment:**
   Create `.env` file with:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **Make changes:**
   - Modify components in `components/`
   - Update pages in `pages/`
   - Changes automatically reload via HMR

4. **Build for production:**
   ```bash
   pnpm build
   ```

5. **Deploy:**
   - Output in `dist/` directory
   - Ready for static hosting (Vercel, Netlify, etc.)

---

**Project Status: ✅ OPERATIONAL AND READY FOR DEVELOPMENT**
