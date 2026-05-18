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
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getCoursesAction, saveCourses } from '@/lib/actions';
import { Course } from '@/lib/data-service';
import { CourseSchema } from '@/lib/schemas';
import { z } from 'zod';

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Course | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const data = await getCoursesAction();
      if (mounted) {
        setCourses(data);
        setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setEditForm({ ...course });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const startAdding = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: '',
      category: '',
      duration: '',
      shortDescription: '',
      mode: 'Both',
      certification: true,
      status: 'Active'
    };
    setEditForm(newCourse);
    setEditingId(newCourse.id);
  };

  const handleSave = async () => {
    if (!editForm) return;
    
    try {
      CourseSchema.parse(editForm);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      }
      return;
    }

    setSaving(true);
    
    const courseToSave = { ...editForm };
    
    let updatedCourses;
    const isNew = !courses.find(c => c.id === courseToSave.id);
    
    if (isNew) {
      updatedCourses = [courseToSave, ...courses];
    } else {
      updatedCourses = courses.map(c => c.id === courseToSave.id ? courseToSave : c);
    }

    const result = await saveCourses(updatedCourses);
    
    if (result.success) {
      setCourses(updatedCourses);
      setEditingId(null);
      setEditForm(null);
      toast.success(isNew ? 'Course added' : 'Course updated');
    } else {
      toast.error('Failed to update');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const updatedCourses = courses.filter(c => c.id !== id);
    const result = await saveCourses(updatedCourses);
    if (result.success) {
      setCourses(updatedCourses);
      toast.success('Course deleted');
    } else {
      toast.error('Failed to delete');
    }
  };

  const filtered = courses.filter(c => 
    (c.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (c.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-nipro-blue">Course Management</h1>
          <p className="text-muted-foreground mt-1">Add, edit, or remove courses from the catalog.</p>
        </div>
        <Button 
          onClick={startAdding}
          className="h-11 px-6 bg-nipro-red hover:bg-nipro-red/90 text-white shadow-lg shadow-nipro-red/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Course
        </Button>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="bg-white border-b border-gray-100 py-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search courses..." 
              className="pl-10 h-10 border border-gray-200 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-slate-600 text-xs uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Course Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Price (Disc/Orig)</th>
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
                ) : filtered.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                    {editingId === course.id ? (
                      <>
                        <td className="px-6 py-4">
                          <Input 
                            value={editForm?.name} 
                            onChange={e => setEditForm({...editForm!, name: e.target.value})}
                            className="h-9 mb-2"
                            placeholder="Course Name"
                          />
                          <Input 
                            value={editForm?.shortDescription} 
                            onChange={e => setEditForm({...editForm!, shortDescription: e.target.value})}
                            className="h-9 text-xs"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input 
                            value={editForm?.category} 
                            onChange={e => setEditForm({...editForm!, category: e.target.value})}
                            className="h-9"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input 
                            value={editForm?.duration} 
                            onChange={e => setEditForm({...editForm!, duration: e.target.value})}
                            className="h-9"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Input 
                              value={editForm?.price !== undefined ? editForm.price.toString() : ''} 
                              onChange={e => setEditForm({...editForm!, price: e.target.value ? parseFloat(e.target.value) : undefined})}
                              className="h-9 w-24"
                              placeholder="Disc"
                              type="number"
                            />
                            <Input 
                              value={editForm?.originalPrice !== undefined ? editForm.originalPrice.toString() : ''} 
                              onChange={e => setEditForm({...editForm!, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                              className="h-9 w-24"
                              placeholder="Orig"
                              type="number"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8" onClick={handleSave} disabled={saving}>
                              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            </Button>
                            <Button size="sm" variant="outline" className="h-8" onClick={handleCancel}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-nipro-blue/5 flex items-center justify-center text-nipro-blue">
                              <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-bold text-nipro-blue">{course.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{course.shortDescription}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                            {course.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                          {course.duration}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <span className="text-nipro-blue">₹{course.price || 0}</span>
                          {course.originalPrice && (
                            <span className="text-muted-foreground line-through ml-2 text-xs">₹{course.originalPrice}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(course)}>
                              <Edit2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(course.id)}>
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-nipro-red" />
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
