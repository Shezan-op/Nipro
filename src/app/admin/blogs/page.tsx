"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  Loader2,
  Newspaper,
  Calendar,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getBlogs, createBlogAction, updateBlogAction, deleteBlogAction, uploadFileAction } from '@/lib/actions';
import { BlogPost } from '@/lib/data-service';
import { cn } from '@/lib/utils';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BlogPost | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [blogFile, setBlogFile] = useState<File | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const data = await getBlogs();
      if (mounted) {
        setBlogs(data);
        setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  const reloadBlogs = async () => {
    const data = await getBlogs();
    setBlogs(data);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingId(blog.id);
    setEditForm({ ...blog });
    setIsAdding(false);
    setBlogFile(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
    setIsAdding(false);
    setBlogFile(null);
  };

  const handleSave = async () => {
    if (!editForm) return;
    
    try {
      // Validate title and content
      if (!editForm.title || !editForm.content) {
        toast.error('Title and content are required');
        return;
      }

      setSaving(true);
      
      let finalCoverImage = editForm.coverImage;

      // Handle file upload
      if (blogFile) {
        const formData = new FormData();
        formData.append('file', blogFile);
        const uploadResult = await uploadFileAction('blog_images', blogFile.name, formData);

        if (uploadResult.success && uploadResult.url) {
          finalCoverImage = uploadResult.url;
        } else {
          toast.error('Image upload failed. Using existing or default image.');
        }
      }

      const blogToSave: BlogPost = {
        ...editForm,
        coverImage: finalCoverImage
      };

      let result;
      if (isAdding) {
        result = await createBlogAction(blogToSave);
      } else {
        result = await updateBlogAction(blogToSave.id, blogToSave);
      }
      
      if (result.success) {
        await reloadBlogs();
        setEditingId(null);
        setEditForm(null);
        setIsAdding(false);
        setBlogFile(null);
        toast.success(isAdding ? 'Blog post created' : 'Blog post updated');
      } else {
        toast.error('Failed to save');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    const result = await deleteBlogAction(id);
    if (result.success) {
      await reloadBlogs();
      toast.success('Blog post deleted');
    } else {
      toast.error('Failed to delete');
    }
  };

  const startAdding = () => {
    const newBlog: BlogPost = {
      id: Date.now().toString(),
      title: '',
      coverImage: '',
      content: '',
      status: 'Published',
      createdAt: ''
    };
    setEditForm(newBlog);
    setEditingId(newBlog.id);
    setIsAdding(true);
    setBlogFile(null);
  };

  const filtered = blogs.filter(b => 
    (b.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-nipro-blue">Blog Management</h1>
          <p className="text-muted-foreground mt-1">Manage announcements, success stories, and news.</p>
        </div>
        {!isAdding && !editingId && (
          <Button 
            onClick={startAdding}
            className="h-11 px-6 bg-nipro-red hover:bg-nipro-red/90 text-white shadow-lg shadow-nipro-red/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        )}
      </div>

      {(isAdding || editingId) && editForm ? (
        <Card className="border-none shadow-lg hover:shadow-xl rounded-2xl bg-white transition-all duration-300 ring-1 ring-slate-900/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-nipro-blue tracking-tight">
              {isAdding ? 'Create New Blog Post' : 'Edit Blog Post'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Post Title</label>
                <Input 
                  value={editForm.title || ''}
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  placeholder="Enter a catchy title..."
                  className="h-12 border-gray-200 focus-visible:ring-nipro-red"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Cover Image</label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="file"
                    onChange={e => setBlogFile(e.target.files?.[0] || null)}
                    className="h-12 border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nipro-blue/10 file:text-nipro-blue hover:file:bg-nipro-blue/20"
                    accept="image/*"
                  />
                  {blogFile && (
                    <p className="text-xs text-nipro-blue font-medium bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      {blogFile.name}
                    </p>
                  )}
                </div>
                {!blogFile && editForm.coverImage && (
                  <p className="text-[10px] text-gray-400 truncate">Current: {editForm.coverImage}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Content</label>
              <Textarea 
                value={editForm.content || ''}
                onChange={e => setEditForm({...editForm, content: e.target.value})}
                placeholder="Write your blog content here..."
                className="min-h-[200px] border-gray-200 resize-none focus-visible:ring-nipro-red"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Status</label>
                <select 
                  className="w-full h-12 rounded-md border border-gray-200 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-nipro-red/20 focus:border-nipro-red"
                  value={editForm.status || 'Draft'}
                  onChange={e => setEditForm({...editForm, status: e.target.value as 'Published' | 'Draft'})}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Date</label>
                <Input 
                  type="text"
                  placeholder="DD/MM/YYYY"
                  pattern="\d{2}/\d{2}/\d{4}"
                  title="Format: DD/MM/YYYY"
                  value={editForm.createdAt || ''}
                  onChange={e => setEditForm({...editForm, createdAt: e.target.value})}
                  className="h-12 border-gray-200 focus-visible:ring-nipro-red"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button variant="outline" className="h-11 px-6" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving || !editForm.title}
                className="h-11 px-8 bg-nipro-blue hover:bg-nipro-blue/90 text-white"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {isAdding ? 'Publish Post' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-lg hover:shadow-xl rounded-2xl overflow-hidden bg-white transition-all duration-300 ring-1 ring-slate-900/5">
          <CardHeader className="bg-white border-b border-gray-100 py-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search blogs..." 
                className="pl-10 h-10 border border-gray-200 bg-white focus-visible:ring-nipro-red"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-slate-600 text-xs uppercase tracking-widest font-bold border-b border-gray-100">
                    <th className="px-6 py-4">Title & Content</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-nipro-red mx-auto mb-4" />
                        Loading...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-slate-500 font-medium">
                        No blog posts found.
                      </td>
                    </tr>
                  ) : filtered.map((blog) => (
                    <tr key={blog.id} className="hover:bg-slate-50/80 transition-all duration-200">
                      <td className="px-6 py-6 max-w-md">
                        <div className="flex gap-4">
                          <div className="h-16 w-24 relative rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                            {blog.coverImage ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img 
                                src={blog.coverImage} 
                                alt={blog.title} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400">
                                <Newspaper className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-nipro-blue line-clamp-1">{blog.title}</p>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{blog.content}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {blog.createdAt}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider",
                          blog.status === 'Published' 
                            ? "bg-green-50 text-green-700 ring-1 ring-green-600/10" 
                            : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/10"
                        )}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-nipro-blue/5 text-slate-400 hover:text-nipro-blue" onClick={() => handleEdit(blog)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-nipro-red/5 text-slate-400 hover:text-nipro-red" onClick={() => handleDelete(blog.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
