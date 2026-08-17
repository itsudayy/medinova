import { useState } from 'react';

/**
 * Image with built-in loading + failure handling.
 *
 * External images (Unsplash, Google profile photos) can 404 or be blocked, so
 * every image in the app goes through here: a skeleton shimmer while loading,
 * and a graceful fallback block instead of a broken-image icon on error.
 */
export default function SmartImage({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  fallback = null,
  // Above-the-fold images (the hero) must not be lazy — that delays the
  // largest contentful paint. Pass eager for anything visible on first paint.
  eager = false,
  ...props
}) {
  const [state, setState] = useState('loading'); // loading | loaded | error

  if (state === 'error') {
    return (
      fallback ?? (
        <div
          className={`bg-gradient-to-br from-brand-100 to-teal-accent/20 dark:from-slate-800 dark:to-slate-700 ${wrapperClassName} ${className}`}
          aria-hidden="true"
        />
      )
    );
  }

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {state === 'loading' && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse" aria-hidden="true" />
      )}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
        className={`${className} ${state === 'loading' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        {...props}
      />
    </div>
  );
}
