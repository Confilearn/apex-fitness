import { forwardRef } from 'react';
import { img } from '../lib/media';

/*
  Every photo on the site goes through here, so the four things that are easy
  to forget on a bare <img> are impossible to forget:
  srcset + sizes (phones stop fetching desktop pixels), intrinsic dimensions
  (no layout shift), lazy loading, and async decoding.

  `priority` opts an image out of lazy loading — use it only for something
  visible before the first scroll.

  forwardRef because the footer drives its CTA photo's parallax transform
  directly on the node.
*/
export const Img = forwardRef(function Img(
  { name, alt = '', sizes = '100vw', priority = false, className = '', style, ...rest },
  ref
) {
  const { src, srcSet, width, height } = img(name);

  return (
    <img
      ref={ref}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      // camelCase: React 18.3+ maps this to the fetchpriority attribute
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
      style={style}
      {...rest}
    />
  );
});
