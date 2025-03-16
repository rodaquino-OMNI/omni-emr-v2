
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { SectorProvider } from './hooks/useSectorContext';
import { appRoutes } from './routes';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="omnicare-theme">
        <AuthProvider>
          <SectorProvider>
            <Router>
              <Routes>
                {appRoutes.map((route, index) => {
                  // If the route has children, it will be handled by its element (like ProtectedRoute)
                  if (route.children) {
                    return (
                      <Route key={index} path={route.path} element={route.element}>
                        {route.children.map((childRoute, childIndex) => (
                          <Route
                            key={`${index}-${childIndex}`}
                            path={childRoute.path}
                            element={childRoute.element}
                          />
                        ))}
                      </Route>
                    );
                  }
                  
                  // Simple route
                  return (
                    <Route 
                      key={index} 
                      path={route.path} 
                      element={route.element} 
                    />
                  );
                })}
              </Routes>
              <Toaster position="top-right" richColors closeButton />
            </Router>
          </SectorProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
