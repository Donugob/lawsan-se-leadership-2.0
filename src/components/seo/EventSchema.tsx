import React from 'react';

export default function EventSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Lawsan SE Leadership Conference 2.0",
    "startDate": "2026-06-06T10:00",
    "endDate": "2026-06-06T18:00",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Godfrey Okoye University",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Thinker's Corner",
        "addressLocality": "Enugu",
        "addressRegion": "EN",
        "addressCountry": "NG"
      }
    },
    "image": "https://i.postimg.cc/R0dd7Hkt/8017b435-46e1-481f-bcdc-ac8dac50ecf0.jpg",
    "description": "Emerging Lawyers, Emerging Realities. The Lawsan South East Leadership Conference 2.0 is the premier gathering for future legal professionals.",
    "organizer": {
      "@type": "Organization",
      "name": "Lawsan South East",
      "url": "https://lawsan-leadership.vercel.app"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://lawsan-leadership.vercel.app/register",
      "price": "3000",
      "priceCurrency": "NGN",
      "availability": "https://schema.org/InStock",
      "validFrom": "2026-01-01"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
