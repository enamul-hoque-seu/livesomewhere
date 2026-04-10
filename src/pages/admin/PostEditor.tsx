import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Eye, ArrowLeft } from "lucide-react";

interface CategoryOption { id: string; name: string; }
interface AuthorOption { id: string; name: string; }

export default function PostEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [authors, setAuthors] = useState<AuthorOption[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [tags, setTags] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  useEffect(() => {
    const fetchOptions = async () => {
      const [cats, auths] = await Promise.all([
        supabase.from("categories").select("id, name"),
        supabase.from("authors").select("id, name"),
      ]);
      setCategories(cats.data ?? []);
      setAuthors(auths.data ?? []);
    };
    fetchOptions();

    if (!isNew && id) {
      supabase.from("posts").select("*").eq("id", id).single().then(({ data, error }) => {
        if (error || !data) {
          toast({ title: "Post not found", variant: "destructive" });
          navigate("/admin/posts");
          return;
        }
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt ?? "");
        setContent(data.content ?? "");
        setFeaturedImage(data.featured_image ?? "");
        setCategoryId(data.category_id ?? "");
        setAuthorId(data.author_id ?? "");
        setTags((data.tags ?? []).join(", "));
        setReadingTime(data.reading_time ?? 5);
        setIsPublished(data.is_published ?? false);
        setIsFeatured(data.is_featured ?? false);
        setMetaTitle(data.meta_title ?? "");
        setMetaDescription(data.meta_description ?? "");
        setLoading(false);
      });
    }
  }, [id]);

  const handleSave = async (publish?: boolean) => {
    if (!title.trim() || !slug.trim()) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }
    setSaving(true);

    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content || null,
      featured_image: featuredImage || null,
      category_id: categoryId || null,
      author_id: authorId || null,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      reading_time: readingTime,
      is_published: publish !== undefined ? publish : isPublished,
      is_featured: isFeatured,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      published_at: (publish || isPublished) ? new Date().toISOString() : null,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("posts").insert(postData));
    } else {
      ({ error } = await supabase.from("posts").update(postData).eq("id", id!));
    }

    if (error) {
      toast({ title: "Error saving post", description: error.message, variant: "destructive" });
    } else {
      if (publish !== undefined) setIsPublished(publish);
      toast({ title: publish ? "Post published!" : "Post saved!" });
      if (isNew) navigate("/admin/posts");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/posts")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold font-display">{isNew ? "New Post" : "Edit Post"}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave()} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />{saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            <Eye className="mr-2 h-4 w-4" />{isPublished ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => { setTitle(e.target.value); if (isNew) setSlug(generateSlug(e.target.value)); }} placeholder="Post title" className="text-lg" />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-url-slug" />
          </div>
          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Content (Markdown)</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your post content in markdown..." rows={20} className="font-mono text-sm" />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Featured Image URL</Label>
              <Input value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Select value={authorId} onValueChange={setAuthorId}>
                <SelectTrigger><SelectValue placeholder="Select author" /></SelectTrigger>
                <SelectContent>
                  {authors.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, typescript, ai" />
            </div>
            <div className="space-y-2">
              <Label>Reading Time (minutes)</Label>
              <Input type="number" value={readingTime} onChange={(e) => setReadingTime(Number(e.target.value))} min={1} />
            </div>
          </div>
          <Card className="glass-card border-border/50">
            <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Published</Label>
                <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Featured</Label>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Meta Title</Label>
            <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="SEO title (defaults to post title)" />
            <p className="text-xs text-muted-foreground">{metaTitle.length}/60 characters</p>
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="SEO description..." rows={3} />
            <p className="text-xs text-muted-foreground">{metaDescription.length}/160 characters</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
