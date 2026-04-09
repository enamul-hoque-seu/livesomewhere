import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Category } from "@/data/mockData";

const CategoryCard = ({ category }: { category: Category }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <Link
      to={`/blog?category=${category.slug}`}
      className="glass-card-hover p-5 block group"
    >
      <span className="text-2xl mb-2 block">{category.icon}</span>
      <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
        {category.name}
      </h3>
      <p className="text-xs text-muted-foreground mt-1">{category.postCount} articles</p>
    </Link>
  </motion.div>
);

export default CategoryCard;
