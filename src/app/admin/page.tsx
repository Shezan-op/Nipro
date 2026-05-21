import React from 'react';
import { 
  Users, 
  BookOpen, 
  FileCheck, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCoursesAction, getCertificates, getBlogs } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const courses = await getCoursesAction();
  const certificates = await getCertificates();
  const blogs = await getBlogs();

  const stats = [
    { label: 'Active Courses', value: courses.length, icon: BookOpen, color: 'text-blue-600 border-blue-100 bg-blue-50/80' },
    { label: 'Certificates Issued', value: certificates.length, icon: FileCheck, color: 'text-emerald-600 border-emerald-100 bg-emerald-50/80' },
    { label: 'Blog Posts', value: blogs.length, icon: Users, color: 'text-indigo-600 border-indigo-100 bg-indigo-50/80' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Welcome back. Here&apos;s what&apos;s happening at Nipro.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="h-10 px-5 rounded-full border border-zinc-200 bg-white text-zinc-800 font-semibold text-xs tracking-wider shadow-sm hover:bg-zinc-50 hover:text-zinc-950 transition-all">
            <Link href="/" target="_blank" className="flex items-center">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              View Site
            </Link>
          </Button>
          <Button asChild className="h-10 px-5 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs tracking-wider shadow-sm hover:shadow transition-all">
            <Link href="/admin/certificates" className="flex items-center">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Entry
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-black/[0.03] shadow-sm rounded-[24px] bg-white transition-shadow hover:shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 tracking-tight">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-950 mt-1 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`${stat.color} p-3.5 rounded-2xl border`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border border-black/[0.03] shadow-sm rounded-[24px] bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-slate-950 tracking-tight">Recent Certificates</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs font-semibold text-nipro-blue hover:bg-nipro-blue/5 hover:text-nipro-blue rounded-full px-3">
              <Link href="/admin/certificates">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3.5">
              {certificates.slice(0, 5).map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-black/[0.02] hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-black/[0.02]">
                      <FileCheck className="h-4.5 w-4.5 text-nipro-blue" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-950 text-sm tracking-tight">{cert.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{cert.courseName} • ID: {cert.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-950 mb-1">{cert.issueDate}</p>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-bold uppercase tracking-wider">
                      {cert.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 border border-black/[0.03] shadow-sm rounded-[24px] bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-950 tracking-tight">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full h-11 justify-start text-xs font-semibold rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 hover:text-zinc-950 text-zinc-700 shadow-sm transition-all group" asChild>
              <Link href="/admin/certificates">
                <Plus className="mr-3 h-4.5 w-4.5 text-nipro-red group-hover:scale-110 transition-transform" />
                Add Certificate
              </Link>
            </Button>
            <Button variant="outline" className="w-full h-11 justify-start text-xs font-semibold rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 hover:text-zinc-950 text-zinc-700 shadow-sm transition-all group" asChild>
              <Link href="/admin/courses">
                <Plus className="mr-3 h-4.5 w-4.5 text-nipro-red group-hover:scale-110 transition-transform" />
                Manage Courses
              </Link>
            </Button>
            <Button variant="outline" className="w-full h-11 justify-start text-xs font-semibold rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 hover:text-zinc-950 text-zinc-700 shadow-sm transition-all group" asChild>
              <Link href="/admin/blogs">
                <Plus className="mr-3 h-4.5 w-4.5 text-nipro-red group-hover:scale-110 transition-transform" />
                Post Update
              </Link>
            </Button>
            <div className="mt-4 p-5 bg-zinc-900 rounded-2xl text-zinc-100 shadow-sm border border-zinc-800">
              <h4 className="font-bold text-sm tracking-tight text-white mb-1.5">Pro Tip</h4>
              <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                You can verify any certificate directly from the public site using the ID. The admin panel is for management only.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
