# TradeYa

A skill trading platform that connects professionals to exchange expertise and collaborate on projects.

## Features

- Skill trading marketplace
- Project collaboration
- Real-time messaging
- User profiles with reputation system
- Weekly and monthly challenges
- Admin dashboard

## Tech Stack

- React + TypeScript
- Vite
- Firebase (Auth, Firestore, Storage)
- TailwindCSS
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn
- Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tradeya.git
   cd tradeya
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your Firebase configuration

5. Start development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── lib/          # Utility functions
├── services/     # External service integrations
├── styles/       # Global styles and theme
├── types/        # TypeScript definitions
└── utils/        # Helper functions
```

## Development Workflow

1. Create feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make changes and commit:
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

3. Push changes and create PR:
   ```bash
   git push origin feature/your-feature
   ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Configuration

### Environment Variables

- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID`: Firebase app ID
- `VITE_FIREBASE_MEASUREMENT_ID`: Firebase measurement ID

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Set up Storage rules
5. Add web app to project
6. Copy configuration to .env

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.