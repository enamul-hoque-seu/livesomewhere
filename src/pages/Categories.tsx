import Layout from "@/components/layout/Layout";
import CategoryCard from "@/components/blog/CategoryCard";
import { categories } from "@/data/mockData";

const Categories = () => (
  <Layout>
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">Categories</h1>
      <p className="text-muted-foreground mb-10 max-w-lg">Explore our content by topic area.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card-hover p-6">
            <span className="text-3xl mb-3 block">{cat.icon}</span>
            <h2 className="font-heading font-bold text-foreground text-lg mb-2">{cat.name}</h2>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{cat.description}</p>
            <span className="text-xs text-primary">{cat.postCount} articles</span>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

export default Categories;
