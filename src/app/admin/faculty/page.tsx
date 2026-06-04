"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Save, X, Image as ImageIcon, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  getFacultyAction, addFacultyAction, deleteFacultyAction, updateFacultyAction, uploadFileAction 
} from '@/lib/actions';
import { Faculty } from '@/lib/types';

export default function AdminFaculty() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<Faculty>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getFacultyAction();
    setFacultyList(data);
    setLoading(false);
  }

  const handleEdit = (f: Faculty) => {
    setEditingId(f.id);
    setFormState({ ...f });
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const startAdding = () => {
    setEditingId(null);
    setFormState({
      name: '',
      role: '',
      bio: '',
      image_url: '',
      sort_order: facultyList.length,
      is_active: true
    });
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormState({});
    setSelectedFile(null);
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await updateFacultyAction(id, { is_active: !current });
    toast.success(current ? 'Faculty hidden' : 'Faculty active');
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;
    const res = await deleteFacultyAction(id);
    if (res.success) {
      toast.success('Faculty deleted');
      loadData();
    } else {
      toast.error('Failed to delete');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSaveClick = async () => {
    if (!formState.name || !formState.role) {
      toast.error('Name and Role are required');
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = formState.image_url;

      if (selectedFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await uploadFileAction('faculty_images', selectedFile.name, formData);
        setUploadingImage(false);
        
        if (uploadRes.success && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        } else {
          toast.error(uploadRes.error || 'Failed to upload image');
          setSaving(false);
          return;
        }
      }

      const payload = {
        name: formState.name,
        role: formState.role,
        bio: formState.bio || '',
        image_url: finalImageUrl || '',
        sort_order: formState.sort_order || 0,
        is_active: formState.is_active !== false,
      } as any;

      if (editingId) {
        await updateFacultyAction(editingId, payload);
        toast.success('Faculty updated');
      } else {
        await addFacultyAction(payload);
        toast.success('Faculty added');
      }
      closeForm();
      loadData();
    } catch (e) {
      toast.error('Error saving faculty');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto">
      
      {!isFormOpen ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty & Mentors</h1>
              <p className="text-sm text-slate-500 mt-1">Manage the profiles shown in the founder & faculty section.</p>
            </div>
            <Button onClick={startAdding} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-6 rounded-lg shadow-sm">
              <Plus className="mr-2 w-4 h-4" /> Add Faculty
            </Button>
          </div>

          <Card className="shadow-sm rounded-xl overflow-hidden border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 w-12 text-center">Order</th>
                    <th className="px-5 py-3 w-16">Profile</th>
                    <th className="px-5 py-3">Details</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                        Loading faculty...
                      </td>
                    </tr>
                  ) : facultyList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                        <div className="text-3xl mb-2">🎓</div>
                        <div className="font-semibold text-slate-700">No faculty members found</div>
                        <div className="text-xs">Add your founder and mentors to show them on the homepage.</div>
                      </td>
                    </tr>
                  ) : (
                    facultyList.map(f => (
                      <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                            <span className="font-bold text-slate-500">{f.sort_order}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            {f.image_url ? (
                              <img src={f.image_url} alt={f.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 min-w-[200px] whitespace-normal">
                          <div className="font-bold text-slate-900">{f.name}</div>
                          <div className="text-xs font-semibold text-red-600 mb-1">{f.role}</div>
                          <div className="text-xs text-slate-500 line-clamp-1">{f.bio}</div>
                        </td>
                        <td className="px-5 py-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={f.is_active} onChange={() => handleToggleActive(f.id, f.is_active)} />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900" onClick={() => handleEdit(f)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(f.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{editingId ? 'Edit Faculty' : 'Add Faculty'}</h1>
              <p className="text-sm text-slate-500 mt-1">Profile details will appear on the homepage.</p>
            </div>
            <Button variant="outline" onClick={closeForm} className="h-9 font-semibold text-slate-600">
              ← Back
            </Button>
          </div>

          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900">Name *</label>
                    <Input 
                      placeholder="e.g. John Doe" 
                      value={formState.name || ''}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900">Role / Title *</label>
                    <Input 
                      placeholder="e.g. Founder & Lead Instructor" 
                      value={formState.role || ''}
                      onChange={e => setFormState({...formState, role: e.target.value})}
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900">Bio</label>
                    <Textarea 
                      placeholder="Brief description about the mentor..." 
                      value={formState.bio || ''}
                      onChange={e => setFormState({...formState, bio: e.target.value})}
                      className="bg-slate-50 min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900">Sort Order</label>
                    <Input 
                      type="number"
                      value={formState.sort_order || 0}
                      onChange={e => setFormState({...formState, sort_order: parseInt(e.target.value) || 0})}
                      className="bg-slate-50"
                    />
                    <div className="text-[11px] text-slate-500">Lower numbers appear first (e.g. 0 for Founder)</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900">Profile Image</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50">
                      {selectedFile ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-4 border-white shadow-md relative">
                          <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : formState.image_url ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-4 border-white shadow-md">
                          <img src={formState.image_url} alt="Current" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-3">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      
                      <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                        Choose Image
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                      <div className="text-[11px] text-slate-400 mt-2">JPEG, PNG, WebP (Max 5MB). Square aspect ratio recommended.</div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">Active Status</div>
                      <div className="text-[11px] text-slate-500">Toggle to hide this profile.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formState.is_active !== false} onChange={e => setFormState({...formState, is_active: e.target.checked})} />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>
              </div>

            </CardContent>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <Button variant="outline" onClick={closeForm} disabled={saving} className="bg-white">Cancel</Button>
              <Button onClick={handleSaveClick} disabled={saving} className="bg-slate-900 hover:bg-slate-800 font-bold text-white shadow-sm px-8">
                {(saving || uploadingImage) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {uploadingImage ? 'Uploading...' : 'Save Faculty'}
              </Button>
            </div>
          </Card>
        </>
      )}

    </div>
  );
}
