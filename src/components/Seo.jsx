import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { business } from '../data/content';

/*
  Minimal head manager. React 18 has no built-in metadata hoisting and the
  project has no reason to take on react-helmet for four tags per route.

  Every tag it writes is marked data-seo, so a route change replaces the
  previous route's set instead of stacking duplicates.
*/
const OG_IMAGE = '/og-image.jpg';

const upsert = (selector, create, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    el.setAttribute('data-seo', '');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
};

const meta = (name, content, property = false) =>
  upsert(
    `meta[${property ? 'property' : 'name'}="${name}"]`,
    () => document.createElement('meta'),
    { [property ? 'property' : 'name']: name, content }
  );

export const Seo = ({ title, description, noindex = false, image = OG_IMAGE }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const url = `${business.url}${pathname}`;
    const desc = description || business.description;
    const absoluteImage = image.startsWith('http') ? image : `${business.url}${image}`;

    document.title = title;

    meta('description', desc);
    meta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    meta('og:title', title, true);
    meta('og:description', desc, true);
    meta('og:url', url, true);
    meta('og:type', 'website', true);
    meta('og:site_name', business.name, true);
    meta('og:image', absoluteImage, true);

    meta('twitter:card', 'summary_large_image');
    meta('twitter:title', title);
    meta('twitter:description', desc);
    meta('twitter:image', absoluteImage);

    upsert('link[rel="canonical"]', () => document.createElement('link'), { rel: 'canonical', href: url });
  }, [title, description, noindex, image, pathname]);

  return null;
};

/*
  LocalBusiness structured data — the highest-leverage SEO item for a local
  service business, and the one thing feeding Google's local pack. Everything
  here already existed in content.js; nothing was marked up.
*/
export const LocalBusinessSchema = ({ gyms, plans, reviews }) => {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'HealthAndBeautyBusiness',
      '@id': `${business.url}/#business`,
      name: business.name,
      description: business.description,
      url: business.url,
      telephone: business.phone,
      email: business.email,
      priceRange: business.priceRange,
      image: `${business.url}${OG_IMAGE}`,
      founder: { '@type': 'Person', name: business.coach, jobTitle: 'Strength & Conditioning Coach' },
      areaServed: { '@type': 'City', name: business.city },
      location: gyms.map((g) => ({
        '@type': 'ExerciseGym',
        name: g.name,
        address: { '@type': 'PostalAddress', streetAddress: g.addr, addressLocality: business.city, addressRegion: business.region, addressCountry: 'US' },
      })),
      makesOffer: plans.map((p) => ({
        '@type': 'Offer',
        name: `${p.name} Training`,
        description: p.desc,
        price: p.price.replace(/[^0-9.]/g, ''),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      })),
      review: reviews.map((r) => ({
        '@type': 'Review',
        reviewBody: r.quote,
        author: { '@type': 'Person', name: r.name },
        reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
      })),
    };

    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.setAttribute('data-seo-schema', '');
    tag.textContent = JSON.stringify(schema);
    document.head.appendChild(tag);
    return () => tag.remove();
  }, [gyms, plans, reviews]);

  return null;
};

/* FAQPage markup — makes the accordion eligible for a rich result. */
export const FaqSchema = ({ faqs }) => {
  useEffect(() => {
    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.setAttribute('data-seo-schema', '');
    tag.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
    document.head.appendChild(tag);
    return () => tag.remove();
  }, [faqs]);

  return null;
};
