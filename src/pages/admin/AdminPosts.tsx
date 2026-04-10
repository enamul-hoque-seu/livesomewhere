import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  is_published: boolean | null;
  is_featured: boolean | null;
  published_at: string | null;
  created_at: string;
  categories: { name: string } | null;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, is_published, is_featured, published_at, created_at, categories(name)")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading posts", description: error.message, variant: "destructive" });
    } else {
      setPosts((data as unknown as PostRow[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post deleted" });
      fetchPosts();
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-display">Posts</h1>
        <Button asChild>
          <Link to="/admin/posts/new"><Plus className="mr-2 h-4 w-4" />New Post</Link>
        </Button>
      </div>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-12">No posts yet. Create your first post!</TableCell></TableRow>
            ) : posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.categories?.name ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={post.is_published ? "default" : "secondary"}>
                    {post.is_published ? "Published" : "Draft"}
                  </Badge>
                  {post.is_featured && <Badge variant="outline" className="ml-1 border-primary text-primary">Featured</Badge>}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(post.published_at || post.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/posts/${post.id}`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
