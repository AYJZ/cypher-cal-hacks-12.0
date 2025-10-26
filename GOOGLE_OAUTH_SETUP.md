# Google OAuth Setup Guide

## Overview
The Google login is currently failing with an "invalid_client" error because Google OAuth is not properly configured in both Supabase and Google Cloud Console.

## Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Name it (e.g., "CypherAI Language App")

4. **Configure OAuth Consent Screen**
   - Go to "OAuth consent screen"
   - Choose "External" user type
   - Fill in required fields:
     - App name: "CypherAI"
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: email, profile, openid

5. **Set Authorized JavaScript Origins**
   Add these URLs:
   ```
   http://localhost:5173
   http://localhost:5174
   https://jsqibiqcglrwkanvzvdd.supabase.co
   ```
   Also add your production domain when deployed.

6. **Set Authorized Redirect URIs**
   Add this exact URL:
   ```
   https://jsqibiqcglrwkanvzvdd.supabase.co/auth/v1/callback
   ```

7. **Copy Credentials**
   After saving, copy:
   - Client ID
   - Client Secret

## Step 2: Supabase Configuration

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to "Authentication" → "Providers"

2. **Enable Google Provider**
   - Find "Google" in the list
   - Toggle it ON
   - Paste your:
     - Client ID
     - Client Secret
   - Click "Save"

3. **Verify Auth Settings**
   - Go to "Authentication" → "URL Configuration"
   - Ensure "Site URL" is set to your app URL (e.g., `http://localhost:5173` for development)
   - Add additional redirect URLs if needed

## Step 3: Test the Setup

1. Clear your browser cache/cookies
2. Try logging in with Google again
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you'll be redirected back to your app

## Troubleshooting

### "invalid_client" Error
- Double-check Client ID and Secret are correctly copied
- Ensure no extra spaces or characters
- Verify the redirect URI matches exactly

### Redirect Issues
- Make sure the redirect URI in Google Console matches Supabase's callback URL exactly
- The format must be: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

### Session Not Created
- Check browser console for errors
- Verify Supabase URL and anon key in your app
- Check Network tab to see if auth requests are successful

## Current Code Status

The authentication code in your app is correctly implemented:
- `AuthContext` properly handles OAuth flow
- Redirect URL is dynamically set based on current origin
- Session management is in place

Once you configure Google OAuth in both Google Cloud Console and Supabase Dashboard as described above, the login should work correctly.
