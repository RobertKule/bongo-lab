import React from 'react';
import translations from '../utils/translations';

/**
 * Error boundary to catch rendering errors in simulation components.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center p-6">
          <p className="text-red-500 font-semibold mb-2">{translations.errors.simulationError}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-[--color-congo-blue] text-white rounded-lg text-sm"
          >
            {translations.actions.reset}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
