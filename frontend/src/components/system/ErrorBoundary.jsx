'use client';

import { Component } from 'react';
import Button from '@/components/ui/Button';

// Class-based boundary for wrapping isolated widgets (e.g. a
// homepage rail or dashboard widget) so ONE failing section can't
// blank out an entire page — the route-level error.js above handles
// whole-page failures; this handles localized ones.
export default class ErrorBoundary extends Component {
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
      return this.props.fallback || (
        <div className="rounded-md border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-400 dark:border-neutral-700">
          This section couldn&apos;t load.
          <Button variant="ghost" size="sm" onClick={() => this.setState({ hasError: false })} className="ml-2">Retry</Button>
        </div>
      );
    }
    return this.props.children;
  }
}