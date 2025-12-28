# Restore Point 2: Cockpit & Fractions System

**Git Tag:** `v2.0-cockpit-and-fractions`  
**Date:** December 28, 2025  
**Last Commit:** a52342f

## 🎯 What's Included in This Restore Point

### Major Features Added Since Restore Point 1:

#### 1. **Fraction Management System**
- ✅ Full CRUD for property fractions (units)
- ✅ Fraction fields: identifier, owner info, contact, ownership share, address
- ✅ Owner invitation system with status tracking
- ✅ Fraction detail page with view/edit modes
- ✅ Owner email linking to user accounts

#### 2. **Owner Invitation & Auto-Linking**
- ✅ Managers can invite fraction owners via email
- ✅ Auto-links owners to fractions when they sign up
- ✅ Three status states:
  - "Not Invited" - Owner hasn't been invited
  - "Invited - Pending" - Invite sent, awaiting signup
  - "Accepted" - Owner signed up and linked
- ✅ Existing users auto-accept when invited

#### 3. **Condo Cockpit for Fraction Owners**
- ✅ Dedicated cockpit interface at `/dashboard/cockpit/[id]`
- ✅ Four main sections:
  1. **Message Board** - Public & private communication
  2. **Tickets** - Kanban-style issue tracking (placeholder)
  3. **Documents** - Document management (placeholder)
  4. **Fin. Info** - Financial information (placeholder)
- ✅ Owners see their condos in "My Condos" dashboard

#### 4. **Dual-Role Support**
- ✅ Users can be BOTH manager AND fraction owner
- ✅ Smart routing based on role:
  - Pure managers → Management Dashboard
  - Pure owners → Cockpit
  - Dual-role → Management Dashboard with "→ Cockpit View" tab
- ✅ API tracks `isManager` and `isOwner` flags
- ✅ Seamless switching between manager and owner perspectives

#### 5. **Database Export Tools**
- ✅ CSV export script (`scripts/export-to-csv.js`)
- ✅ Exports all 9 MongoDB collections
- ✅ Works with local or production database
- ✅ Comprehensive export documentation

### Technical Improvements:

- ✅ Enhanced `Fraction` model with owner tracking fields
- ✅ Updated `/api/condos` to return fraction-owned condos
- ✅ Auto-linking on user signup
- ✅ Type-safe API responses with proper error handling
- ✅ Improved UI with status badges and role indicators

## 📦 New Files Added:

### Models:
- `src/models/fraction.ts` (enhanced with owner fields)

### Pages:
- `src/app/dashboard/condos/[id]/fractions/page.tsx` - Fractions list
- `src/app/dashboard/condos/[id]/fractions/[fractionId]/page.tsx` - Fraction detail
- `src/app/dashboard/cockpit/[id]/layout.tsx` - Cockpit layout
- `src/app/dashboard/cockpit/[id]/page.tsx` - Message board
- `src/app/dashboard/cockpit/[id]/tickets/page.tsx` - Tickets (placeholder)
- `src/app/dashboard/cockpit/[id]/documents/page.tsx` - Documents (placeholder)
- `src/app/dashboard/cockpit/[id]/financial/page.tsx` - Financial (placeholder)

### APIs:
- `src/app/api/condos/[id]/fractions/route.ts` - List/create fractions
- `src/app/api/condos/[id]/fractions/[fractionId]/route.ts` - Get/update fraction
- `src/app/api/condos/[id]/fractions/[fractionId]/invite-owner/route.ts` - Invite owner

### Scripts:
- `scripts/export-to-csv.js` - Database export utility
- `scripts/README-EXPORT.md` - Export documentation

## 🔧 Modified Files:

- `src/app/api/condos/route.ts` - Added dual-role detection
- `src/app/api/condos/[id]/route.ts` - Added isOwner flag
- `src/app/api/auth/signup/route.ts` - Auto-link fractions on signup
- `src/app/dashboard/condos/page.tsx` - Smart routing based on userRole
- `src/app/dashboard/condos/[id]/layout.tsx` - Added cockpit link for dual-role

## 📊 Database Schema Updates:

### Fraction Model Fields Added:
```javascript
ownerInvited: Boolean      // Manager invited this owner
ownerAccepted: Boolean     // Owner signed up and accepted
ownerUserId: ObjectId      // Link to User account
```

## 🚀 How to Restore This Point:

```bash
# Checkout this restore point
git checkout v2.0-cockpit-and-fractions

# Or reference it
git log v2.0-cockpit-and-fractions

# Or create a branch from it
git checkout -b feature-name v2.0-cockpit-and-fractions
```

## 🎯 Next Steps (Suggested):

1. Implement actual message board functionality
2. Build Kanban ticketing system
3. Add document upload/management
4. Create financial dashboard with reports
5. Add notifications for owners when invited
6. Implement tenant management (if needed)
7. Add email notifications via SendGrid

## 📝 Notes:

- All placeholder pages have UI skeletons ready
- Auto-linking works for new signups (existing users need manual linking)
- Dual-role support tested and working
- CSV export tool ready for data analysis
- Production deployment may show 404 (check Vercel config)

---

**Previous Restore Point:** `v1.0-complete-platform` - Basic auth & backoffice  
**Current Restore Point:** `v2.0-cockpit-and-fractions` - Fractions & cockpit system
