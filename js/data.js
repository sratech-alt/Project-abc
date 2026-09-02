/**
 * data.js — Sabiora Content Data Source
 * Single source of truth for array-driven repeating content sections.
 */

const projects = [
  {
    id: "fashion-rental-platform",
    title: "Fashion Try-Before-You-Buy Platform",
    category: "Web Application",
    description: "Rental-to-own fashion commerce platform combining serialized inventory tracking, dispatch-triggered rental windows, and automated conversion-to-purchase settlement, built on an event-driven backend.",
    image: "assets/ecommerce.png",
    tags: ["Spring Boot", "React", "PostgreSQL", "Kafka", "Redis", "MinIO"],
    client: "FashionMart",
    year: "2026",
    link: "#"
  },
  {
    id: "cafe-management-system",
    title: "Cafe Management System",
    category: "Business Software",
    description: "Full-stack cafe operations platform — QR ordering, POS, inventory, and real-time kitchen display, with role-based access across 8 staff roles.",
    image: "assets/cafe-mgmt.png",
    tags: ["Spring Boot", "Angular", "PostgreSQL", "Kafka", "Redis"],
    client: "Personal Project",
    year: "2026",
    link: "#"
  },
  {
    id: "aora-receipts-expenses",
    title: "Aora: Smart Receipt & Expense Tracker",
    category: "Mobile Application",
    description: "Snap receipts, let AI organize the details, and keep your expenses in one place. Built with privacy and offline use in mind.",
    image: "assets/aora.jpeg",
    tags: ["Flutter"],
    client: "Sample Project",
    year: "2026",
    link: "#",
    links: [
      { label: "App Store", url: "https://apps.apple.com/us/app/aora-receipts-expenses/id6752373417" },
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.noor.aura" }
    ]
  },
  {
    id: "unvoid",
    title: "Unvoid: Flip Your Phone. Reclaim Your Time.",
    category: "Mobile Application",
    description: "A simple focus app built around one physical habit: flip your phone face down and step away from the screen.",
    image: "assets/unvoid.jpeg",
    tags: ["Flutter"],
    client: "Sample Project",
    year: "2026",
    link: "#",
    links: [
      { label: "App Store", url: "https://apps.apple.com/us/app/unvoid/id6759614758" }
    ]
  }
];

const team = [
  {
    id: "Rupesh-Dulal",
    name: "Rupesh Dulal",
    role: "CTO",
    motto: "Our organization is built on the foundation of delivering quality service. We believe customer satisfaction is the path to our success.",
    bio: "5+ years shaping digital products for global brands. Obsessed with elegant typography and human-first design systems.",
    image: "assets/Co-Founder.jpeg"
  },
  {
    id: "Biman-Lakhey",
    name: "Biman Lakhey",
    role: "Co-Founder",
    motto: "We believe great products are built around great experiences",
    bio: "We turn product ideas into intuitive, reliable apps with a focus on thoughtful interactions, clean architecture, and the little details that make a great experience feel natural.",
    image: "assets/Co-Founder3.jpeg",
  },
];

const testimonials = [
  {
    id: "t1",
    quote: "Sabiora delivered a web presence that completely elevated our brand perception. Their attention to design detail, responsiveness, and swift execution blew our board away.",
    author: "Claire Sterling",
    title: "Chief Brand Officer",
    company: "Lumina Design Co",
    rating: 5
  },
  {
    id: "t2",
    quote: "The speed and polish Sabiora brought to our platform relaunch was incredible. Conversion rate jumped 42% within the first month of going live.",
    author: "Julian Thorne",
    title: "VP of Product",
    company: "Aura Labs",
    rating: 5
  },
  {
    id: "t3",
    quote: "Finding an agency that truly understands both design aesthetics and technical performance is rare. Sabiora excels at both effortlessly.",
    author: "Amara Patel",
    title: "Managing Director",
    company: "Vortex Capital",
    rating: 5
  }
];

const socials = [
  {
    name: "Twitter / X",
    url: "https://x.com/sabioratech",
    icon: "twitter"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/sabiora-technologies-b482b0431",
    icon: "linkedin"
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com/sabiora-technologies",
    icon: "dribbble"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/sabioratechnologies/",
    icon: "instagram"
  }
];

// Export arrays for module environment (Node unit testing) while maintaining window globals for static browser usage.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projects, team, testimonials, socials };
}
