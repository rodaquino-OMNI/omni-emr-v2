
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error, 
      errorInfo: null 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the console
    console.error("Uncaught error:", error, errorInfo);
    
    // Save error info for display
    this.setState({
      errorInfo
    });
    
    // Call optional onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // In a production app, you would log this to an error reporting service
    // Example: errorReportingService.captureException(error, { extra: errorInfo });
    
    // Display a toast notification
    toast.error('An unexpected error occurred', {
      description: error.message || 'The application encountered a problem.',
      icon: <AlertTriangle className="h-5 w-5" />,
      duration: 5000
    });
  }

  handleRetry = (): void => {
    // Reset the error state
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null
    });
  }

  handleNavigateHome = (): void => {
    // Reset the error state and navigate to dashboard
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null
    });
    window.location.href = '/dashboard';
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="w-full p-6 flex flex-col items-center justify-center min-h-[300px]">
          <Alert variant="destructive" className="max-w-lg">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="font-medium mb-2">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              
              {/* Show more technical details in an expandable section */}
              <details className="mt-2 text-xs bg-background/80 p-2 rounded">
                <summary className="cursor-pointer">Technical Details</summary>
                <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-[200px]">
                  {this.state.error?.stack || 'No stack trace available'}
                </pre>
              </details>
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={this.handleRetry}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
            
            <Button 
              variant="default"
              onClick={this.handleNavigateHome}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Return to Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
