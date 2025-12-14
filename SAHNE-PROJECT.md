# SAHNE Mobile - Complete Project Documentation

## 🎯 Project Overview

**SAHNE** is Turkey's first luxury private chef reservation platform. A premium service that brings Michelin-starred restaurant quality to customers' homes, villas, or private venues.

**Target Audience:** Upper segment, luxury experience seekers
**Platform:** iOS & Android (React Native / Expo)
**Tone:** Premium, sophisticated, trustworthy, warm
**Language:** English (UI/UX)

---

## 🔗 Backend Integration

**Base URL:** `https://sahne.test/api`
**Authentication:** Bearer Token (Laravel Sanctum)
**API Documentation:** `sahne-endpoints.json` (OpenAPI 3.1.0 format)

The JSON file contains:
- All endpoint URLs
- Request/Response schemas
- Validation rules
- Example responses

---

## 👥 User Roles

### 1. Client (Customer)
- Browse and search chefs
- Create reservations
- Write reviews
- Create support tickets

### 2. Chef
- Manage incoming reservations (approve/reject/complete)
- Respond to reviews
- Manage profile and packages

### 3. Applicant
- Apply to become a chef
- Pending approval status

---

## 🎨 Design System

### Design Philosophy
- **Premium & Sophisticated:** Luxury brand feel
- **Minimalist:** Generous whitespace, clean interface
- **Modern:** Smooth animations, subtle shadows
- **Trustworthy:** Professional appearance

### Color Palette
```javascript
const colors = {
  // Primary - Gold/Champagne (Luxury feel)
  primary: '#C9A050',
  primaryLight: '#E5D4A1',
  primaryDark: '#8B7635',

  // Secondary - Dark Navy (Elegance)
  secondary: '#1A1A2E',
  secondaryLight: '#2D2D44',

  // Background
  background: '#FAFAFA',
  surface: '#FFFFFF',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Neutrals
  border: '#E5E7EB',
  disabled: '#D1D5DB',
}
```

### Typography
- **Headings:** Playfair Display (Serif, elegant) or similar premium font
- **Body:** Inter or SF Pro (Modern, readable)
- **Prices/Numbers:** Monospace font

### Design Principles
1. Use generous whitespace
2. Subtle shadows on cards
3. Border radius: 12-16px (soft corners)
4. Animations: 200-300ms, ease-out
5. High-quality placeholder images

---

## 📱 Application Screens

### Auth Flow
- Splash Screen (logo animation)
- Onboarding (3 slides, skip button)
- Login (email + password)
- Register (name, email, phone, password, role selection)
- Forgot Password

### Client Screens
- **Home:** Chef list, search, filtering
- **Chef Detail:** Profile, gallery, packages, reviews
- **Reservation Flow:** Date → Package → Details → Confirmation
- **My Reservations:** List, detail, cancel
- **Write Review:** Rating (4 categories) + comment
- **Profile:** My info, settings, logout
- **Support:** Ticket list, new ticket, messaging

### Chef Screens
- **Dashboard:** Summary statistics
- **Incoming Reservations:** Pending approvals
- **My Reservations:** All reservations
- **Reviews:** Received reviews, reply
- **Profile Edit:** Edit profile

---

## 📂 Project Structure

```
sahne-mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Auth screens (login, register)
│   ├── (client)/          # Client tabs
│   ├── (chef)/            # Chef tabs
│   ├── chef/[id].tsx      # Chef detail
│   └── _layout.tsx
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Button, Input, Card, etc.
│   │   ├── chef/         # ChefCard, ChefList
│   │   └── reservation/  # ReservationCard, etc.
│   ├── services/         # API calls
│   │   ├── api.ts        # Axios instance
│   │   ├── auth.ts
│   │   ├── chefs.ts
│   │   └── reservations.ts
│   ├── context/          # AuthContext, ThemeContext
│   ├── hooks/            # Custom hooks
│   ├── constants/        # colors, fonts, config
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Helper functions
├── assets/               # Images, fonts
└── sahne-endpoints.json  # API documentation
```

---

## 🔄 Development Methodology

### Phase-Based Development

**Phase 1: Project Setup & Auth**
- Clean up Expo template (`npm run reset-project`)
- Create folder structure
- Setup color/font/theme constants
- Create Axios API instance (base URL, interceptors)
- Implement AuthContext (token management)
- Build Login screen (working API integration)
- Build Register screen
- Build Splash screen

**Phase 2: Home & Chef List**
- Chef list screen with API integration
- Search functionality
- Filter UI
- Chef card component
- Pull-to-refresh
- Loading and empty states

**Phase 3: Chef Detail Page**
- Chef profile display
- Photo gallery
- Package list
- Reviews section
- "Book Now" button integration

**Phase 4: Reservation Flow**
- Date picker
- Package selection
- Details form
- Confirmation screen
- API integration

**Phase 5: Client Panel (Reservations, Reviews)**
- My Reservations list
- Reservation detail
- Cancel reservation
- Write review screen
- Support ticket system

**Phase 6: Chef Panel**
- Chef dashboard
- Incoming reservations management
- Approve/reject/complete actions
- Reviews management
- Reply to reviews

**Phase 7: Polish & Extras**
- Animations refinement
- Performance optimization
- Edge case handling
- Final testing

### Phase Completion Checklist

After each phase, provide a report with:
- ✅ Completed features
- 📁 Created/modified files
- 🧪 Test status
- 📱 Manual testing instructions
- ⏭️ Next phase tasks

### Git Workflow
- Commit at end of each phase
- Descriptive commit messages
- Intermediate commits if needed (WIP)
- Format: "Phase X: Description"

### Testing Strategy
- Component render tests
- API mock tests
- Manual testing with user at phase end

---

## 🧪 Test Users

| Role | Email | Password |
|------|-------|----------|
| Client | musteri1@test.com | password |
| Client | musteri2@test.com | password |
| Chef | chef1@test.com | password |
| Chef | chef2@test.com | password |
| Admin | admin@sahne.com | password |

---

## ⚠️ Critical Rules & Best Practices

### Code Quality
1. **Use TypeScript** - Avoid `any` type
2. **Loading states** - For every API call
3. **Error handling** - Meaningful user messages
4. **Empty states** - Beautiful UI when lists are empty
5. **Pull-to-refresh** - On all list screens
6. **Keyboard handling** - Proper behavior in forms
7. **Safe Area** - Handle notch and bottom bar
8. **Accessibility** - Labels and hints

### UI/UX Requirements
- Smooth animations (200-300ms)
- Optimistic UI updates where appropriate
- Proper loading skeletons
- Toast/snackbar for feedback
- Confirmation dialogs for destructive actions
- Form validation with clear error messages

### Performance
- Image optimization
- List virtualization for long lists
- Debounce search inputs
- Cache API responses when appropriate

---

## 🚀 Current Status

**Current Phase:** Phase 1 - Project Setup & Auth

**Immediate Next Steps:**
1. Run `npm run reset-project` to clean template
2. Create folder structure (src/, components/, services/, etc.)
3. Setup theme constants with luxury color palette
4. Configure Axios instance with interceptors
5. Implement AuthContext with token management
6. Build Login screen
7. Build Register screen
8. Build Splash screen

---

## 📝 Development Notes

- **I am the system engineer** responsible for all frontend development
- Freedom to make technical decisions within the project requirements
- Focus on premium, luxury user experience
- Maintain clean, maintainable code structure
- Document important decisions
- Test thoroughly before phase completion

---

## 🎯 Success Criteria

- Clean, premium UI matching design system
- Smooth, bug-free user experience
- All API integrations working correctly
- Proper error handling and edge cases
- Type-safe TypeScript implementation
- Good performance on both iOS and Android
- Accessible and user-friendly

---

**Last Updated:** December 14, 2024
**Status:** Ready to begin Phase 1
