export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  social: { twitter?: string; linkedin?: string; github?: string };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  readingTime: number;
  isFeatured: boolean;
  views: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  icon: string;
}

export const authors: Author[] = [
  {
    id: "1",
    name: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    bio: "Senior software engineer and tech writer specializing in AI/ML, distributed systems, and next-gen web technologies.",
    role: "Lead Writer",
    social: { twitter: "alexchen", linkedin: "alexchen", github: "alexchen" },
  },
  {
    id: "2",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    bio: "Cybersecurity researcher and cloud infrastructure expert with 10+ years in DevOps and security engineering.",
    role: "Security Editor",
    social: { twitter: "priyasharma", linkedin: "priyasharma" },
  },
  {
    id: "3",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    bio: "Full-stack developer, open-source contributor, and advocate for accessible web experiences.",
    role: "Web Dev Editor",
    social: { twitter: "marcusj", github: "marcusj" },
  },
];

export const categories: Category[] = [
  { id: "1", name: "AI & Machine Learning", slug: "ai-ml", description: "Deep dives into artificial intelligence, neural networks, and ML ops.", postCount: 24, icon: "🤖" },
  { id: "2", name: "Web Development", slug: "web-dev", description: "Modern frameworks, architecture patterns, and frontend excellence.", postCount: 31, icon: "🌐" },
  { id: "3", name: "Cybersecurity", slug: "cybersecurity", description: "Threat intelligence, zero-trust architecture, and security best practices.", postCount: 18, icon: "🔐" },
  { id: "4", name: "Cloud & DevOps", slug: "cloud-devops", description: "Infrastructure as code, CI/CD, Kubernetes, and cloud-native development.", postCount: 22, icon: "☁️" },
  { id: "5", name: "Gadgets & Hardware", slug: "gadgets", description: "Reviews and analysis of cutting-edge hardware and consumer tech.", postCount: 15, icon: "⚡" },
  { id: "6", name: "Programming", slug: "programming", description: "Languages, paradigms, algorithms, and software craftsmanship.", postCount: 28, icon: "💻" },
];

const sampleContent = `
## Introduction

The landscape of technology is evolving at an unprecedented pace. In this article, we explore the cutting-edge developments that are shaping the future of our digital world.

## The Current State

Modern technology stacks have become increasingly complex. From microservices architectures to serverless computing, developers need to navigate a constantly shifting ecosystem.

\`\`\`typescript
// Example: Modern API handler
export async function handler(req: Request): Promise<Response> {
  const data = await processRequest(req);
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
\`\`\`

## Key Trends

### 1. AI-First Development
Artificial intelligence is no longer a nice-to-have—it's becoming integral to every layer of the stack. From code generation to automated testing, AI is transforming how we build software.

### 2. Edge Computing
Processing data closer to the source reduces latency and improves user experience. Edge functions and CDN-based computing are becoming the default.

### 3. Zero-Trust Security
With the rise of remote work and distributed systems, security models are shifting from perimeter-based to zero-trust architectures.

## Looking Forward

The next five years will bring even more dramatic changes. Quantum computing, neuromorphic chips, and ambient computing will redefine what's possible.

> "The best way to predict the future is to invent it." — Alan Kay

## Conclusion

Staying current with technology trends isn't optional—it's essential for anyone building the next generation of software. Keep learning, keep building, and keep pushing boundaries.
`;

export const posts: Post[] = [
  {
    id: "1",
    title: "The Rise of AI Agents: How Autonomous Systems Are Reshaping Software Development",
    slug: "rise-of-ai-agents-2026",
    excerpt: "AI agents are moving beyond simple automation. Discover how autonomous AI systems are fundamentally changing how we architect, build, and deploy software.",
    content: sampleContent,
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    category: "AI & Machine Learning",
    tags: ["AI", "Agents", "Automation", "LLM"],
    author: authors[0],
    publishedAt: "2026-04-07",
    readingTime: 8,
    isFeatured: true,
    views: 12400,
  },
  {
    id: "2",
    title: "Zero-Trust Architecture in 2026: A Practical Implementation Guide",
    slug: "zero-trust-architecture-2026",
    excerpt: "Implementing zero-trust security doesn't have to be overwhelming. Here's a step-by-step guide for modern teams.",
    content: sampleContent,
    featuredImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop",
    category: "Cybersecurity",
    tags: ["Security", "Zero-Trust", "Architecture"],
    author: authors[1],
    publishedAt: "2026-04-05",
    readingTime: 12,
    isFeatured: true,
    views: 8900,
  },
  {
    id: "3",
    title: "React Server Components: The Complete Deep Dive",
    slug: "react-server-components-deep-dive",
    excerpt: "Everything you need to know about React Server Components — from mental models to production patterns.",
    content: sampleContent,
    featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    category: "Web Development",
    tags: ["React", "RSC", "Frontend"],
    author: authors[2],
    publishedAt: "2026-04-03",
    readingTime: 15,
    isFeatured: false,
    views: 6700,
  },
  {
    id: "4",
    title: "Kubernetes at Scale: Lessons from Running 10,000 Pods",
    slug: "kubernetes-at-scale",
    excerpt: "Real-world lessons from managing large-scale Kubernetes clusters in production environments.",
    content: sampleContent,
    featuredImage: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop",
    category: "Cloud & DevOps",
    tags: ["Kubernetes", "DevOps", "Infrastructure"],
    author: authors[0],
    publishedAt: "2026-04-01",
    readingTime: 10,
    isFeatured: false,
    views: 5200,
  },
  {
    id: "5",
    title: "The M4 Ultra Chip: Benchmarks, Analysis, and What It Means for Developers",
    slug: "m4-ultra-chip-analysis",
    excerpt: "Apple's latest silicon pushes the boundaries of performance. We break down the benchmarks and developer implications.",
    content: sampleContent,
    featuredImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=450&fit=crop",
    category: "Gadgets & Hardware",
    tags: ["Apple", "Silicon", "Hardware", "Benchmarks"],
    author: authors[1],
    publishedAt: "2026-03-28",
    readingTime: 7,
    isFeatured: false,
    views: 9800,
  },
  {
    id: "6",
    title: "Rust for Web Developers: Why 2026 Is the Year to Learn Rust",
    slug: "rust-for-web-developers",
    excerpt: "Rust is entering the web ecosystem in a big way. From WASM to backend services, here's why you should pay attention.",
    content: sampleContent,
    featuredImage: "https://images.unsplash.com/photo-1515879218367-8466d910auj?w=800&h=450&fit=crop",
    category: "Programming",
    tags: ["Rust", "WASM", "Programming"],
    author: authors[2],
    publishedAt: "2026-03-25",
    readingTime: 9,
    isFeatured: false,
    views: 7300,
  },
  {
    id: "7",
    title: "Building Real-Time Collaborative Apps with CRDTs",
    slug: "real-time-collaborative-crdts",
    excerpt: "Conflict-free replicated data types enable seamless collaboration. Learn how to implement them in your apps.",
    content: sampleContent,
    featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop",
    category: "Web Development",
    tags: ["CRDTs", "Real-time", "Collaboration"],
    author: authors[0],
    publishedAt: "2026-03-22",
    readingTime: 11,
    isFeatured: false,
    views: 4500,
  },
  {
    id: "8",
    title: "The State of LLM Security: Prompt Injection and Beyond",
    slug: "llm-security-prompt-injection",
    excerpt: "As LLMs become critical infrastructure, understanding their security vulnerabilities is paramount.",
    content: sampleContent,
    featuredImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop",
    category: "Cybersecurity",
    tags: ["LLM", "Security", "AI Safety"],
    author: authors[1],
    publishedAt: "2026-03-20",
    readingTime: 13,
    isFeatured: false,
    views: 11200,
  },
];
