/**
 * site.ts — Company facts, navigation and integration config.
 * One-off values live here; repeatable content arrays live in data.ts.
 */

export const site = {
  name: 'Sabiora Technologies',
  shortName: 'Sabiora',
  url: 'https://sabioratechnologies.com',
  /** Keep to 60 characters or fewer — search results cut longer titles off. */
  title: 'Sabiora Technologies — Software Company in Kathmandu, Nepal',
  description:
    'Sabiora Technologies is a software development studio in Kathmandu, Nepal. We engineer full-stack web apps, mobile apps and custom software — from architecture and UI/UX to deployment and scaling.',
  city: 'Kathmandu',
  country: 'Nepal',
  countryCode: 'NP',
  postalCode: '44600',
  address: 'Kathmandu, Nepal 44600',
  phone: {
    /** As shown on the page. */
    display: '+977 9764397139',
    /** For tel: links and structured data — the same digits with no spaces. */
    e164: '+9779764397139',
  },
  emails: {
    sales: 'sales@sabioratechnologies.com',
    general: 'contact@sabioratechnologies.com',
  },
  /** Shown next to the logo. Update it each quarter, or set to '' to hide the status dot. */
  availability: 'Available for Q4 projects',
  /** Browser UI colour. Must mirror --color-canvas in app/globals.css (meta tags can't read CSS variables). */
  themeColor: '#0b0f17',
} as const;

/** Header, mobile menu and footer links. Each id must match a <section id> on the page. */
export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'stack', label: 'Tech Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'why-us', label: 'Why Us' },
  { id: 'contact', label: 'Contact' },
] as const;

/**
 * EmailJS credentials. These are live values, not placeholders. EmailJS public keys are meant to
 * ship in client code; restrict the allowed domain in the EmailJS dashboard to limit abuse.
 * The template receives: name, email, title, message, time.
 */
export const emailjsConfig = {
  publicKey: 'XZAyPwORZAYZgR1uJ',
  serviceId: 'service_3qoli6n',
  templateId: 'template_rg2ojlr',
} as const;
