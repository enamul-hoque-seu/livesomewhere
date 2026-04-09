import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Eye } from "lucide-react";
import type { Post } from "@/data/mockData";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

const PostCard = ({ post, featured = false }: PostCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`glass-card-hover group overflow-hidden ${featured ? "md:col-span-2 md:grid md:grid-cols-2" : ""}`}
    >
      <Link to={`/blog/${post.slug}`} className="block">
        <div className={`overflow-hidden ${featured ? "h-full min-h-[250px]" : "aspect-video"}`}>
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readingTime} min
            </span>
          </div>
          <Link to={`/blog/${post.slug}`}>
            <h3 className={`font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-tight ${featured ? "text-xl md:text-2xl" : "text-lg"}`}>
              {post.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-7 h-7 rounded-full object-cover"
              loading="lazy"
            />
            <span className="text-xs text-muted-foreground">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(post.views / 1000).toFixed(1)}k</span>
            <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;
