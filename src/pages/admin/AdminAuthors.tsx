import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface AuthorRow { id: string; name: string; avatar: string | null; bio: string | null; role: string | null; }

export default function AdminAuthors() {
  const [authors, setAuthors] = useState<AuthorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AuthorRow | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const { toast } = useToast();

  const fetchAuthors = async () => {
    const { data } = await supabase.from("authors").select("*").order("name");
    setAuthors(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAuthors(); }, []);

  const openNew = () => { setEditing(null); setName(""); setAvatar(""); setBio(""); setRole(""); setDialogOpen(true); };
  const openEdit = (a: AuthorRow) => { setEditing(a); setName(a.name); setAvatar(a.avatar ?? ""); setBio(a.bio ?? ""); setRole(a.role ?? ""); setDialogOpen(true); };

  const handleSave = async () => {
    const data = { name, avatar: avatar || null, bio: bio || null, role: role || null };
    let error;
    if (editing) {
      ({ error } = await supabase.from("authors").update(data).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("authors").insert(data));
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Author updated" : "Author created" }); setDialogOpen(false); fetchAuthors(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this author?")) return;
    const { error } = await supabase.from("authors").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Author deleted" }); fetchAuthors(); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-display">Authors</h1>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />New Author</Button>
      </div>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead className="w-24">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {authors.length === 0
              ? <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-12">No authors yet.</TableCell></TableRow>
              : authors.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="text-muted-foreground">{a.role ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Author" : "New Author"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Avatar URL</Label><Input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." /></div>
            <div className="space-y-2"><Label>Role</Label><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior Editor" /></div>
            <div className="space-y-2"><Label>Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} /></div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
