
import { createRoot } from 'react-dom/client'
import { LanguageProvider } from './context/LanguageContext';
import App from './App.tsx'
import './index.css'

// Get the root element and create a root
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML.");
}

createRoot(rootElement).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
