# Clerk Authentication Setup Guide

This project is designed to use **Clerk** for user authentication. Currently, the app uses temporary user IDs for development.

## Quick Setup (When Ready)

### 1. Install Clerk

```bash
npm install @clerk/clerk-react
```

### 2. Get Clerk Keys

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Get your **Publishable Key** from the dashboard

### 3. Add Environment Variables

Add to `Frontend/.env.local`:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 4. Wrap App with ClerkProvider

Update `Frontend/src/main.jsx`:

```jsx
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProviderWithClerk client={convex}>
        <BrowserRouter>
          <UserProvider>
            <App />
          </UserProvider>
        </BrowserRouter>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
);
```

### 5. Update Components to Use Clerk

Replace temporary userId with Clerk's `useUser`:

**In Onboarding.jsx:**
```jsx
import { useUser as useClerkUser } from '@clerk/clerk-react';

const { user } = useClerkUser();
const userId = user?.id || `temp_user_${Date.now()}`;
```

**In ProductInput.jsx:**
```jsx
import { useUser as useClerkUser } from '@clerk/clerk-react';

const { user } = useClerkUser();
const userId = user?.id || userProfile?.userId;
```

### 6. Add Sign In/Sign Up Pages

```jsx
import { SignIn, SignUp, UserButton } from '@clerk/clerk-react';

// Add routes
<Route path="/sign-in" element={<SignIn />} />
<Route path="/sign-up" element={<SignUp />} />
```

### 7. Backend Convex Integration

Convex automatically integrates with Clerk! Just:

1. Go to Convex Dashboard → Settings → Authentication
2. Select "Clerk" and enter your domain
3. Use `ctx.auth.getUserIdentity()` in backend functions

---

## Current Implementation (Development)

The app currently uses:
- **Temporary User IDs**: `temp_user_${Date.now()}`
- **No authentication required**: Users can access all features
- **Stored in UserContext**: Profile data persists during session

This allows development and testing without authentication overhead.

---

## Migration Checklist

When ready to add Clerk:

- [ ] Install `@clerk/clerk-react`
- [ ] Get Clerk publishable key
- [ ] Add environment variable
- [ ] Update `main.jsx` with ClerkProvider
- [ ] Replace temp userId in Onboarding.jsx
- [ ] Replace temp userId in ProductInput.jsx
- [ ] Add SignIn/SignUp routes
- [ ] Configure Convex with Clerk in dashboard
- [ ] Update backend functions to use `ctx.auth`
- [ ] Add protected routes with `<RedirectToSignIn />`
- [ ] Test authentication flow


