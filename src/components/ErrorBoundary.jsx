import { Component } from 'react';
import { business } from '../data/content';

/*
  Without this, one throw anywhere in the tree unmounts everything and leaves
  a white page. A marketing site should still show a way to get in touch.
*/
export class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
        <p className="font-display text-[clamp(48px,10vw,96px)] leading-none tracking-[.03em] text-text">
          Something Broke.
        </p>
        <p className="max-w-[420px] text-[15px] leading-[1.7] font-light text-muted">
          Not your fault. Reload the page, or reach us directly and we&apos;ll sort it out.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="cursor-pointer rounded-btn border-none bg-accent px-8 py-3.5 text-[13px] font-bold tracking-[.16em] text-on-accent uppercase"
          >
            Back to home
          </button>
          <a href={`mailto:${business.email}`} className="text-sm text-accent-hi underline underline-offset-4">
            {business.email}
          </a>
        </div>
      </div>
    );
  }
}
