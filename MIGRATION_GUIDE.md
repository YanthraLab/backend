# Migration from MongoDB to Supabase - Complete! 🎉

## What Was Changed

### Backend Files Modified:
1. **User.model.js** - Converted from Mongoose model to Supabase client wrapper
2. **auth.service.js** - Updated to use new Supabase User model
3. **adminBootstrap.service.js** - Updated admin creation logic for Supabase
4. **token.js** - Updated to support both `user.id` (Supabase) and `user._id` (legacy)
5. **auth.controller.js** - Updated to use `user.id` from Supabase
6. **package.json** - Removed mongoose dependency
7. **db.js** - Deleted (MongoDB config no longer needed)

### Frontend Files:
No changes needed - the frontend API calls remain the same as they use the same REST endpoints.

## Setup Instructions

### Step 1: Create Supabase Table
Run the SQL script in your Supabase SQL Editor:

```bash
# File: supabase_schema.sql
```

Navigate to your Supabase project → SQL Editor → New Query, then paste and run the contents of `supabase_schema.sql`.

### Step 2: Update Environment Variables
Your `.env` file already has the correct Supabase credentials:
```
SUPABASE_URL=https://fqubtdjztzmjmcbmacnp.supabase.co
SUPABASE_SERVICE_KEY=sb_publishable_iSNkLFxPbNc2hEKFZXsOiA_2eIKawE9
```

⚠️ **IMPORTANT**: You're currently using a publishable key. For backend operations, you should use the **service role key** instead. Get it from:
Supabase Dashboard → Project Settings → API → `service_role` key (secret)

Update your `.env`:
```
SUPABASE_SERVICE_KEY=your_actual_service_role_key_here
```

### Step 3: Install Dependencies
```bash
cd yanthra_backend
npm install
```

This will remove mongoose and ensure all dependencies are up to date.

### Step 4: Start the Server
```bash
npm run dev
```

## Database Schema Comparison

### MongoDB (Old)
```javascript
{
  _id: ObjectId,
  email: String,
  password: String,
  name: String,
  birthday: Date,
  role: String,
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Supabase (New)
```sql
{
  id: UUID (PRIMARY KEY),
  email: VARCHAR(255) UNIQUE,
  password: TEXT,
  name: VARCHAR(255),
  birthday: DATE,
  role: VARCHAR(50),
  refresh_token: TEXT,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

## API Endpoints (No Changes)
All endpoints remain the same:
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

## Key Differences

1. **ID Field**: Changed from `_id` (MongoDB) to `id` (Supabase UUID)
2. **Field Names**: `refreshToken` → `refresh_token` (snake_case in DB, camelCase in code)
3. **Timestamps**: Automatic via PostgreSQL triggers
4. **Queries**: Direct Supabase client queries instead of Mongoose methods

## Testing

Test the migration with:

### Signup
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "rememberMe": true
  }'
```

## Migration Notes

✅ **Completed:**
- User model converted to Supabase
- All auth services migrated
- Admin bootstrap updated
- MongoDB dependencies removed
- Backward compatible ID handling

🔄 **No Changes Needed:**
- Frontend API calls (same endpoints)
- Validation schemas
- Middleware functions
- Error handling

⚠️ **Important:**
1. Run the SQL schema in Supabase before starting the server
2. Update SUPABASE_SERVICE_KEY to use service role key (not publishable key)
3. Existing MongoDB data won't be automatically migrated - you'll need to export/import manually if needed

## Next Steps (Optional)

1. **Data Migration**: If you have existing MongoDB data, export it and import to Supabase
2. **Row Level Security**: Review and customize RLS policies in `supabase_schema.sql`
3. **Add More Features**: 
   - Password reset with Supabase Auth
   - Email verification
   - Social login providers
   - Real-time subscriptions

## Troubleshooting

**Error: "Missing Supabase credentials"**
- Check `.env` file has both `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`

**Error: "relation 'users' does not exist"**
- Run `supabase_schema.sql` in Supabase SQL Editor

**Error: "Invalid API key"**
- Ensure you're using the service role key, not the anon/publishable key

---

**Migration completed successfully!** 🚀
Your backend now uses Supabase instead of MongoDB while maintaining the same API interface.
