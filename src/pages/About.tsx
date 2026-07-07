import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { authors } from "@/data/mockData";

const About = () => (
  <Layout>
    <SEO
      title="About Live Somewhere"
      description="Live Somewhere — Where people and progress live together."
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Live Somewhere",
        url: "https://livesomewhere.com/about",
        description: "Live Somewhere — Where people and progress live together.",
        mainEntity: {
          "@type": "Organization",
          name: "Live Somewhere",
          url: "https://livesomewhere.com",
          logo: { "@type": "ImageObject", url: "https://livesomewhere.com/og-default.jpg" },
        },
      }}
    />
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">About Live Somewhere</h1>
        <div className="glass-card p-8 mb-12">
          <p className="text-foreground/80 leading-relaxed mb-4">
            Live Somewhere is a community-focused learning platform where people share knowledge, build practical skills, and grow together through modern guides and courses.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Every guide is written to be practical, accurate, and easy to follow — with real commands, real screenshots, and zero fluff.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            Whether you're spinning up your first VM, learning to pivot through a network, or shipping production-grade infrastructure, our tutorials meet you where you are and take you further.
          </p>
        </div>

        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {authors.map((author) => (
            <div key={author.id} className="glass-card p-6 text-center">
              <img src={author.avatar} alt={author.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-foreground">{author.name}</h3>
              <p className="text-xs text-primary mb-3">{author.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{author.bio}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </Layout>
);

export default About;
