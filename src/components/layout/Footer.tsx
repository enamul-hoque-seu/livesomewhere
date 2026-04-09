import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-1 mb-4">
              <span className="text-xl font-heading font-bold neon-text">Frog</span>
              <span className="text-xl font-heading font-bold text-foreground">Tech</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In-depth tech insights, tutorials, and future-forward analysis for the modern developer.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Navigate</h4>
            <div className="flex flex-col gap-2">
              {["Home", "Blog", "Categories", "About"].map((item) => (
                <Link key={item} to={item === "Home" ? "/" : `/${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Categories</h4>
            <div className="flex flex-col gap-2">
              {["AI & ML", "Web Dev", "Cybersecurity", "Cloud & DevOps"].map((cat) => (
                <Link key={cat} to="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex flex-col gap-2">
              {["Twitter / X", "GitHub", "LinkedIn", "RSS Feed"].map((social) => (
                <a key={social} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FrogTech. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
