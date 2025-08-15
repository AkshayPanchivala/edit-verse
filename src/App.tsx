import React, { useEffect, useState } from 'react';
import DocumentEditor from './components/DocumentEditor';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [initialContent, setInitialContent] = useState<string | undefined>(undefined);

  useEffect(() => {
    // In a real application, you would fetch the initial content from an API
    const fetchInitialContent = async () => {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setInitialContent(`
        <em><strong>"Welcome to EditVerse, a powerful document editor crafted by Akshay Panchivala. Unleash your creativity and streamline your document creation process!"</strong></em>

        <h1>EditVerse: Your Professional Document Editor</h1>
        <p>This application demonstrates a robust and interactive web-based document editor, meticulously designed to provide a seamless document creation and editing experience. It highlights key features essential for a production-ready application, including advanced text formatting, dynamic page management, and an intuitive user interface.</p>

        <h2>Key Features</h2>
        <ul>
          <li><strong>Rich Text Editing:</strong> Comprehensive text formatting options including bold, italic, underline, various font sizes, and text alignment. Supports ordered and unordered lists.</li>
          <li><strong>Page Management:</strong> Seamless handling of document pages, including dynamic page breaks and the ability to add or remove pages.</li>
          <li><strong>Intuitive User Interface:</strong> A clean and responsive design built with Tailwind CSS for rapid styling and maintainability, ensuring a smooth user experience across devices.</li>
          <li><strong>Modular Component Design:</strong> Well-structured React components promoting reusability, maintainability, and scalability, making the codebase easy to understand and extend.</li>
          <li><strong>Fast Development Workflow:</strong> Leverages Vite for lightning-fast hot module reloading and optimized builds, significantly enhancing developer productivity.</li>
          <li><strong>TypeScript Integration:</strong> Ensures robust type safety throughout the application, leading to fewer runtime errors and improved code quality and maintainability.</li>
        </ul>

        <h2>Getting Started</h2>
        <p>EditVerse is designed for ease of use. Simply start typing to create your document. Use the toolbar at the top to access various formatting options, insert page breaks, and manage your document's structure. The editor automatically handles pagination, ensuring your content is perfectly laid out for printing or export.</p>

        <p>Explore the features and experience the efficiency of a modern document editor. We hope you find EditVerse a valuable tool for all your document creation needs.</p>
      `);
    };

    fetchInitialContent();
  }, []);

  return (
    <div className="min-h-screen">
      <ErrorBoundary>
        {initialContent !== undefined ? (
          <DocumentEditor
            initialContent={initialContent}
            onContentChange={(content) => {
              // Handle content changes for autosave, etc.
              console.log('Content updated:', content.length, 'characters');
            }}
          />
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading document...</p>
            </div>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default App;
