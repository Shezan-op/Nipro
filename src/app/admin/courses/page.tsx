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
  BookOpen,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getCoursesAction, createCourseAction, updateCourseAction, deleteCourseAction, uploadFileAction, getUniqueCategoriesAction } from '@/lib/actions';
import { Course } from '@/lib/data-service';
import { CourseSchema } from '@/lib/schemas';
import { z } from 'zod';

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formState, setFormState] = useState<Course | null>(null);
  const [courseFile, setCourseFile] = useState<File | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const data = await getCoursesAction();
      const cats = await getUniqueCategoriesAction();
      if (mounted) {
        setCourses(data);
        setCategories(cats);
        setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  const reloadCourses = async () => {
    const data = await getCoursesAction();
    const cats = await getUniqueCategoriesAction();
    setCourses(data);
    setCategories(cats);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsAddingCourse(false);
    setFormState({ ...course });
    setCourseFile(null);
  };

  const handleCancelForm = () => {
    setIsAddingCourse(false);
    setEditingCourse(null);
    setFormState(null);
    setCourseFile(null);
  };

  const startAdding = () => {
    setIsAddingCourse(true);
    setEditingCourse(null);
    setCourseFile(null);
    setFormState({
      id: '',
      name: '',
      category: '',
      duration: '',
      shortDescription: '',
      description: '',
      mode: 'Both',
      certification: true,
      status: 'Active',
      image: ''
    });
  };

  const handleSaveForm = async () => {
    if (!formState) return;
    
    try {
      CourseSchema.parse(formState);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      }
      return;
    }

    setSaving(true);

    let finalImage = formState.image;

    // Handle file upload for course image
    if (courseFile) {
      const formData = new FormData();
      formData.append('file', courseFile);
      const uploadResult = await uploadFileAction('course_images', courseFile.name, formData);
      if (uploadResult.success && uploadResult.url) {
        finalImage = uploadResult.url;
      } else {
        toast.error('Image upload failed. Using existing image.');
      }
    }

    const courseToSave = { ...formState, image: finalImage };

    let result;
    if (isAddingCourse) {
      if (courses.some(c => c.id.toLowerCase() === formState.id.toLowerCase())) {
        toast.error('A course with this ID already exists');
        setSaving(false);
        return;
      }
      result = await createCourseAction(courseToSave);
    } else {
      result = await updateCourseAction(courseToSave.id, courseToSave);
    }

    if (result.success) {
      await reloadCourses();
      setIsAddingCourse(false);
      setEditingCourse(null);
      setFormState(null);
      setCourseFile(null);
      toast.success(isAddingCourse ? 'Course added' : 'Course updated');
    } else {
      toast.error('Failed to save course');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    const result = await deleteCourseAction(id);
    if (result.success) {
      await reloadCourses();
      toast.success('Course deleted');
    } else {
      toast.error('Failed to delete course');
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
        {(!isAddingCourse && !editingCourse) && (
          <Button 
            onClick={startAdding}
            className="h-11 px-6 bg-nipro-red hover:bg-nipro-red/90 text-white shadow-lg shadow-nipro-red/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Course
          </Button>
        )}
      </div>

      {(isAddingCourse || editingCourse) && (
        <Card className="border-none shadow-lg hover:shadow-xl rounded-2xl bg-white transition-all duration-300 ring-1 ring-slate-900/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-nipro-blue tracking-tight">
              {isAddingCourse ? 'Add New Course' : `Edit Course: ${editingCourse?.name}`}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCancelForm}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Course ID (Slug)</label>
                <Input 
                  placeholder="e.g. tally-gst"
                  value={formState?.id || ''}
                  onChange={e => setFormState({...formState!, id: e.target.value})}
                  disabled={!isAddingCourse}
                  className="h-12 border-gray-200 focus-visible:ring-nipro-red disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Course Name</label>
                <Input 
                  placeholder="e.g. TallyPrime with GST"
                  value={formState?.name || ''}
                  onChange={e => setFormState({...formState!, name: e.target.value})}
                  className="h-12 border-gray-200 focus-visible:ring-nipro-red"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Category</label>
                <Input 
                  placeholder="e.g. Accounting"
                  value={formState?.category || ''}
                  onChange={e => setFormState({...formState!, category: e.target.value})}
                  list="course-categories"
                  className="h-12 border-gray-200 focus-visible:ring-nipro-red"
                />
                <datalist id="course-categories">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Duration</label>
                <Input 
                  placeholder="e.g. 2 Months (60 Hours)"
                  value={formState?.duration || ''}
                  onChange={e => setFormState({...formState!, duration: e.target.value})}
                  className="h-12 border-gray-200 focus-visible:ring-nipro-red"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Discounted Price (₹)</label>
                <Input 
                  placeholder="e.g. 4500"
                  type="number"
                  value={formState?.price !== undefined && formState?.price !== null ? formState.price : ''}
                  onChange={e => setFormState({...formState!, price: e.target.value ? parseFloat(e.target.value) : undefined})}
                  className="h-12 border-gray-200 focus-visible:ring-nipro-red"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Original Price (₹)</label>
                <Input 
                  placeholder="e.g. 6000"
                  type="number"
                  value={formState?.originalPrice !== undefined && formState?.originalPrice !== null ? formState.originalPrice : ''}
                  onChange={e => setFormState({...formState!, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                  className="h-12 border-gray-200 focus-visible:ring-nipro-red"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Mode</label>
                <select
                  value={formState?.mode || 'Both'}
                  onChange={e => setFormState({...formState!, mode: e.target.value as 'Online' | 'Offline' | 'Both'})}
                  className="w-full h-12 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-nipro-red"
                >
                  <option value="Both">Both (Online & Offline)</option>
                  <option value="Online">Online Only</option>
                  <option value="Offline">Offline Only</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Status</label>
                <select
                  value={formState?.status || 'Active'}
                  onChange={e => setFormState({...formState!, status: e.target.value as 'Active' | 'Inactive'})}
                  className="w-full h-12 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-nipro-red"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Has Certification</label>
                <select
                  value={formState?.certification ? 'Yes' : 'No'}
                  onChange={e => setFormState({...formState!, certification: e.target.value === 'Yes'})}
                  className="w-full h-12 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-nipro-red"
                >
                  <option value="Yes">Yes (ISO Certified)</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Course Image</label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="file"
                    onChange={e => setCourseFile(e.target.files?.[0] || null)}
                    className="h-12 border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nipro-blue/10 file:text-nipro-blue hover:file:bg-nipro-blue/20"
                    accept="image/*"
                  />
                  {courseFile && (
                    <p className="text-xs text-nipro-blue font-medium bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      {courseFile.name}
                    </p>
                  )}
                </div>
                {!courseFile && formState?.image && (
                  <p className="text-[10px] text-gray-400 truncate">Current: {formState.image}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Short Description (Displays in list)</label>
                <textarea
                  placeholder="Enter a brief summary of the course (min 10 characters)..."
                  value={formState?.shortDescription || ''}
                  onChange={e => setFormState({...formState!, shortDescription: e.target.value})}
                  className="w-full min-h-[80px] p-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-nipro-red"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                  Description (Max 500 characters)
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    {(formState?.description || '').length}/500
                  </span>
                </label>
                <textarea
                  placeholder="Enter a description for the course detail page..."
                  value={formState?.description || ''}
                  onChange={e => setFormState({...formState!, description: e.target.value})}
                  maxLength={500}
                  className="w-full min-h-[120px] p-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-nipro-red"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button variant="outline" className="h-11 px-6" onClick={handleCancelForm} disabled={saving}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveForm}
                disabled={saving}
                className="h-11 px-8 bg-nipro-blue hover:bg-nipro-blue/90 text-white shadow-lg shadow-nipro-blue/20"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saving ? 'Saving...' : 'Save Course'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-lg hover:shadow-xl rounded-2xl overflow-hidden bg-white transition-all duration-300 ring-1 ring-slate-900/5">
        <CardHeader className="bg-white border-b border-gray-100 py-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search courses..." 
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
                    <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin text-nipro-red mx-auto mb-4" />
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">
                      No courses found.
                    </td>
                  </tr>
                ) : filtered.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-nipro-blue/5 flex items-center justify-center text-nipro-blue">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-nipro-blue">{course.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{course.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {course.duration}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      <span className="text-nipro-blue font-bold">₹{course.price || 0}</span>
                      {course.originalPrice && (
                        <span className="text-slate-400 line-through ml-2 text-xs font-normal">₹{course.originalPrice}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-nipro-blue" onClick={() => handleEdit(course)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-nipro-red" onClick={() => handleDelete(course.id)}>
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
    </div>
  );
}
