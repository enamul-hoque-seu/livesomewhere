import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { authors } from "@/data/mockData";

const About = () => (
  <Layout>
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">About FrogTech</h1>
        <div className="glass-card p-8 mb-12">
          <p className="text-foreground/80 leading-relaxed mb-4">
            FrogTech is a modern technology publication dedicated to providing in-depth insights, tutorials, and analysis for developers, engineers, and tech leaders.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            We believe in cutting through the noise to deliver signal — well-researched, technically accurate content that helps you stay ahead of the curve in an ever-evolving industry.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            Founded in 2025, we cover everything from AI and machine learning to cybersecurity, cloud infrastructure, and the latest in programming paradigms.
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
