import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    //  log the error to an error reporting service
    console.error("Error caught in ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      //  render custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
