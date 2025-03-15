
import { createRoot } from 'react-dom/client'
import { LanguageProvider } from './context/LanguageContext';
import App from './App.tsx'
import './index.css'

// Get the root element and create a root
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML.");
}

const root = createRoot(rootElement);

// Render the app with error handling
try {
  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.error("Error rendering application:", error);
  
  // Fallback rendering if main app fails
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h1 className="text-xl font-bold text-red-500 mb-2">Application Error</h1>
        <p className="text-gray-700">Sorry, the application failed to load. Please try refreshing the page.</p>
        <pre className="mt-4 p-2 bg-gray-100 text-sm overflow-auto">
          {String(error)}
        </pre>
      </div>
    </div>
  );
}
