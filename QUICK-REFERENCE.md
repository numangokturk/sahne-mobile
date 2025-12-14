# SAHNE Mobile - Quick Reference

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **SAHNE-PROJECT.md** | Complete project overview, design system, all phases |
| **PHASE-TRACKER.md** | Detailed task breakdown for each phase |
| **CLAUDE.md** | Technical setup and architecture for Claude Code |
| **sahne-endpoints.json** | Backend API documentation |
| **README.md** | Original Expo template readme |

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Platform specific
npm run android
npm run ios
npm run web

# Lint
npm run lint

# Clean template (DO THIS FIRST!)
npm run reset-project
```

---

## 🎨 Brand Colors (Quick Copy)

```typescript
primary: '#C9A050'      // Gold/Champagne
secondary: '#1A1A2E'    // Dark Navy
background: '#FAFAFA'
success: '#10B981'
error: '#EF4444'
```

---

## 🔗 API Quick Reference

**Base URL:** `https://sahne.test/api`

**Auth Header:** `Authorization: Bearer {token}`

**Key Endpoints:**
- POST `/auth/login` - Login
- POST `/auth/register` - Register
- GET `/chefs` - List chefs
- GET `/chefs/{id}` - Chef detail
- POST `/reservations` - Create reservation

*See sahne-endpoints.json for complete API documentation*

---

## 🧪 Test Credentials

```
Client: musteri1@test.com / password
Chef: chef1@test.com / password
Admin: admin@sahne.com / password
```

---

## 📁 Folder Structure to Create

```
src/
├── components/
│   ├── ui/
│   ├── chef/
│   └── reservation/
├── services/
├── context/
├── hooks/
├── constants/
├── types/
└── utils/
```

---

## ✅ Current Status

**Phase:** 1 (Project Setup & Auth)
**Status:** Ready to begin

**Next Immediate Action:** Run `npm run reset-project`

---

## 📝 Phase Checklist Template

After each phase:
- ✅ List completed features
- 📁 List created/modified files
- 🧪 Describe test results
- 📱 Provide manual testing instructions
- ⏭️ Outline next phase preview
- 💾 Git commit with format: "Phase X: Description"

---

## 🎯 Key Principles

1. **Premium UX:** Generous whitespace, smooth animations
2. **TypeScript:** No `any` types
3. **Error Handling:** User-friendly messages
4. **Loading States:** Every API call
5. **Empty States:** Beautiful when no data
6. **Accessibility:** Labels and hints
7. **Safe Area:** Handle notch/bottom bar

---

**Role:** System Engineer (Full Frontend Responsibility)
**Autonomy:** Free to make technical decisions within requirements
**Workflow:** Phase-based development with reports
