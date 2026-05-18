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

export default async function AdminDashboard() {
  const courses = await getCoursesAction();
  const certificates = await getCertificates();
  const blogs = await getBlogs();

  const stats = [
    { label: 'Active Courses', value: courses.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Certificates Issued', value: certificates.length, icon: FileCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Blog Posts', value: blogs.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-nipro-blue">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here&apos;s what&apos;s happening at Nipro.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-11 px-6 border-2">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Site
          </Button>
          <Button className="h-11 px-6 bg-nipro-red hover:bg-nipro-red/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-slate-200 shadow-sm rounded-xl bg-white transition-shadow hover:shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-3xl font-bold text-nipro-blue mt-1">{stat.value}</h3>
              </div>
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border border-slate-200 shadow-sm rounded-xl bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Certificates</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/certificates">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {certificates.slice(0, 5).map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <FileCheck className="h-5 w-5 text-nipro-blue" />
                    </div>
                    <div>
                      <p className="font-bold text-nipro-blue">{cert.fullName}</p>
                      <p className="text-xs text-muted-foreground">{cert.courseName} • ID: {cert.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-nipro-blue">{cert.issueDate}</p>
                    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold uppercase tracking-wider">
                      {cert.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 border border-slate-200 shadow-sm rounded-xl bg-white">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full h-11 justify-start text-base font-semibold group border-2" asChild>
              <Link href="/admin/certificates">
                <Plus className="mr-3 h-5 w-5 text-nipro-red group-hover:scale-125 transition-transform" />
                Add Certificate
              </Link>
            </Button>
            <Button variant="outline" className="w-full h-11 justify-start text-base font-semibold group border-2" asChild>
              <Link href="/admin/courses">
                <Plus className="mr-3 h-5 w-5 text-nipro-red group-hover:scale-125 transition-transform" />
                Manage Courses
              </Link>
            </Button>
            <Button variant="outline" className="w-full h-11 justify-start text-base font-semibold group border-2" asChild>
              <Link href="/admin/blogs">
                <Plus className="mr-3 h-5 w-5 text-nipro-red group-hover:scale-125 transition-transform" />
                Post Update
              </Link>
            </Button>
            <div className="mt-4 p-6 bg-nipro-blue rounded-2xl text-white">
              <h4 className="font-bold mb-2">Pro Tip</h4>
              <p className="text-sm opacity-80 leading-relaxed">
                You can verify any certificate directly from the public site using the ID. The admin panel is for management only.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
