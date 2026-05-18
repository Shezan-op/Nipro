"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Download, 
  Loader2,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getCertificates, addCertificate, deleteCertificate } from '@/lib/actions';
import { Certificate } from '@/lib/data-service';

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newCert, setNewCert] = useState<Partial<Certificate>>({
    id: '',
    fullName: '',
    courseName: '',
    issueDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    imageUrl: '',
    pdfUrl: ''
  });

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const data = await getCertificates();
      if (mounted) {
        setCertificates(data);
        setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  async function loadCertificates() {
    setLoading(true);
    const data = await getCertificates();
    setCertificates(data);
    setLoading(false);
  }

  async function handleAddCertificate() {
    try {
      // Validate basic info
      if (!newCert.id || !newCert.fullName || !newCert.courseName) {
        toast.error('Please fill in all required fields');
        return;
      }

      setUploading(true);

      let finalImageUrl = newCert.imageUrl || '/certificates/placeholder.png';
      let finalPdfUrl = newCert.pdfUrl || '/certificates/placeholder.pdf';

      // Handle file upload if provided
      if (certFile) {
        const formData = new FormData();
        formData.append('file', certFile);
        
        const uploadResult = await import('@/lib/actions').then(m => 
          m.uploadFileAction('certificates', `${newCert.id}-${certFile.name}`, formData)
        );

        if (uploadResult.success) {
          finalImageUrl = uploadResult.url!;
          finalPdfUrl = uploadResult.url!; // Using same URL for both if it's a single file upload for now
        } else {
          toast.error('File upload failed. Proceeding with placeholders.');
        }
      }

      const certificateToSave = {
        ...newCert,
        imageUrl: finalImageUrl,
        pdfUrl: finalPdfUrl
      } as Certificate;

      const result = await addCertificate(certificateToSave);
      if (result.success) {
        toast.success('Certificate issued successfully');
        setIsAdding(false);
        setCertFile(null);
        setNewCert({
          id: '',
          fullName: '',
          courseName: '',
          issueDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          imageUrl: '',
          pdfUrl: ''
        });
        loadCertificates();
      } else {
        toast.error('Failed to issue certificate');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    
    const result = await deleteCertificate(id);
    if (result.success) {
      toast.success('Certificate deleted');
      loadCertificates();
    } else {
      toast.error('Failed to delete');
    }
  }

  const filtered = certificates.filter(c => 
    (c.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
    (c.id || '').includes(search)
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-nipro-blue">Certificates</h1>
          <p className="text-muted-foreground mt-1">Manage and issue student certificates.</p>
        </div>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="h-11 px-6 bg-nipro-red hover:bg-nipro-red/90 text-white shadow-lg shadow-nipro-red/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Issue New Certificate
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border border-slate-200 shadow-sm rounded-xl bg-white animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-nipro-blue">Issue New Certificate</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">ID Number</label>
                <Input 
                  placeholder="e.g. NK123"
                  value={newCert.id}
                  onChange={e => setNewCert({...newCert, id: e.target.value})}
                  className="h-12 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Student Name</label>
                <Input 
                  placeholder="e.g. Mohammed Raheem"
                  value={newCert.fullName}
                  onChange={e => setNewCert({...newCert, fullName: e.target.value, searchAlias: e.target.value.split(' ')[0]})}
                  className="h-12 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Course Name</label>
                <Input 
                  placeholder="e.g. Tally Accounting"
                  value={newCert.courseName}
                  onChange={e => setNewCert({...newCert, courseName: e.target.value})}
                  className="h-12 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Issue Date</label>
                <Input 
                  type="date"
                  value={newCert.issueDate}
                  onChange={e => setNewCert({...newCert, issueDate: e.target.value})}
                  className="h-12 border-gray-200"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Certificate File (PDF or Image)</label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="file"
                    onChange={e => setCertFile(e.target.files?.[0] || null)}
                    className="h-12 border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nipro-blue/10 file:text-nipro-blue hover:file:bg-nipro-blue/20"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {certFile && (
                    <p className="text-xs text-nipro-blue font-medium bg-blue-50 px-3 py-1 rounded-full">
                      Selected: {certFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button variant="outline" className="h-11 px-6" onClick={() => setIsAdding(false)} disabled={uploading}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddCertificate}
                disabled={uploading}
                className="h-11 px-8 bg-nipro-blue hover:bg-nipro-blue/90 text-white shadow-lg shadow-nipro-blue/20"
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {uploading ? 'Processing...' : 'Issue Certificate'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="bg-white border-b border-gray-100 flex flex-row items-center justify-between py-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or certificate ID..." 
              className="pl-10 h-10 border border-gray-200 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Total: {certificates.length}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-slate-600 text-xs uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Certificate ID</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Issue Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-nipro-red mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">Loading certificates...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground">
                      No certificates found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-nipro-blue font-bold">
                        #{cert.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-nipro-blue/5 flex items-center justify-center text-nipro-blue text-xs font-bold">
                            {cert.fullName ? cert.fullName.charAt(0) : '?'}
                          </div>
                          <span className="font-semibold text-nipro-blue">{cert.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">
                          {cert.courseName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                        {cert.issueDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          {cert.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-nipro-blue" asChild>
                            <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-nipro-red" onClick={() => handleDelete(cert.id)}>
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
