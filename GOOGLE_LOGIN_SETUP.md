# Google Login Setup Guide

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Database Configuration (if not already set)
DATABASE_URL=your-database-url-here
```

## 2. Generate NextAuth Secret

Generate a secure random string for `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

## 3. Google OAuth Setup

### Step 1: Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

### Step 2: Enable Google+ API

1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" if available

### Step 3: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret to your `.env.local` file

## 4. Database Migration

Run the database migration to create the new authentication tables:

```bash
npm run migration:generate
npm run db:push
```

## 5. Start the Application

```bash
npm run dev
```

## 6. Test the Login

1. Visit `http://localhost:3000`
2. Click "Sign In" in the navigation
3. You should be redirected to Google's OAuth consent screen
4. After successful authentication, you'll be redirected back to your app

## Features Included

- ✅ Google OAuth authentication
- ✅ Session management with NextAuth.js
- ✅ Database integration with Drizzle ORM
- ✅ User profile display
- ✅ Sign in/out functionality
- ✅ Responsive navigation
- ✅ Modern UI with Tailwind CSS

## File Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth API routes
│   ├── auth/signin/page.tsx             # Sign-in page
│   ├── layout.tsx                       # Root layout with SessionProvider
│   └── page.tsx                         # Home page with navigation
├── components/
│   ├── Navigation.tsx                   # Navigation component
│   └── providers/
│       └── SessionProvider.tsx          # NextAuth session provider
├── db/
│   └── schema/
│       └── tables.ts                    # Updated database schema
└── lib/
    └── auth.ts                          # NextAuth configuration
```

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**: Make sure your redirect URI in Google Console matches exactly with your app URL
2. **"NEXTAUTH_SECRET not set"**: Generate and set a secure secret key
3. **Database connection issues**: Verify your DATABASE_URL is correct
4. **"Provider not found"**: Ensure Google+ API is enabled in Google Cloud Console

### For Production:

1. Update `NEXTAUTH_URL` to your production domain
2. Add your production domain to Google OAuth redirect URIs
3. Use a secure `NEXTAUTH_SECRET` (different from development)
4. Set up proper environment variables in your hosting platform
