import React from 'react';
import { logError } from '@/lib/errorLogger';

/**
 * Top-level error boundary. Catches render/lifecycle errors anywhere in the
 * React tree and shows a friendly fallback with a reload button, so a single
 * bad component can't leave the user with a blank screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Detailed log (stack + component tree); not surfaced to end users.
    logError('RenderError', error, { componentStack: info?.componentStack });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-md w-full bg-white border-2 border-slate-300 rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-3">
              Something went wrong
            </h1>
            <p className="text-slate-700 mb-6">
              We hit an unexpected issue. Please reload the page to continue.
              If it keeps happening, contact Base44 support.
            </p>
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-rose-600 to-sky-700 text-white font-bold shadow-md hover:opacity-95"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}