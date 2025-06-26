# Test Application - TryLoop Authentication Demo

This is a demo application that demonstrates how to use the centralized authentication system from auth.tryloop.ai.

## Features

- Checks for valid session cookie on load
- Redirects to auth.tryloop.ai if not authenticated
- Displays user information from Firebase
- Supports logout functionality
- Works across all *.tryloop.ai subdomains

## Setup

1. Install dependencies:
```bash
cd test.tryloop.ai
yarn install
```

2. Start the development server:
```bash
yarn dev
```

3. Access the application at: http://local.tryloop.ai:3001

## How it works

1. When you visit the test application, it checks for a valid session cookie
2. If no cookie is found, it redirects to auth.tryloop.ai with a redirect_uri parameter
3. After successful login at auth.tryloop.ai, you're redirected back to test.tryloop.ai
4. The app then displays your user information fetched from Firebase

## Authentication Flow

```
User visits test.tryloop.ai
    ↓
Check session cookie (/auth/status API)
    ↓
If not authenticated:
    → Redirect to auth.tryloop.ai?redirect_uri=http://test.tryloop.ai
    → User logs in
    → Redirect back to test.tryloop.ai
    ↓
If authenticated:
    → Display user information
    → Fetch additional data from Firebase
```

## Important Notes

- The session cookie is set with domain=".tryloop.ai" so it works across all subdomains
- Make sure to access the app via local.tryloop.ai:3001 (not localhost) for cookies to work properly
- The Firebase configuration is shared with the auth application