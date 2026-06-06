import os

testimonials_code = '''\
"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Save, X, Image as ImageIcon, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  getTestimonialsAction, createTestimonialAction, deleteTestimonialAction, updateTestimonialAction, uploadFileAction 
} from '@/lib/actions';
import { Testimonial } from '@/lib/types';

export default function AdminTestimonials() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<Testimonial>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const res = await getTestimonialsAction();
    if (res.success && res.data) {
      setList(res.data);
    }
    setLoading(false);
  }

  const handleEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setFormState({ ...item });
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const startAdding = () => {
    setEditingId(null);
    setFormState({
      name: '',
      role_course: '',
      testimony: '',
      image_url: '',
      sort_order: list.length,
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
    await updateTestimonialAction(id, { is_active: !current });
    toast.success(current ? 'Testimonial hidden' : 'Testimonial active');
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    const res = await deleteTestimonialAction(id);
    if (res.success) {
      toast.success('Testimonial deleted');
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
    if (!formState.name || !formState.role_course || !formState.testimony) {
      toast.error('Name, Role/Course, and Testimony are required');
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = formState.image_url;

      if (selectedFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await uploadFileAction('testimonial_images', selectedFile.name, formData);
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
        role_course: formState.role_course,
        testimony: formState.testimony,
        image_url: finalImageUrl || '',
        sort_order: formState.sort_order || 0,
        is_active: formState.is_active !== false,
      };

      if (editingId) {
        await updateTestimonialAction(editingId, payload);
        toast.success('Testimonial updated');
      } else {
        await createTestimonialAction(payload);
        toast.success('Testimonial added');
      }
      closeForm();
      loadData();
    } catch (e) {
      toast.error('Error saving testimonial');
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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Testimonials</h1>
              <p className="text-sm text-slate-500 mt-1">Manage student reviews shown on the homepage.</p>
            </div>
            <Button onClick={startAdding} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-6 rounded-lg shadow-sm">
              <Plus className="mr-2 w-4 h-4" /> Add Testimonial
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
                        Loading testimonials...
                      </td>
                    </tr>
                  ) : list.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                        <div className="font-semibold text-slate-700">No testimonials found</div>
                        <div className="text-xs">Add student reviews to show them on the homepage.</div>
                      </td>
                    </tr>
                  ) : (
                    list.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-bold text-slate-500">{t.sort_order}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            {t.image_url ? (
                              <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">{t.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{t.role_course}</div>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggleActive(t.id, t.is_active)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              t.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {t.is_active ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900" onClick={() => handleEdit(t)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(t.id)}>
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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h1>
              <p className="text-sm text-slate-500 mt-1">Review details will appear on the homepage.</p>
            </div>
            <Button variant="outline" onClick={closeForm} className="h-9 font-semibold text-slate-600">
              Back
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
                    <label className="text-sm font-semibold text-slate-900">Role / Course *</label>
                    <Input 
                      placeholder="e.g. Student - Tally Prime" 
                      value={formState.role_course || ''}
                      onChange={e => setFormState({...formState, role_course: e.target.value})}
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900">Testimony *</label>
                    <Textarea 
                      placeholder="Review text..." 
                      value={formState.testimony || ''}
                      onChange={e => setFormState({...formState, testimony: e.target.value})}
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
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">Active Status</div>
                      <div className="text-[11px] text-slate-500">Toggle to hide this review.</div>
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
                {uploadingImage ? 'Uploading...' : 'Save Testimonial'}
              </Button>
            </div>
          </Card>
        </>
      )}

    </div>
  );
}
'''

govt_code = '''\
"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Save, X, Image as ImageIcon, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  getGovtCertificatesAction, createGovtCertificateAction, deleteGovtCertificateAction, updateGovtCertificateAction, uploadFileAction 
} from '@/lib/actions';
import { GovtCertificate } from '@/lib/types';

export default function AdminGovtCertificates() {
  const [list, setList] = useState<GovtCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<GovtCertificate>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const res = await getGovtCertificatesAction();
    if (res.success && res.data) {
      setList(res.data);
    }
    setLoading(false);
  }

  const handleEdit = (item: GovtCertificate) => {
    setEditingId(item.id);
    setFormState({ ...item });
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const startAdding = () => {
    setEditingId(null);
    setFormState({
      title: '',
      image_url: '',
      sort_order: list.length,
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
    await updateGovtCertificateAction(id, { is_active: !current });
    toast.success(current ? 'Certificate hidden' : 'Certificate active');
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    const res = await deleteGovtCertificateAction(id);
    if (res.success) {
      toast.success('Certificate deleted');
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
    if (!formState.title) {
      toast.error('Title is required');
      return;
    }
    if (!formState.image_url && !selectedFile) {
      toast.error('Image is required');
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = formState.image_url;

      if (selectedFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await uploadFileAction('govt_cert_images', selectedFile.name, formData);
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
        title: formState.title,
        image_url: finalImageUrl || '',
        sort_order: formState.sort_order || 0,
        is_active: formState.is_active !== false,
      };

      if (editingId) {
        await updateGovtCertificateAction(editingId, payload);
        toast.success('Certificate updated');
      } else {
        await createGovtCertificateAction(payload);
        toast.success('Certificate added');
      }
      closeForm();
      loadData();
    } catch (e) {
      toast.error('Error saving certificate');
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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Govt Certificates</h1>
              <p className="text-sm text-slate-500 mt-1">Manage Government Authorizations & Proof shown on homepage.</p>
            </div>
            <Button onClick={startAdding} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-6 rounded-lg shadow-sm">
              <Plus className="mr-2 w-4 h-4" /> Add Certificate
            </Button>
          </div>

          <Card className="shadow-sm rounded-xl overflow-hidden border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 w-12 text-center">Order</th>
                    <th className="px-5 py-3 w-20">Image</th>
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                        Loading certificates...
                      </td>
                    </tr>
                  ) : list.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                        <div className="font-semibold text-slate-700">No certificates found</div>
                      </td>
                    </tr>
                  ) : (
                    list.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 text-center">
                          <span className="font-bold text-slate-500">{t.sort_order}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="w-16 h-12 rounded overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            {t.image_url ? (
                              <img src={t.image_url} alt={t.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">{t.title}</div>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggleActive(t.id, t.is_active)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              t.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {t.is_active ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900" onClick={() => handleEdit(t)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(t.id)}>
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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{editingId ? 'Edit Certificate' : 'Add Certificate'}</h1>
            </div>
            <Button variant="outline" onClick={closeForm} className="h-9 font-semibold text-slate-600">
              Back
            </Button>
          </div>

          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900">Title *</label>
                    <Input 
                      placeholder="e.g. ISO 9001:2015" 
                      value={formState.title || ''}
                      onChange={e => setFormState({...formState, title: e.target.value})}
                      className="bg-slate-50"
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
                  </div>
                  
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between mt-4">
                    <div>
                      <div className="font-bold text-sm text-slate-900">Active Status</div>
                      <div className="text-[11px] text-slate-500">Toggle to hide this certificate.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formState.is_active !== false} onChange={e => setFormState({...formState, is_active: e.target.checked})} />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900">Certificate Image *</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50">
                      {selectedFile ? (
                        <div className="w-full max-w-[200px] h-32 rounded-lg overflow-hidden mb-3 border-4 border-white shadow-md relative">
                          <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : formState.image_url ? (
                        <div className="w-full max-w-[200px] h-32 rounded-lg overflow-hidden mb-3 border-4 border-white shadow-md">
                          <img src={formState.image_url} alt="Current" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 mb-3">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      
                      <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                        Choose Image
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

            </CardContent>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <Button variant="outline" onClick={closeForm} disabled={saving} className="bg-white">Cancel</Button>
              <Button onClick={handleSaveClick} disabled={saving} className="bg-slate-900 hover:bg-slate-800 font-bold text-white shadow-sm px-8">
                {(saving || uploadingImage) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {uploadingImage ? 'Uploading...' : 'Save Certificate'}
              </Button>
            </div>
          </Card>
        </>
      )}

    </div>
  );
}
'''

os.makedirs('src/app/admin/testimonials', exist_ok=True)
open('src/app/admin/testimonials/page.tsx', 'w', encoding='utf-8').write(testimonials_code)

os.makedirs('src/app/admin/govt-certificates', exist_ok=True)
open('src/app/admin/govt-certificates/page.tsx', 'w', encoding='utf-8').write(govt_code)
