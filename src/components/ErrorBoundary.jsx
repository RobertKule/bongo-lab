// src/components/ErrorBoundary.jsx
import React from 'react';
import translations from '../utils/translations';

/**
 * Error boundary to catch rendering errors in simulation components.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Optionnel : recharger le composant
    window.location.reload(); // Ou une logique plus fine
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center p-6">
          <p className="text-red-500 font-semibold mb-2">
            {translations.errors.simulationError}
          </p>
          {this.state.error && (
            <p className="text-sm text-gray-500 mb-4">
              {this.state.error.toString()}
            </p>
          )}
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-[--color-congo-blue] text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            {translations.actions.reset || 'Réinitialiser'}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;