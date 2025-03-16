
import React, { ErrorInfo, Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryWrapper extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // In a real app, you might send this to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({
      hasError: false,
      error: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <Card className="mx-auto max-w-md my-8">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertCircle className="mr-2 h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>An error occurred in the application:</p>
              <pre className="mt-2 p-4 bg-muted rounded-md overflow-auto text-xs">
                {this.state.error?.message || 'Unknown error'}
              </pre>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={this.resetErrorBoundary}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWrapper;
