import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Users, FolderOpen } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, published: 0, categories: 0, authors: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [posts, published, categories, authors] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("authors").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        posts: posts.count ?? 0,
        published: published.count ?? 0,
        categories: categories.count ?? 0,
        authors: authors.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Posts", value: stats.posts, icon: FileText, color: "text-primary" },
    { title: "Published", value: stats.published, icon: Eye, color: "text-green-400" },
    { title: "Categories", value: stats.categories, icon: FolderOpen, color: "text-secondary" },
    { title: "Authors", value: stats.authors, icon: Users, color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-display">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="glass-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
