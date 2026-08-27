/**
 * data.js — Sabiora Content Data Source
 * Single source of truth for array-driven repeating content sections.
 */

const projects = [
  {
    id: "aura-health",
    title: "Aura Health Platform",
    category: "Product & UI/UX Design",
    description: "A serene, human-centric wellness ecosystem crafted to simplify health tracking and mindfulness for over 500k active users.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    tags: ["UI/UX Architecture", "Mobile Design System", "React Native"],
    client: "Aura Labs",
    year: "2026",
    link: "#"
  },
  {
    id: "lumina-studio",
    title: "Lumina Brand Identity & Site",
    category: "Branding & Web Development",
    description: "End-to-end rebrand and immersive digital flagship experience for an architectural lighting firm, boosting inquiries by 140%.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    tags: ["Brand Identity", "Tailwind CSS", "WebGL"],
    client: "Lumina Design Co",
    year: "2025",
    link: "#"
  },
  {
    id: "vortex-pay",
    title: "Vortex Fintech App",
    category: "Fintech & Mobile UX",
    description: "Next-gen cross-border settlement application featuring real-time analytics, automated hedging, and intuitive biometric access.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    tags: ["Fintech Design", "Design System", "Interactive Prototype"],
    client: "Vortex Capital",
    year: "2025",
    link: "#"
  },
  {
    id: "kintsugi-atelier",
    title: "Kintsugi Luxury Commerce",
    category: "E-Commerce & Digital Strategy",
    description: "Bespeak e-commerce experience celebrating traditional Japanese craftsmanship with ultra-fast page speed and high conversion.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    tags: ["Shopify Headless", "Visual Direction", "Micro-Interactions"],
    client: "Kintsugi Atelier",
    year: "2025",
    link: "#"
  }
];

const team = [
  {
    id: "Rupesh-Dulal",
    name: "Rupesh Dulal",
    role: "Co-Founder",
    motto: "Our organization is built on the foundation of delivering quality service. We believe customer staisfaction is the path to our sucess ",
    bio: "5+ years shaping digital products for global brands. Obsessed with elegant typography and human-first design systems.",
    image: "assets/Co-Founder.jpeg"
  },
  {
    id: "Abhinab-Khatri-KC",
    name: "Abhinab Khatri K.C",
    role: "Co-Founder",
    motto: "Empowering organizations through strategic technology solutions, strong partnerships, and sustainable growth.",
    bio: "Focused on business development, strategic partnerships, and driving client success by aligning custom software solutions with real business objectives.",
    image: "assets/Co-Founder2.jpeg",
  },
];

const testimonials = [
  {
    id: "t1",
    quote: "Sabiora delivered a web presence that completely elevated our brand perception. Their attention to design detail, responsiveness, and swift execution blew our board away.",
    author: "Claire Sterling",
    title: "Chief Brand Officer",
    company: "Lumina Design Co",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    rating: 5
  },
  {
    id: "t2",
    quote: "The speed and polish Sabiora brought to our platform relaunch was incredible. Conversion rate jumped 42% within the first month of going live.",
    author: "Julian Thorne",
    title: "VP of Product",
    company: "Aura Labs",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5
  },
  {
    id: "t3",
    quote: "Finding an agency that truly understands both design aesthetics and technical performance is rare. Sabiora excels at both effortlessly.",
    author: "Amara Patel",
    title: "Managing Director",
    company: "Vortex Capital",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80",
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
