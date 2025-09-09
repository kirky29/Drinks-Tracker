# Firebase Setup Instructions

## 1. Firebase Configuration

The app is already configured with your Firebase project details in `firebase-config.js`:

```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyBQJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8",
  authDomain: "drink-tracker-9a8b7.firebaseapp.com",
  projectId: "drink-tracker-9a8b7",
  storageBucket: "drink-tracker-9a8b7.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

## 2. Firestore Rules

Deploy the Firestore rules from `firestore.rules` to your Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `drink-tracker-9a8b7`
3. Go to **Firestore Database** > **Rules**
4. Replace the existing rules with the content from `firestore.rules`
5. Click **Publish**

The rules ensure that:
- Users can only read/write their own data
- Authentication is required for all operations
- Data is properly isolated by user ID

## 3. Authentication Setup

The app uses Firebase Authentication with email/password login only (no sign-up).

### To create user accounts:

1. Go to **Authentication** > **Users** in Firebase Console
2. Click **Add user**
3. Enter email and password for each user
4. Users can then log in using these credentials

### Authentication Features:
- ✅ Email/password login only
- ✅ No sign-up (admin creates accounts)
- ✅ Automatic logout on session expiry
- ✅ Secure user data isolation

## 4. Data Structure

### Collections:

#### `drinkLogs`
```javascript
{
  name: string,           // Item name
  volume: number,         // Volume amount
  unit: string,          // Unit (ml, l, oz, etc.)
  price: number,         // Price in £
  timestamp: Timestamp,  // When logged
  dateString: string,    // Formatted date
  timeString: string,    // Formatted time
  date: string,          // Date key (YYYY-MM-DD)
  userId: string         // User ID
}
```

#### `quickItems`
```javascript
{
  name: string,          // Item name
  volume: number,        // Default volume
  unit: string,         // Default unit
  price: number,        // Default price
  category: string,     // Category (drinks, food, custom)
  emoji: string,        // Display emoji
  userId: string        // User ID
}
```

## 5. Security Features

- **User Isolation**: Each user can only access their own data
- **Authentication Required**: All operations require valid authentication
- **Data Validation**: Firestore rules validate user ownership
- **Secure Sync**: Data syncs only when user is authenticated

## 6. Offline Support

The app works offline with localStorage fallback:
- Data is saved locally when offline
- Automatically syncs to Firestore when online and authenticated
- Seamless transition between online/offline modes

## 7. Testing

1. Start the development server: `npm run dev`
2. Open the app in your browser
3. Try logging in with test credentials
4. Add some items and verify they sync to Firestore
5. Check the Firebase Console to see the data

## 8. Deployment

When ready to deploy:
1. Build the app for production
2. Deploy to Vercel (or your preferred platform)
3. Update Firebase project settings if needed
4. Test the live deployment

The app is now fully integrated with Firebase Authentication and Firestore! 🎉
