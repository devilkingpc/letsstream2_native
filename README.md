# Let's Stream Native

An open-source React Native app for streaming movies and TV shows using TMDB and multiple video sources.

## Features
- Browse trending movies and TV shows
- Search for content
- View detailed info, cast, and episodes
- Stream from multiple video sources
- User profile and settings

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation
Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd letsstream2_native
yarn install # or npm install
```

### Environment Variables
Create a `.env` file in the root directory:

```env
TMDB_API_KEY=your_tmdb_api_key_here
```

> **Note:** Never commit your API keys to version control.

### Running the App

```bash
npx expo start --clean
```

### Publishing & Updates

```bash
npx expo login
npx expo whoami
npx eas update --branch dev --message "commit message"
```

## Project Structure

- `components/` - Reusable UI components
- `constants/` - App-wide constants (e.g., video sources)
- `screens/` - App screens (Home, Details, Player, etc.)
- `types/` - TypeScript types
- `android/` - Android native project
- `assets/` - Images and icons

## Security
- API keys should be stored in environment variables (see above).
- For extra security, consider using a backend proxy for API requests.

## License

GNU-V3
