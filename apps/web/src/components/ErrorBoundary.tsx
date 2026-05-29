'use client';

import { Component, ReactNode, type ErrorInfo, type ReactElement } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactElement;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error);
  }

  render(): ReactElement {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <h1 className="mb-2 text-2xl font-semibold text-red-400">Something went wrong</h1>
            <p className="text-white/50">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children as ReactElement;
  }
}