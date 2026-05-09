# Colorblind Style

A React Native app that helps color-blind individuals confidently match clothing using their smartphone camera. The app uses on-device color sampling to identify colors in real time and scores how well two colors match based on color theory.

## Tech Stack

- [Expo](https://expo.dev) (managed workflow) with [Expo Router](https://expo.github.io/router) for file-based navigation
- [React Native Vision Camera](https://mrousavy.com/react-native-vision-camera/) for frame-level camera access
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) for local persistence of saved matches
- TypeScript throughout
- Jest for unit testing the color engine

## Project Structure

```
colorblind-style/
├── app/
│   ├── _layout.tsx          # Root navigator
│   ├── +not-found.tsx
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigator
│       ├── camera.tsx       # Main scan view
│       ├── results.tsx      # Match score screen
│       └── saved.tsx        # Saved matches grid
├── src/
│   ├── color/
│   │   ├── engine.ts        # Color analysis logic (RGB → HSL, hue distance, match scoring)
│   │   └── names.json       # Named color dictionary
│   ├── components/          # Shared UI components
│   ├── constants/
│   │   └── theme.ts         # Design tokens
│   ├── db/
│   │   ├── schema.ts        # SQLite schema
│   │   └── queries.ts       # Read/write helpers
│   ├── hooks/               # Custom hooks (useColorSampler, etc.)
│   ├── store/
│   │   └── useMatchStore.ts # Zustand store
│   └── types/
│       └── index.ts         # Shared TypeScript types
└── assets/
```

## Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator via Xcode, or a physical iOS device with the [Expo Go](https://expo.dev/client) app

## Running Locally

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

From there, press `i` to open in the iOS simulator or scan the QR code with Expo Go on a physical device.

> Note: React Native Vision Camera requires a physical device for live camera frame processing. The iOS simulator does not support camera input.

## Running Tests

```bash
npm test
```

Tests live in `src/__tests__/` and focus on the color engine logic.

## Building for TestFlight

This project uses [EAS Build](https://docs.expo.dev/build/introduction/). Requires an Expo account and Apple Developer Program membership.

```bash
npm install -g eas-cli
eas login
eas build --platform ios
```

## Color Matching Logic

Color analysis is done entirely on-device with no external API calls. The pipeline is:

1. Sample the RGB value at the crosshair pixel from the camera frame
2. Convert RGB to HSL
3. Map the HSL value to a named color via a static dictionary
4. On the second scan, compute the hue angle distance between the two colors
5. Classify the relationship (analogous, complementary, triadic, etc.)
6. Produce a match score from 0–100

## License

MIT
