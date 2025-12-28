# Recovery Point: v1.0-condo-management

**Created:** December 28, 2025
**Tag:** `v1.0-condo-management`
**Commit:** `83869fa`

## System Overview

Complete condominium management SaaS platform with:
- User authentication and authorization
- Admin backoffice
- Support team management
- Condo management with multi-manager support
- Fractions (units) management
- Type categorization system

---

## Database Collections (9)

### 1. **users**
- User accounts (regular, support team, admin)
- Fields: email, password (hashed), fullName, isAdmin, isSupportTeam

### 2. **userlogs**
- User activity tracking

### 3. **adminlogs**
- Admin/support team activity tracking

### 4. **condos**
- Condo properties
- Fields: name, type, addressLine1, addressLine2, postalCode, country, condoEmail, userId, avatar, lastActivityAt

### 5. **condotypes**
- Condo type categories (admin-managed)
- Fields: name (unique), isDefault

### 6. **condomanagers**
- User-to-Condo relationships (many-to-many)
- Fields: condoId, userId, invitedBy
- Unique index: (condoId, userId)

### 7. **condomanagerinvites**
- Pending manager invites
- Fields: condoId, email, invitedBy, used
- Unique index: (condoId, email)

### 8. **fractions**
- Condo units/fractions
- Fields: condoId, identifier, ownerFullName, ownerEmail, ownerCountryMobile, ownerMobile, ownershipShare, addressLine1, addressLine2, postalCode, country
- Unique index: (condoId, identifier)

### 9. **supportinvites**
- Support team invites
- Fields: email, invitedBy, used

---

## Key Features

### Authentication System
- ✅ Sign up / Sign in
- ✅ Session-based auth (HTTP-only cookies)
- ✅ Password change
- ✅ Role-based access (User, Support, Admin)

### User Dashboard
- ✅ Profile management
- ✅ My Condos list
- ✅ Condo creation
- ✅ Condo detail pages (3 tabs)

### Condo Management
**Condo Detail Tabs:**
1. **Basic Data** - View/edit condo information
2. **Condo Managers** - Active managers + Pending invites with status badges
3. **Fractions** - Unit management with tiles display

**Manager System:**
- Creator auto-added as first manager
- Smart invite: existing users added immediately, new users get pending invite
- Any manager can invite others
- Pending invites shown separately with status

**Fractions System:**
- Add units with identifier (e.g., "Apt 101")
- Owner details (name, email, mobile)
- Ownership share percentage
- Address auto-populated from condo
- Identifier auto-added to Address Line 2

### Admin Backoffice
- ✅ User management
- ✅ Support team management
- ✅ Platform management (condo types)
- ✅ Activity logs (user + admin)
- ✅ Data reset tools

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Condos
- `GET /api/condos` - List user's condos
- `POST /api/condos` - Create condo (auto-adds creator as manager)
- `GET /api/condos/[id]` - Get condo details (manager-only)
- `PUT /api/condos/[id]` - Update condo (manager-only)

### Condo Managers
- `GET /api/condos/[id]/managers` - List managers + pending invites
- `POST /api/condos/[id]/managers` - Invite manager (smart invite logic)

### Fractions
- `GET /api/condos/[id]/fractions` - List fractions (manager-only)
- `POST /api/condos/[id]/fractions` - Create fraction (manager-only)

### Condo Types (Admin)
- `GET /api/condo-types` - List all types (public)
- `POST /api/condo-types` - Create type (admin-only)
- `DELETE /api/condo-types?id=X` - Delete type (admin-only)

### Admin
- `GET /api/admin/logs` - Get admin logs
- `POST /api/admin/reset-data` - Reset database (preserves admin)
- `GET /api/user-logs` - Get user activity logs

### Support Team
- `POST /api/support-team/invite` - Invite support member (admin)
- `GET /api/support-team/members` - List support team
- `GET /api/support-team/logs` - Get support logs

### User Profile
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password

---

## How to Restore This Recovery Point

### Method 1: Restore from Git Tag

```bash
# View all tags
git tag

# Restore to this recovery point
git checkout v1.0-condo-management

# Or create a new branch from this tag
git checkout -b restored-from-v1.0 v1.0-condo-management
```

### Method 2: Reset to Specific Commit

```bash
# Reset to the exact commit
git reset --hard 83869fa

# Or view the commit
git show 83869fa
```

### Method 3: View Tag Details

```bash
# Show tag information
git show v1.0-condo-management

# List all tags
git tag -l -n
```

---

## Database Reset Script

Located: `scripts/reset-database.js`

**Usage:**
```bash
node scripts/reset-database.js
```

**What it does:**
- Deletes all users (except admin: marcondes.gustavo@gmail.com)
- Deletes all condos, managers, fractions
- Deletes all logs (except admin's own)
- Deletes all invites
- Preserves admin user and condo types

---

## Environment Variables Required

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth (if used)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...

# Stripe (if payments enabled)
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin
ADMIN_EMAIL=marcondes.gustavo@gmail.com
```

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** Custom session-based (HTTP-only cookies)
- **Deployment:** Vercel
- **Additional:** SendGrid MCP (email integration)

---

## File Structure Snapshot

```
saas-site/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/ (signup, signin, logout, me)
│   │   │   ├── condos/ (CRUD + nested routes)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts (GET, PUT)
│   │   │   │       ├── managers/route.ts (GET, POST)
│   │   │   │       └── fractions/route.ts (GET, POST)
│   │   │   ├── condo-types/ (GET, POST, DELETE)
│   │   │   ├── admin/ (logs, reset-data)
│   │   │   ├── support-team/ (invite, members, logs)
│   │   │   └── user/ (profile, password)
│   │   ├── dashboard/
│   │   │   ├── page.tsx (dashboard home)
│   │   │   ├── layout.tsx
│   │   │   └── condos/
│   │   │       ├── page.tsx (list)
│   │   │       └── [id]/
│   │   │           ├── layout.tsx (3-tab nav)
│   │   │           ├── page.tsx (Basic Data)
│   │   │           ├── managers/page.tsx
│   │   │           └── fractions/page.tsx
│   │   ├── backoffice/
│   │   │   ├── page.tsx (admin home)
│   │   │   ├── layout.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── support-team/page.tsx
│   │   │   └── platform/page.tsx (types management)
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   └── page.tsx (home/landing)
│   ├── models/
│   │   ├── user.ts
│   │   ├── condo.ts
│   │   ├── condo-type.ts
│   │   ├── condo-manager.ts
│   │   ├── condo-manager-invite.ts
│   │   ├── fraction.ts
│   │   ├── support-invite.ts
│   │   ├── user-log.ts
│   │   └── admin-log.ts
│   ├── lib/
│   │   ├── mongoose.ts (DB connection)
│   │   └── stripe.ts
│   └── components/
│       ├── site-header.tsx
│       ├── site-footer.tsx
│       ├── contact-form.tsx
│       └── providers.tsx
├── scripts/
│   └── reset-database.js
├── .env
├── package.json
├── vercel.json
└── README.md
```

---

## Restoration Checklist

After restoring from this tag:

- [ ] Verify `.env` file exists with all required variables
- [ ] Run `npm install` to ensure dependencies
- [ ] Check MongoDB connection string
- [ ] Test local build: `npm run dev`
- [ ] Verify admin account exists in database
- [ ] Test authentication flow
- [ ] Test condo creation and management
- [ ] Test fraction creation
- [ ] Deploy to Vercel
- [ ] Run database migrations if needed

---

## Contact

**System Admin:** marcondes.gustavo@gmail.com

**Database:** MongoDB Atlas (check .env for connection string)

**Deployment:** Vercel (linked to GitHub repo)

---

## Notes

- All routes use Next.js 16 async params pattern
- Manager permissions required for condo detail access
- Fractions inherit condo address by default
- Identifier auto-appends to Address Line 2
- Smart invite system handles existing/new users automatically
- Data reset preserves admin and condo types only

---

**End of Recovery Point Documentation**
