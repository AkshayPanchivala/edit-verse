# EditVerse

## Project Overview

This project presents a robust and interactive web-based document editor, meticulously crafted to demonstrate proficiency in modern web development practices. Built with **React** and **Vite**, it showcases a component-driven architecture, efficient state management, and a clean, responsive user interface. This application is designed to provide a seamless document creation and editing experience, highlighting key features essential for a production-ready application.

## Key Features

*   **Rich Text Editing:** Comprehensive text formatting options including bold, italic, underline, various font sizes, and text alignment. Supports ordered and unordered lists.
*   **Page Management:** Seamless handling of document pages, including dynamic page breaks and the ability to add or remove pages.
*   **Intuitive User Interface:** A clean and responsive design built with **Tailwind CSS** for rapid styling and maintainability, ensuring a smooth user experience across devices.
*   **Modular Component Design:** Well-structured React components promoting reusability, maintainability, and scalability, making the codebase easy to understand and extend.
*   **Fast Development Workflow:** Leverages **Vite** for lightning-fast hot module reloading and optimized builds, significantly enhancing developer productivity.
*   **TypeScript Integration:** Ensures robust type safety throughout the application, leading to fewer runtime errors and improved code quality and maintainability.

## Technologies Used

*   **Frontend:**
    *   **React.js:** A declarative, component-based JavaScript library for building user interfaces.
    *   **TypeScript:** A superset of JavaScript that adds static typing.
    *   **Vite:** A next-generation frontend tooling that provides an extremely fast development experience.
    *   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
*   **Tooling:**
    *   **ESLint:** For consistent code quality and style.
    *   **Prettier:** For automatic code formatting.

## Project Structure

```
edit-verse/
├───.gitignore
├───eslint.config.js
├───index.html
├───package-lock.json
├───package.json
├───postcss.config.js
├───README.md
├───tailwind.config.js
├───tsconfig.app.json
├───tsconfig.json
├───tsconfig.node.json
├───vite.config.ts
├───.git\...
├───node_modules\...
└───src\
    ├───App.tsx
    ├───constants.ts
    ├───index.css
    ├───main.tsx
    ├───vite-env.d.ts
    ├───components\
    │   ├───DocumentEditor.tsx
    │   ├───DocumentFooter.tsx
    │   ├───DocumentHeader.tsx
    │   ├───DocumentPage.tsx
    │   ├───DocumentToolbar.tsx
    │   ├───ErrorBoundary.tsx
    │   ├───PageBreakComponent.tsx
    │   ├───ToolbarButton.tsx
    │   └───ToolbarSeparator.tsx
    └───extensions\
        └───PageBreak.ts
```
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed on your machine:

*   [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
*   [npm](https://www.npmjs.com/get-npm) (Node Package Manager, usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd project # Navigate into the project directory
    ```
    *(Note: Replace `<repository-url>` with the actual URL if this project is hosted on Git.)*

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server with hot-reloading for local development:

```bash
npm run dev
```

This command will typically open the application in your default web browser at `http://localhost:5173`.

### Building for Production

To build the optimized, production-ready version of the application:

```bash
npm run build
```

This will compile and bundle the application into the `dist/` directory, ready for deployment to a static hosting service.

### Code Quality and Formatting

*   **Linting:** To check for code style and potential errors:
    ```bash
    npm run lint
    ```
*   **Formatting:** (If Prettier is configured, add a command like `npm run format` or `npx prettier --write .`)

## Future Enhancements (Optional - Consider adding specific ideas)

*   **Real-time Collaboration:** Implement WebSocket for multi-user editing.
*   **Export Options:** Add functionality to export documents to PDF, DOCX, etc.
*   **Cloud Integration:** Save and load documents from cloud storage services.
*   **Advanced Formatting:** Introduce more sophisticated text formatting options (e.g., tables, images).

