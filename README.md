# Drink Tracker

A simple, responsive iOS web app for tracking drinks and foods with Firebase integration.

## Features

- 🚀 **Quick Add**: One-tap logging for common drinks (Coca Cola, Coffee, Water, etc.)
- 📱 **Mobile-First**: Optimized for iOS devices with responsive design
- 🔄 **Real-time Sync**: Firebase integration for data persistence
- 📊 **Daily Stats**: Track total items and unique items consumed
- ⚡ **PWA Ready**: Installable as a web app on iOS
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase Firestore
- **Deployment**: Vercel
- **PWA**: Service Worker, Web App Manifest

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Firebase project
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd drink-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Get your Firebase configuration
   - Replace the `firebaseConfig` object in `index.html` with your actual config

4. Run locally:
```bash
npm run dev
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Firestore Database
4. Go to Project Settings > General > Your apps
5. Add a web app and copy the config
6. Replace the config in `index.html`

### Deployment

1. Push to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

Or use Vercel CLI:
```bash
npm run deploy
```

## Usage

1. **Quick Add**: Tap any of the predefined drink buttons to instantly log an item
2. **Custom Items**: Tap the "+" button to add custom items
3. **View Log**: See all items logged today with timestamps
4. **Stats**: Check your daily consumption statistics

## File Structure

```
drink-tracker/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── app.js             # JavaScript application logic
├── manifest.json      # PWA manifest
├── sw.js             # Service worker
├── package.json      # Node.js dependencies
├── vercel.json       # Vercel deployment config
└── README.md         # This file
```

## Customization

### Adding New Quick Items

Edit the `quick-add-grid` section in `index.html`:

```html
<button class="quick-item" data-item="Your Item">🍺 Your Item</button>
```

### Styling

Modify `styles.css` to change colors, fonts, or layout. The app uses CSS custom properties for easy theming.

### Firebase Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /drinkLogs/{document} {
      allow read, write: if true; // Adjust based on your auth needs
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
