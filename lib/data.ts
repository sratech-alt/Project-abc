/**
 * data.ts — Sabiora content data source.
 * Single source of truth for every repeating section. Add, remove or edit entries here;
 * no component markup needs to change.
 */

/* ------------------------------------------------------------------ Hero metrics */

export type Metric = { value: string; label: string };

export const metrics: Metric[] = [
  { value: '8+', label: 'Core tech disciplines' },
  { value: '100%', label: 'Production-grade custom code' },
  { value: 'Full-Stack', label: 'Architecture to deployment' },
  { value: 'Kathmandu', label: 'Local hub, global reach' },
];

/* ------------------------------------------------------------------ About */

export const aboutFacts: { label: string; value: string }[] = [
  { label: 'Based in', value: 'Kathmandu, Nepal' },
  { label: 'We build', value: 'Web apps, mobile apps, e-commerce, custom business software' },
  { label: 'Backend', value: 'Java / Spring Boot, Node.js' },
  { label: 'Frontend', value: 'React, Angular, Flutter' },
  { label: 'Data', value: 'PostgreSQL, Kafka, Redis' },
  { label: 'Delivery', value: 'Docker, CI/CD, cloud hosting' },
];

/* ------------------------------------------------------------------ Services (bento grid) */

export type ServiceVisual =
  | 'phones'
  | 'browser'
  | 'checkout'
  | 'pipeline'
  | 'canvas'
  | 'api'
  | 'dashboard'
  | 'uptime';

export type Service = {
  id: string;
  title: string;
  blurb: string;
  features: string[];
  visual: ServiceVisual;
  /** Columns the card spans in the 3-column desktop grid. */
  span: 1 | 2 | 3;
};

export const services: Service[] = [
  {
    id: 'mobile-app',
    title: 'Mobile App Development',
    blurb:
      'Android and iOS apps that feel native, stay reliable and are built to scale — for businesses, startups and organizations.',
    features: ['Android & iOS', 'Cross-platform', 'Business & enterprise apps', 'Booking & on-demand apps'],
    visual: 'phones',
    span: 2,
  },
  {
    id: 'website',
    title: 'Website Development',
    blurb: 'Fast, responsive, search-friendly websites that give your business a credible digital presence.',
    features: ['React / Next.js', 'Landing pages', 'CMS & WordPress', 'Redesigns'],
    visual: 'browser',
    span: 1,
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Solutions',
    blurb: 'Secure online stores — catalogue, cart, checkout and payments, wired into delivery and reporting.',
    features: ['Online stores', 'Payment gateways', 'Orders & delivery'],
    visual: 'checkout',
    span: 1,
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    blurb:
      'Containerized deployments and automated pipelines on dependable cloud infrastructure, so shipping is routine instead of risky.',
    features: ['Docker & containers', 'CI/CD pipelines', 'Deployment automation', 'Monitoring & backups'],
    visual: 'pipeline',
    span: 2,
  },
  {
    id: 'uiux',
    title: 'UI/UX Design',
    blurb: 'Clear, consistent interfaces — from user flows and wireframes to prototypes and design systems.',
    features: ['User flows', 'Prototypes', 'Design systems'],
    visual: 'canvas',
    span: 1,
  },
  {
    id: 'api',
    title: 'API & System Integration',
    blurb: 'APIs and integrations that let your apps, platforms and third-party services talk securely.',
    features: ['REST APIs', 'Auth & authorization', 'Payments, SMS & email'],
    visual: 'api',
    span: 1,
  },
  {
    id: 'web-apps',
    title: 'Web Apps & Custom Software',
    blurb: 'Software shaped around how your business actually works — its processes, users and requirements.',
    features: ['CRM & HR systems', 'Inventory & booking', 'Dashboards & SaaS'],
    visual: 'dashboard',
    span: 1,
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Scaling',
    blurb:
      'Launch is only the beginning. We keep your product secure, fast and up to date — and help it grow with your business.',
    features: ['Security updates', 'Performance tuning', 'Feature enhancements', 'Technical consulting', 'Modernization'],
    visual: 'uptime',
    span: 3,
  },
];

/* ------------------------------------------------------------------ Tech stack */

export type Tech = { name: string; abbr: string; use: string };

export type StackCategory = {
  id: string;
  label: string;
  summary: string;
  techs: Tech[];
};

export const stack: StackCategory[] = [
  {
    id: 'backend',
    label: 'Backend',
    summary: 'Service layers that carry the business logic — typed, tested and event-driven where it pays off.',
    techs: [
      { name: 'Java', abbr: 'Jv', use: 'Core service language' },
      { name: 'Spring Boot', abbr: 'SB', use: 'APIs & business logic' },
      { name: 'Node.js', abbr: 'Nd', use: 'Realtime services' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    summary: 'Interfaces for the web and for phones, built from reusable components and real design systems.',
    techs: [
      { name: 'React', abbr: 'Re', use: 'Web application UIs' },
      { name: 'Next.js', abbr: 'Nx', use: 'Fast, SEO-ready sites' },
      { name: 'Angular', abbr: 'Ng', use: 'Enterprise front-ends' },
      { name: 'Flutter', abbr: 'Fl', use: 'iOS & Android apps' },
    ],
  },
  {
    id: 'data',
    label: 'Database & Messaging',
    summary: 'Durable storage, fast reads and event streams that keep separate services in step.',
    techs: [
      { name: 'PostgreSQL', abbr: 'Pg', use: 'Primary relational data' },
      { name: 'Kafka', abbr: 'Kf', use: 'Event streaming' },
      { name: 'Redis', abbr: 'Rd', use: 'Caching & sessions' },
      { name: 'MinIO', abbr: 'Mi', use: 'Object storage' },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    summary: 'Repeatable builds and automated releases, from a commit to a running container.',
    techs: [
      { name: 'Docker', abbr: 'Dk', use: 'Containerized builds' },
      { name: 'Kubernetes', abbr: 'K8', use: 'Orchestration & rollouts' },
      { name: 'CI/CD', abbr: 'CI', use: 'Automated pipelines' },
      { name: 'AWS', abbr: 'Aw', use: 'Cloud hosting' },
    ],
  },
];

/* ------------------------------------------------------------------ Projects */

export type ProjectLink = { label: string; url: string };

export type Project = {
  id: string;
  title: string;
  category: string;
  /** `web` shows the image in a browser frame, `mobile` shows it as a portrait poster. */
  platform: 'web' | 'mobile';
  industry: string[];
  description: string;
  /** One factual line for the card badge. Never an invented metric. */
  highlight: string;
  /** Bullet points for the case-study dialog. */
  highlights: string[];
  image: { src: string; width: number; height: number };
  tags: string[];
  client: string;
  year: string;
  /** The first three featured projects get full cards; the rest are listed under "Also shipped". */
  featured: boolean;
  links?: ProjectLink[];
};

export const projects: Project[] = [
  {
    id: 'fashion-rental-platform',
    title: 'Fashion Try-Before-You-Buy Platform',
    category: 'Web Application',
    platform: 'web',
    industry: ['Fashion', 'E-commerce'],
    description:
      'Rental-to-own fashion commerce platform combining serialized inventory tracking, dispatch-triggered rental windows, and automated conversion-to-purchase settlement, built on an event-driven backend.',
    highlight: 'Event-driven backend',
    highlights: [
      'Serialized inventory tracking',
      'Dispatch-triggered rental windows',
      'Automated conversion-to-purchase settlement',
      'Event-driven backend on Kafka',
    ],
    image: { src: '/images/projects/fashion-rental-platform.webp', width: 1280, height: 775 },
    tags: ['Spring Boot', 'React', 'PostgreSQL', 'Kafka', 'Redis', 'MinIO'],
    client: 'FashionMart',
    year: '2026',
    featured: true,
  },
  {
    id: 'cafe-management-system',
    title: 'Cafe Management System',
    category: 'Business Software',
    platform: 'web',
    industry: ['Hospitality', 'Operations'],
    description:
      'Full-stack cafe operations platform — QR ordering, POS, inventory, and real-time kitchen display, with role-based access across 8 staff roles.',
    highlight: '8 staff roles, one platform',
    highlights: [
      'QR table ordering',
      'Point of sale',
      'Inventory management',
      'Real-time kitchen display',
      'Role-based access across 8 staff roles',
    ],
    image: { src: '/images/projects/cafe-management-system.webp', width: 1280, height: 710 },
    tags: ['Spring Boot', 'Angular', 'PostgreSQL', 'Kafka', 'Redis'],
    client: 'Personal Project',
    year: '2026',
    featured: true,
  },
  {
    id: 'aora-receipts-expenses',
    title: 'Aora: Smart Receipt & Expense Tracker',
    category: 'Mobile Application',
    platform: 'mobile',
    industry: ['Personal finance', 'Mobile'],
    description:
      'Snap receipts, let AI organize the details, and keep your expenses in one place. Built with privacy and offline use in mind.',
    highlight: 'Live on iOS & Android',
    highlights: [
      'Snap a receipt to capture an expense',
      'AI organizes the details',
      'Built with privacy in mind',
      'Works offline',
    ],
    image: { src: '/images/projects/aora.webp', width: 640, height: 1391 },
    tags: ['Flutter'],
    client: 'Sample Project',
    year: '2026',
    featured: true,
    links: [
      { label: 'App Store', url: 'https://apps.apple.com/us/app/aora-receipts-expenses/id6752373417' },
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.noor.aura' },
    ],
  },
  {
    id: 'unvoid',
    title: 'Unvoid: Flip Your Phone. Reclaim Your Time.',
    category: 'Mobile Application',
    platform: 'mobile',
    industry: ['Wellbeing', 'Mobile'],
    description:
      'A simple focus app built around one physical habit: flip your phone face down and step away from the screen.',
    highlight: 'Live on the App Store',
    highlights: ['One physical habit: flip your phone face down', 'Step away from the screen and focus'],
    image: { src: '/images/projects/unvoid.webp', width: 640, height: 1391 },
    tags: ['Flutter'],
    client: 'Sample Project',
    year: '2026',
    featured: false,
    links: [{ label: 'App Store', url: 'https://apps.apple.com/us/app/unvoid/id6759614758' }],
  },
];

/* ------------------------------------------------------------------ Why Sabiora */

export type Reason = { id: string; title: string; body: string; icon: 'target' | 'braces' | 'trending' | 'refresh' | 'handshake' };

export const reasons: Reason[] = [
  {
    id: 'business-first',
    title: 'Business-first development',
    body: "We don't build technology for its own sake. Every project starts from the problem, the users and the business objective behind it.",
    icon: 'target',
  },
  {
    id: 'custom-code',
    title: 'Custom code, no low-code ceilings',
    body: 'Every business is different. We build around your requirements rather than forcing your processes into a one-size-fits-all system.',
    icon: 'braces',
  },
  {
    id: 'scalable',
    title: 'Scalable technology',
    body: 'We develop with maintainability, performance, security and future growth in mind.',
    icon: 'trending',
  },
  {
    id: 'end-to-end',
    title: 'End-to-end support',
    body: 'From the first idea to production deployment and future improvements, we support your product throughout its lifecycle.',
    icon: 'refresh',
  },
  {
    id: 'partnership',
    title: 'Long-term partnership',
    body: 'We aim for lasting relationships, not a delivery and a goodbye. We keep your technology running smoothly as your business evolves.',
    icon: 'handshake',
  },
];

/* ------------------------------------------------------------------ Team */

/** The Team section is not rendered at the moment (disabled before the redesign). Data is kept for when it returns. */
export type TeamMember = { id: string; name: string; role: string; motto?: string; bio: string; image: string };

export const team: TeamMember[] = [
  {
    id: 'rupesh-dulal',
    name: 'Rupesh Dulal',
    role: 'CTO',
    motto:
      'Our organization is built on the foundation of delivering quality service. We believe customer satisfaction is the path to our success.',
    bio: '5+ years shaping digital products for global brands. Obsessed with elegant typography and human-first design systems.',
    image: '/images/team/rupesh-dulal.webp',
  },
  {
    id: 'biman-lakhey',
    name: 'Biman Lakhey',
    role: 'Co-Founder',
    motto: 'We believe great products are built around great experiences',
    bio: 'We turn product ideas into intuitive, reliable apps with a focus on thoughtful interactions, clean architecture, and the little details that make a great experience feel natural.',
    image: '/images/team/biman-lakhey.webp',
  },
];

/* ------------------------------------------------------------------ Testimonials */

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Optional avatar path under /public. Initials are shown when omitted. */
  avatar?: string;
  /**
   * Only `verified: true` entries are rendered, and the section hides itself when there are none.
   * Set this to true only for a real quote from a real client who agreed to be named.
   */
  verified: boolean;
};

export const testimonials: Testimonial[] = [
  // The three entries below came with the original site template and are NOT real client quotes.
  // Replace them with real ones (and set verified: true) to switch the Testimonials section on.
  {
    id: 't1',
    quote:
      'Sabiora delivered a web presence that completely elevated our brand perception. Their attention to design detail, responsiveness, and swift execution blew our board away.',
    author: 'Claire Sterling',
    title: 'Chief Brand Officer',
    company: 'Lumina Design Co',
    rating: 5,
    verified: false,
  },
  {
    id: 't2',
    quote:
      'The speed and polish Sabiora brought to our platform relaunch was incredible. Conversion rate jumped 42% within the first month of going live.',
    author: 'Julian Thorne',
    title: 'VP of Product',
    company: 'Aura Labs',
    rating: 5,
    verified: false,
  },
  {
    id: 't3',
    quote:
      'Finding an agency that truly understands both design aesthetics and technical performance is rare. Sabiora excels at both effortlessly.',
    author: 'Amara Patel',
    title: 'Managing Director',
    company: 'Vortex Capital',
    rating: 5,
    verified: false,
  },
];

/* ------------------------------------------------------------------ Socials */

export type Social = { name: string; url: string; icon: 'x' | 'linkedin' | 'instagram' };

export const socials: Social[] = [
  { name: 'X (Twitter)', url: 'https://x.com/sabioratech', icon: 'x' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/sabioratech/', icon: 'linkedin' },
  { name: 'Instagram', url: 'https://www.instagram.com/sabioratech/', icon: 'instagram' },
];
