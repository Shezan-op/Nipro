"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Trash2, Edit2, Loader2, Save, X, TrendingDown, Calendar, 
  AlertTriangle, MonitorPlay, MessageSquareWarning, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getDiscountsAction, addDiscountAction, deleteDiscountAction, updateDiscountAction, getCoursesAction
} from '@/lib/actions';
import { Discount, Course } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function formatDateForInput(dateStr?: string) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch (e) {
    return '';
  }
}

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // List state
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'scheduled' | 'paused' | 'expired'>('all');
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<Discount>>({});
  
  // Conflict state
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflicts, setConflicts] = useState<Discount[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [dData, cData] = await Promise.all([
      getDiscountsAction(),
      getCoursesAction()
    ]);
    setDiscounts(dData);
    setCourses(cData);
    setLoading(false);
  }

  const getStatus = (d: Discount) => {
    const now = new Date();
    if (!d.is_active) return { label: 'Paused', cls: 'paused' };
    if (new Date(d.ends_at) < now) return { label: 'Expired', cls: 'expired' };
    if (new Date(d.starts_at) > now) return { label: 'Scheduled', cls: 'scheduled' };
    return { label: 'Active', cls: 'active' };
  };

  const stats = useMemo(() => {
    const s = { active: 0, scheduled: 0, paused: 0, expired: 0 };
    discounts.forEach(d => {
      const st = getStatus(d);
      if (st.cls in s) s[st.cls as keyof typeof s]++;
    });
    return s;
  }, [discounts]);

  const filteredList = useMemo(() => {
    return discounts.filter(d => {
      if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === 'all') return true;
      return getStatus(d).cls === filter;
    });
  }, [discounts, search, filter]);

  const handleEdit = (d: Discount) => {
    setEditingId(d.id);
    setFormState({
      ...d,
      starts_at: formatDateForInput(d.starts_at),
      ends_at: formatDateForInput(d.ends_at),
      course_ids: d.course_ids || [],
    });
    setIsFormOpen(true);
  };

  const startAdding = () => {
    setEditingId(null);
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + 30);
    
    setFormState({
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 20,
      min_floor_price: 0,
      promo_surface: 'top_bar',
      popup_mode: null,
      applies_to: 'all',
      course_ids: [],
      starts_at: formatDateForInput(now.toISOString()),
      ends_at: formatDateForInput(end.toISOString()),
      is_active: true,
      internal_note: ''
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormState({});
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await updateDiscountAction(id, { is_active: !current });
    toast.success(current ? 'Discount paused' : 'Discount activated');
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount?')) return;
    const res = await deleteDiscountAction(id);
    if (res.success) {
      toast.success('Discount deleted');
      loadData();
    } else {
      toast.error('Failed to delete');
    }
  };

  const checkConflicts = () => {
    if (!formState.starts_at || !formState.ends_at) return [];
    const newStart = new Date(formState.starts_at);
    const newEnd = new Date(formState.ends_at);
    
    return discounts.filter(d => {
      if (d.id === editingId) return false;
      if (!d.is_active) return false;
      
      const dStart = new Date(d.starts_at);
      const dEnd = new Date(d.ends_at);
      const datesOverlap = (newStart <= dEnd) && (newEnd >= dStart);
      if (!datesOverlap) return false;
      
      if (formState.applies_to === 'all' || d.applies_to === 'all') return true;
      
      const formCourses = formState.course_ids || [];
      const dCourses = d.course_ids || [];
      return formCourses.some(id => dCourses.includes(id));
    });
  };

  const handleSaveClick = () => {
    if (!formState.title || formState.discount_value === undefined || !formState.starts_at || !formState.ends_at) {
      toast.error('Please fill all required fields');
      return;
    }
    if (formState.applies_to === 'selected' && (!formState.course_ids || formState.course_ids.length === 0)) {
      toast.error('Please select at least one course');
      return;
    }

    const foundConflicts = checkConflicts();
    if (foundConflicts.length > 0) {
      setConflicts(foundConflicts);
      setConflictModalOpen(true);
    } else {
      executeSave();
    }
  };

  const executeSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: formState.title,
        description: formState.description || '',
        discount_type: formState.discount_type || 'percentage',
        discount_value: formState.discount_value || 0,
        min_floor_price: formState.min_floor_price || 0,
        promo_surface: formState.promo_surface || 'top_bar',
        popup_mode: formState.promo_surface === 'popup' ? (formState.popup_mode || 'delay') : null,
        applies_to: formState.applies_to || 'all',
        course_ids: formState.applies_to === 'all' ? [] : (formState.course_ids || []),
        starts_at: new Date(formState.starts_at!).toISOString(),
        ends_at: new Date(formState.ends_at!).toISOString(),
        is_active: formState.is_active,
        internal_note: formState.internal_note || '',
      } as any;

      if (editingId) {
        await updateDiscountAction(editingId, payload);
        toast.success('Discount updated');
      } else {
        await addDiscountAction(payload);
        toast.success('Discount created');
      }
      closeForm();
      setConflictModalOpen(false);
      loadData();
    } catch (e) {
      toast.error('Error saving discount');
    } finally {
      setSaving(false);
    }
  };

  const toggleCourse = (id: string) => {
    const ids = formState.course_ids || [];
    if (ids.includes(id)) {
      setFormState({ ...formState, course_ids: ids.filter(i => i !== id) });
    } else {
      setFormState({ ...formState, course_ids: [...ids, id] });
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      
      {!isFormOpen ? (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-red-200 bg-red-50/50 shadow-sm">
              <CardContent className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Active Discounts</div>
                <div className="text-3xl font-black text-red-600">{stats.active}</div>
                <div className="text-xs text-slate-500 mt-1">Currently live on site</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Scheduled</div>
                <div className="text-3xl font-black text-slate-800">{stats.scheduled}</div>
                <div className="text-xs text-slate-500 mt-1">Starting in future</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Paused</div>
                <div className="text-3xl font-black text-slate-800">{stats.paused}</div>
                <div className="text-xs text-slate-500 mt-1">Manually disabled</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Expired</div>
                <div className="text-3xl font-black text-slate-800">{stats.expired}</div>
                <div className="text-xs text-slate-500 mt-1">Past their end date</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Discounts</h1>
              <p className="text-sm text-slate-500 mt-1">Manage promotions. Best-value deals are automatically calculated for overlaps.</p>
            </div>
            <Button onClick={startAdding} className="bg-red-600 hover:bg-red-700 text-white font-bold h-10 px-6 rounded-lg shadow-sm">
              <Plus className="mr-2 w-4 h-4" /> Add New Discount
            </Button>
          </div>

          <Card className="shadow-sm rounded-xl overflow-hidden border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search discounts..." 
                  className="pl-9 h-9 text-sm bg-slate-50 border-slate-200"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                {['all', 'active', 'scheduled', 'paused', 'expired'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md border capitalize whitespace-nowrap transition-colors ${
                      filter === f 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 w-12">Live</th>
                    <th className="px-5 py-3">Discount Details</th>
                    <th className="px-5 py-3">Surface & Value</th>
                    <th className="px-5 py-3">Applies To</th>
                    <th className="px-5 py-3">Schedule (IST)</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-red-500" />
                        Loading discounts...
                      </td>
                    </tr>
                  ) : filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                        <div className="text-3xl mb-2">🏷️</div>
                        <div className="font-semibold text-slate-700">No discounts found</div>
                        <div className="text-xs">Create your first discount to show offers on the homepage.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredList.map(d => {
                      const st = getStatus(d);
                      return (
                        <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={d.is_active} onChange={() => handleToggleActive(d.id, d.is_active)} />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                          </td>
                          <td className="px-5 py-4 max-w-[200px] truncate">
                            <div className="font-bold text-slate-900 truncate">{d.title}</div>
                            {d.internal_note && <div className="text-xs text-slate-500 truncate">Note: {d.internal_note}</div>}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col items-start gap-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{d.promo_surface.replace('_', ' ')}</span>
                              {d.discount_type === 'percentage' ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                                  % {d.discount_value}% OFF
                                </span>
                              ) : d.discount_type === 'flat' ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-100">
                                  ₹- ₹{d.discount_value} OFF
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100">
                                  ₹! Fixed ₹{d.discount_value}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {d.applies_to === 'all' ? (
                              <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">All Courses</span>
                            ) : (
                              <span className="text-xs font-bold px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {(d.course_ids || []).length} Selected
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-500">
                            <div>{new Date(d.starts_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
                            <div>→ {new Date(d.ends_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                              st.cls === 'active' ? 'bg-green-50 text-green-600' :
                              st.cls === 'scheduled' ? 'bg-blue-50 text-blue-600' :
                              st.cls === 'paused' ? 'bg-slate-100 text-slate-500' :
                              'bg-red-50 text-red-600'
                            }`}>
                              <span className="text-[8px]">●</span> {st.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900" onClick={() => handleEdit(d)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(d.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <>
          {/* FORM VIEW */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{editingId ? 'Edit Discount' : 'New Discount'}</h1>
              <p className="text-sm text-slate-500 mt-1">Configure your promo placement, logic, and safety limits.</p>
            </div>
            <Button variant="outline" onClick={closeForm} className="h-9 font-semibold text-slate-600">
              ← Back to List
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="text-base font-bold text-slate-800">Discount Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                
                {/* 1. Basic Info */}
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">1. Promotion Details</div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">Promo Title *</label>
                      <Input 
                        placeholder="e.g. Summer Special 2026" 
                        value={formState.title || ''}
                        onChange={e => setFormState({...formState, title: e.target.value})}
                        className="bg-slate-50 focus-visible:ring-red-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">Description <span className="font-normal text-slate-400">(Public)</span></label>
                      <Input 
                        placeholder="e.g. Get 20% off all design courses this weekend!" 
                        value={formState.description || ''}
                        onChange={e => setFormState({...formState, description: e.target.value})}
                        className="bg-slate-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">Internal Note <span className="font-normal text-slate-400">(Admin only)</span></label>
                      <Input 
                        placeholder="e.g. Approved by marketing on June 4" 
                        value={formState.internal_note || ''}
                        onChange={e => setFormState({...formState, internal_note: e.target.value})}
                        className="bg-slate-50"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Promo Surface */}
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">2. Promo Surface</div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'top_bar', label: 'Top Bar', icon: MonitorPlay, desc: 'Highest visibility header' },
                      { id: 'popup', label: 'Popup', icon: MessageSquareWarning, desc: 'Interruptive modal' },
                      { id: 'soft_reminder', label: 'Soft Reminder', icon: ArrowRight, desc: 'Subtle block near footer' }
                    ].map(s => (
                      <div 
                        key={s.id}
                        onClick={() => setFormState({...formState, promo_surface: s.id as any})}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          formState.promo_surface === s.id 
                            ? 'border-red-500 bg-red-50/30' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <s.icon className={`w-5 h-5 mb-2 ${formState.promo_surface === s.id ? 'text-red-500' : 'text-slate-400'}`} />
                        <div className="font-bold text-sm text-slate-900">{s.label}</div>
                        <div className="text-[11px] text-slate-500 leading-tight mt-1">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                  
                  {formState.promo_surface === 'popup' && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 flex gap-4 items-center">
                      <label className="text-sm font-semibold text-slate-700">Popup Trigger Mode:</label>
                      <select 
                        className="h-9 px-3 rounded-md border-slate-300 text-sm bg-white outline-none focus:ring-1 focus:ring-red-500"
                        value={formState.popup_mode || 'delay'}
                        onChange={e => setFormState({...formState, popup_mode: e.target.value as any})}
                      >
                        <option value="delay">7-Second Delay</option>
                        <option value="exit_intent">Exit Intent (when mouse leaves top)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 3. Discount Logic */}
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">3. Discount Logic</div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'percentage', label: 'Percentage', sym: '%' },
                      { id: 'flat', label: 'Flat Amount', sym: '₹-' },
                      { id: 'fixed', label: 'Fixed Price', sym: '₹!' }
                    ].map(t => (
                      <div 
                        key={t.id}
                        onClick={() => setFormState({...formState, discount_type: t.id as any})}
                        className={`border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${
                          formState.discount_type === t.id 
                            ? 'border-red-500 bg-red-50/30' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className={`text-lg font-black mb-1 ${formState.discount_type === t.id ? 'text-red-600' : 'text-slate-400'}`}>{t.sym}</div>
                        <div className="font-bold text-xs text-slate-800">{t.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">
                        {formState.discount_type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} *
                      </label>
                      <Input 
                        type="number" 
                        min="0"
                        value={formState.discount_value || ''}
                        onChange={e => setFormState({...formState, discount_value: parseFloat(e.target.value) || 0})}
                        className="bg-slate-50 focus-visible:ring-red-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">Min Floor Price (₹)</label>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="e.g. 999"
                        value={formState.min_floor_price || ''}
                        onChange={e => setFormState({...formState, min_floor_price: parseFloat(e.target.value) || 0})}
                        className="bg-slate-50 focus-visible:ring-red-500"
                      />
                      <div className="text-[10px] text-slate-400">Protects from selling below this price</div>
                    </div>
                  </div>
                </div>

                {/* 4. Course Targeting */}
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">4. Course Targeting</div>
                  
                  <div className="flex gap-3">
                    <div 
                      onClick={() => setFormState({...formState, applies_to: 'all'})}
                      className={`flex-1 border-2 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all ${
                        formState.applies_to === 'all' ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formState.applies_to==='all' ? 'border-red-500 bg-red-500' : 'border-slate-300'}`}>
                        {formState.applies_to === 'all' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">All Courses</div>
                        <div className="text-[11px] text-slate-500">Applies to everything</div>
                      </div>
                    </div>
                    <div 
                      onClick={() => setFormState({...formState, applies_to: 'selected'})}
                      className={`flex-1 border-2 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all ${
                        formState.applies_to === 'selected' ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formState.applies_to==='selected' ? 'border-red-500 bg-red-500' : 'border-slate-300'}`}>
                        {formState.applies_to === 'selected' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">Selected Courses</div>
                        <div className="text-[11px] text-slate-500">Pick specific courses</div>
                      </div>
                    </div>
                  </div>

                  {formState.applies_to === 'selected' && (
                    <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <div className="max-h-[240px] overflow-y-auto p-1 divide-y divide-slate-100">
                        {courses.map(c => (
                          <div 
                            key={c.id} 
                            onClick={() => toggleCourse(c.id)}
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer"
                          >
                            <input 
                              type="checkbox" 
                              checked={(formState.course_ids || []).includes(c.id)}
                              readOnly
                              className="w-4 h-4 text-red-500 rounded border-slate-300 cursor-pointer" 
                            />
                            <div className="flex-1">
                              <div className="text-sm font-bold text-slate-800">{c.name}</div>
                              <div className="text-[11px] text-slate-500">₹{c.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Schedule & Status */}
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">5. Schedule (IST)</div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">Starts At *</label>
                      <Input 
                        type="datetime-local" 
                        value={formState.starts_at || ''}
                        onChange={e => setFormState({...formState, starts_at: e.target.value})}
                        className="bg-slate-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">Ends At *</label>
                      <Input 
                        type="datetime-local" 
                        value={formState.ends_at || ''}
                        onChange={e => setFormState({...formState, ends_at: e.target.value})}
                        className="bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl mt-4">
                    <div>
                      <div className="font-bold text-sm text-slate-900">Status: Active</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Pause this anytime to hide it immediately.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formState.is_active} onChange={e => setFormState({...formState, is_active: e.target.checked})} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>

              </CardContent>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <Button variant="outline" onClick={closeForm} disabled={saving} className="bg-white">Cancel</Button>
                <Button onClick={handleSaveClick} disabled={saving} className="bg-red-600 hover:bg-red-700 font-bold text-white shadow-sm px-8">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Promo
                </Button>
              </div>
            </Card>

            {/* LIVE PREVIEW SIDEBAR */}
            <div className="sticky top-6">
              <Card className="shadow-sm border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                  <div className="font-bold text-sm flex items-center gap-2"><MonitorPlay className="w-4 h-4" /> Live Preview</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Auto Sync</div>
                </div>
                <CardContent className="p-5 space-y-6 bg-slate-50">
                  
                  {formState.promo_surface === 'top_bar' && (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Header Top Bar</div>
                      <div className="bg-red-600 text-white p-2 rounded-md text-xs text-center font-semibold shadow-inner border border-red-700 flex justify-between items-center">
                        <span className="truncate flex-1 text-left px-2">{formState.title || 'Enter title...'}</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] whitespace-nowrap">Chat →</span>
                      </div>
                    </div>
                  )}

                  {formState.promo_surface === 'popup' && (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Popup Modal</div>
                      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 text-center">
                        <div className="text-xl mb-1">🎁</div>
                        <div className="font-bold text-slate-900 text-sm mb-1">{formState.title || 'Special Offer'}</div>
                        <div className="text-[11px] text-slate-500 mb-3">{formState.description || 'Description goes here'}</div>
                        <div className="bg-green-500 text-white text-[11px] font-bold py-1.5 rounded">Claim Offer</div>
                      </div>
                    </div>
                  )}

                  {formState.promo_surface === 'soft_reminder' && (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Footer Reminder Block</div>
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-red-900 text-xs">{formState.title || 'Don\'t miss out'}</div>
                          <div className="text-[10px] text-red-700 mt-0.5">Ends soon. Enroll today.</div>
                        </div>
                        <div className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold">Enroll</div>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-blue-900 text-xs">Best Value Protection</div>
                        <div className="text-[10px] text-blue-700 leading-snug mt-1">
                          If multiple promos apply to a course, the pricing engine automatically calculates and displays the one offering the highest Rupee savings.
                        </div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* CONFLICT MODAL */}
      {conflictModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl border-0 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-amber-400 p-5 flex items-start gap-4">
              <div className="bg-white p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-amber-950">Discount Overlap Detected</h3>
                <p className="text-amber-900/80 text-sm font-medium mt-1">This promo's dates and courses overlap with existing active campaigns.</p>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="text-sm font-bold text-slate-700 mb-3">Conflicting Promotions:</div>
              <div className="space-y-2 mb-6">
                {conflicts.map(c => (
                  <div key={c.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{c.title}</div>
                      <div className="text-xs text-slate-500">{new Date(c.starts_at).toLocaleDateString()} to {new Date(c.ends_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                      {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 leading-relaxed">
                <strong className="block mb-1">How the engine handles this:</strong>
                The system allows multiple promos to exist. However, the Course Cards and WhatsApp links will <strong>automatically display whichever promo gives the student the highest actual Rupee savings</strong> for that specific course.
              </div>
            </CardContent>
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConflictModalOpen(false)} className="bg-white text-slate-700 font-semibold">Cancel</Button>
              <Button onClick={() => executeSave()} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 shadow-sm">
                {saving ? 'Saving...' : 'Keep Both (Let System Decide)'}
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
