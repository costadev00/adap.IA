This repository contains the front-end code for the adap.IA project, an application focused on [brief description of the project, e.g., "facilitating learning through adaptive artificial intelligence resources"]. The front-end is built using React and other modern libraries to ensure a smooth and responsive user interface.
Project Structure

The project is organized into various folders and files to keep the code clean and modular:

- public: Contains static files that are not processed by Webpack, like index.html, icons, and other public resources.
- src: The main folder that holds all the source code for the React application.
        components/: Contains all reusable UI components, such as buttons, headers, forms, etc.
        pages/: Contains main components that represent the application pages (e.g., Home, Dashboard, etc.).
        services/: Contains code for integrating with external APIs, usually using Axios for HTTP requests.
        styles/: CSS or SASS style files used across the application for consistent styling.
        App.js: The main application file that organizes routes and the overall layout.
        index.js: The entry point of the React application, where ReactDOM renders the app onto the HTML page.
        package.json: Contains project information, such as name, version, dependencies, and useful scripts for development and production.

Technologies Used

The adap.IA front-end was built using the following technologies:

- React: A popular JavaScript library for building user interfaces based on components.
- React Router: Used for route management, enabling navigation between pages without full-page reloads.
- Axios: A library for making HTTP requests easily and efficiently.
- SASS: A CSS preprocessor that helps write cleaner, more organized styles, with support for variables, mixins, and more.

Prerequisites

Before getting started, make sure you have Node.js and npm (or yarn) installed on your machine.
Installation

To set up the project locally, follow these steps:

- Clone the repository:

git clone https://github.com/jonathanbff/adap.IA.git

Navigate to the front-end directory:

cd adap.IA/adap-ai-front-end

Install the dependencies:

```
npm install
# This will install all the dependencies listed in package.json.
```

Usage

To run the application in development mode, use the following command:

npm start

The application will automatically open at http://localhost:3000 in your browser. If it doesn't, you can access it manually.
Available Scripts

```
    npm start: Starts the development server in interactive mode. The page will automatically reload if you make changes to the code.
    npm run build: Builds the app for production, creating optimized files in the build folder.
    npm test: Runs the automated tests for the application.
    npm run eject: Removes the default Create React App configuration. Use with caution, as this action is irreversible.
```
Environment Variables Setup

If the application depends on environment variables, such as API keys or service URLs, you can configure them in a .env file at the root of the project. Example:

REACT_APP_API_URL=http://your-api-url.com
REACT_APP_API_KEY=your-api-key

Be sure not to share sensitive information in public repositories.
Component Structure

The application is built using a component-based approach. This means that each part of the UI (like buttons, forms, or page sections) is encapsulated in a React component. This makes the code easier to maintain and reuse.

```
    Atomic Components: Simple components, such as buttons or inputs, used throughout the application.
    Page Components: Larger structures representing entire pages of the application.
```

Contribution

Contributions are welcome! If you have suggestions or find any issues, feel free to open an issue or submit a pull request. Please follow coding best practices and write a brief description of your changes in the PR.
License

This project is licensed under the MIT License. This means you can use, modify, and distribute it freely, as long as you mention the original license.
