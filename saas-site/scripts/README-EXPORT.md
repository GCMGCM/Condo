# Database Export to CSV

This script exports all MongoDB collections to CSV files for easy viewing and backup.

## Local Export

To export from your **local** MongoDB database:

```bash
cd saas-site
node scripts/export-to-csv.js
```

CSV files will be created in `saas-site/exports/`

## Production Export

To export from your **production** MongoDB database (MongoDB Atlas):

### Step 1: Get your production MongoDB URI

From your `.env` file or Vercel environment variables, copy your `MONGODB_URI`

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Step 2: Run with production URI

**Windows:**
```cmd
cd saas-site
set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
node scripts/export-to-csv.js
```

**Mac/Linux:**
```bash
cd saas-site
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority" node scripts/export-to-csv.js
```

## Output

The script exports these collections:
- `users.csv` - User accounts
- `condos.csv` - Condominium properties
- `condomanagers.csv` - Manager assignments
- `fractions.csv` - Property fractions/units
- `condotypes.csv` - Condo types
- `condomanagerinvites.csv` - Manager invitations
- `supportinvites.csv` - Support team invitations
- `userlogs.csv` - User activity logs
- `adminlogs.csv` - Admin/support activity logs

All files are saved to `saas-site/exports/` directory.

## Note

The `exports/` directory is gitignored to prevent sensitive data from being committed to the repository.
