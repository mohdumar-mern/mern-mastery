import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Optionally log to a service like Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4 text-red-500">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'Please try again later.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;