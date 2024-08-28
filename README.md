# Crypto-App

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Overview

The `crypto-app` is a web application that provides real-time cryptocurrency data from various exchanges. The application is built with Next.js and leverages React Query for efficient data fetching and caching. It includes features such as pagination, error handling, and a flexible service layer for managing business logic.

## Project Structure

The project is organized into several key directories:

- **`src/app/`**: Contains the main application code, including API routes, services, and global providers.
  - **`api/`**: Custom API routes for fetching cryptocurrency data from external APIs.
    - **`services/`**: Contains service classes that encapsulate business logic and data fetching.
      - **`CacheServices.ts`**: Handles caching logic for the application (currently not included in the production version due to issues in production).
      - **`TickerService.ts`**: Service responsible for fetching and processing ticker data from multiple exchanges.
      - **`TradingPairsServices.ts`**: Service responsible for fetching and managing trading pairs data.
    - **`/ticker/`**: API route that fetches and caches ticker data using `TickerService`.
    - **`/trading-pairs/`**: Handles paginated requests for trading pairs information using `TradingPairsServices`.
  - **`constants/`**: Holds constants like API endpoint URLs.
  - **`layout.tsx`**: Defines the global layout for the application, including the integration of React Query via `ReactQueryProvider`.
  - **`page.tsx`**: The main entry point for the app, responsible for rendering the main components.

- **`src/components/`**: Contains the React components used throughout the application.
  - **`AverageSidePanel.tsx`**: Displays the average ticker values, handling loading states and errors.
  - **`BitstampTab.tsx`**: Shows detailed information for a specific trading pair.
  - **`ButtonsGroup.tsx`**: Renders a virtuallized list with lazy loading of trading pairs and allows users to select one for detailed viewing.
  - **`DetailedSidePanel.tsx`**: Manages the interaction between `ButtonsGroup` and `BitstampTab`.
  - **`GJNumberLabel.tsx`**: A reusable component for displaying numbers with descriptions.
  - **`GJNumbersView.tsx`**: A component for viewing a list of numbers with descriptions.
  - **`LoadingSpinner.tsx`**: A reusable loading spinner component.

- **`src/types/`**: Contains TypeScript types and interfaces used in the application for type safety.
  - **`TickerData.ts`**: Defines the structure for the ticker data returned by the API.
  - **`SelectedTradingPair.ts`**: Defines the structure for the selected trading pair data.

- **`src/utils/`**: Utility functions used across the app.
  - **`timeConverter.ts`**: A utility function for converting Unix timestamps to readable time strings.

- **`tests/`**: Contains unit tests for the API routes and components to ensure the app's robustness and reliability.
  - **`app/api/ticker/`**: Tests for the `/api/ticker` route, covering various scenarios including error handling and data fetching.
  - **`app/api/trading-pairs/`**: Tests for the `/api/trading-pairs` route and its sub-routes.
  - **`components/`**: Tests for components like `GJNumbersView` to ensure they render correctly and handle edge cases.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (>= 14.x)
- npm, Yarn, pnpm, or Bun (depending on your preference)

### Running the Development Server

To run the development server, use one of the following commands depending on your package manager:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

This will start the Next.js development server on [http://localhost:3000](http://localhost:3000). Open this URL in your browser to see the app in action.

### Testing

To run the tests, use:

```bash
npm test
# or
yarn test
# or
pnpm test
# or
bun test
```

This will execute the unit tests and provide you with a summary of the results. To check the test coverage, you can use:

```bash
npm test -- --coverage
# or
yarn test --coverage
# or
pnpm test -- --coverage
# or
bun test --coverage
```

### Building for Production

To create an optimized production build, run:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

This command will output the build files to the `.next/` directory, which can be deployed to any static hosting service.

## Deployment
 
Deployed version on Vercel: https://crypto-app-indol-seven.vercel.app/
Deployed version on Netlify: https://crypto-app-gj.netlify.app/
