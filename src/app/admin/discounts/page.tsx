"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2,
  Loader2,
  Save,
  X,
  TrendingDown,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getDiscountsAction, addDiscountAction, deleteDiscountAction, updateDiscountAction } from '@/lib/actions';
import { Discount } from '@/lib/types';

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [formState, setFormState] = useState<Partial<Discount> | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const data = await getDiscountsAction();
      if (mounted) {
        setDiscounts(data);
        setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  async function loadDiscounts() {
    setLoading(true);
    const data = await getDiscountsAction();
    setDiscounts(data);
    setLoading(false);
  }

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setIsAdding(false);
    setFormState({ ...discount });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingDiscount(null);
    setFormState(null);
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditingDiscount(null);
    setFormState({
      title: '',
      description: '',
      percentage: 10,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  async function handleSave() {
    if (!formState || !formState.title || !formState.percentage || !formState.validUntil) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      if (isAdding) {
        const result = await addDiscountAction(formState as Omit<Discount, 'id'>);
        if (result.success) {
          toast.success('Discount added successfully');
          setIsAdding(false);
          setFormState(null);
          await loadDiscounts();
        } else {
          toast.error('Failed to add discount');
        }
      } else if (editingDiscount) {
        const result = await updateDiscountAction(editingDiscount.id, formState);
        if (result.success) {
          toast.success('Discount updated successfully');
          setEditingDiscount(null);
          setFormState(null);
          await loadDiscounts();
        } else {
          toast.error('Failed to update discount');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this discount?')) return;
    
    const result = await deleteDiscountAction(id);
    if (result.success) {
      toast.success('Discount deleted');
      await loadDiscounts();
    } else {
      toast.error('Failed to delete');
    }
  }

  const filtered = discounts.filter(d => 
    (d.title || '').toLowerCase().includes(search.toLowerCase()) || 
    (d.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-nipro-blue">Discounts & Offers</h1>
          <p className="text-muted-foreground mt-1">Manage promotional discounts for courses.</p>
        </div>
        {!isAdding && !editingDiscount && (
          <Button 
            onClick={startAdding}
            className="h-11 px-6 bg-nipro-red hover:bg-nipro-red/90 text-white shadow-lg shadow-nipro-red/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Offer
          </Button>
        )}
      </div>

      {(isAdding || editingDiscount) && formState && (
        <Card className="border-none shadow-lg hover:shadow-xl rounded-2xl bg-white transition-all duration-300 ring-1 ring-slate-900/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-nipro-blue tracking-tight">
              {isAdding ? 'Create New Offer' : `Edit Offer: ${editingDiscount?.title}`}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Offer Title</label>
                <Input 
                  placeholder="e.g. Summer Special 2024"
                  value={formState.title || ''}
                  onChange={e => setFormState({...formState, title: e.target.value})}
                  className="h-12 border-gray-200 focus-visible:ring-nipro-red"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Discount Percentage (%)</label>
                <Input 
                  type="number"
                  placeholder="e.g. 20"
                  value={formState.percentage || ''}
                  onChange={e => setFormState({...formState, percentage: parseInt(e.target.value) || 0})}
                  className="h-12 border-gray-200 focus-visible:ring-nipro-red"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Description</label>
                <Input 
                  placeholder="e.g. Get 20% off on all professional courses this summer!"
                  value={formState.description || ''}
                  onChange={e => setFormState({...formState, description: e.target.value})}
                  className="h-12 border-gray-200 focus-visible:ring-nipro-red"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Valid Until</label>
                <Input 
                  type="date"
                  value={formState.validUntil || ''}
                  onChange={e => setFormState({...formState, validUntil: e.target.value})}
                  className="h-12 border-gray-200 focus-visible:ring-nipro-red"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button variant="outline" className="h-11 px-6" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="h-11 px-8 bg-nipro-blue hover:bg-nipro-blue/90 text-white shadow-lg shadow-nipro-blue/20"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saving ? 'Saving...' : 'Save Offer'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-lg hover:shadow-xl rounded-2xl overflow-hidden bg-white transition-all duration-300 ring-1 ring-slate-900/5">
        <CardHeader className="bg-white border-b border-gray-100 flex flex-row items-center justify-between py-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search offers..." 
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
                  <th className="px-6 py-4">Offer Title</th>
                  <th className="px-6 py-4">Percentage</th>
                  <th className="px-6 py-4">Valid Until</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-nipro-red mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">Loading offers...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-slate-500 font-medium">
                      No offers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((discount) => (
                    <tr key={discount.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-nipro-blue">{discount.title}</span>
                          <span className="text-xs text-slate-500">{discount.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-nipro-red/10 p-1.5 rounded-lg">
                            <TrendingDown className="h-4 w-4 text-nipro-red" />
                          </div>
                          <span className="font-bold text-nipro-red text-lg">{discount.percentage}% OFF</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {new Date(discount.validUntil).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-nipro-blue" onClick={() => handleEdit(discount)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-nipro-red" onClick={() => handleDelete(discount.id)}>
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
        </CardContent>
      </Card>
    </div>
  );
}
