"use client";

import React, { useState, useEffect } from 'react';
import { Save, MapPin, Loader2, Globe, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getSettings, saveSettings } from '@/lib/actions';
import { SiteSettings } from '@/lib/data-service';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const data = await getSettings();
      if (mounted) {
        setSettings(data);
        setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!settings) return;
    
    setSaving(true);
    const result = await saveSettings(settings);
    setSaving(false);
    
    if (result.success) {
      toast.success('Settings updated successfully');
    } else {
      toast.error('Failed to save settings');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!settings) return;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'contact') {
        setSettings({
          ...settings,
          contact: {
            ...settings.contact,
            [child]: value
          }
        });
      } else if (parent === 'socialLinks') {
        setSettings({
          ...settings,
          socialLinks: {
            ...settings.socialLinks,
            [child]: value
          }
        });
      }
    } else {
      setSettings({ ...settings, [name as keyof SiteSettings]: value });
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-nipro-red" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Configure institute information and contact details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border border-black/[0.03] shadow-sm rounded-[24px] bg-white transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-bold text-slate-950 tracking-tight text-base">
                <Globe className="h-4.5 w-4.5 text-zinc-500" />
                Institute Branding
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs font-medium">Main identity of the institute across the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 ml-1">Institute Name</label>
                <Input 
                  name="name" 
                  value={settings?.name || ''} 
                  onChange={handleChange} 
                  className="h-10 rounded-lg bg-slate-50/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-black/[0.04] focus:border-slate-400/80 transition-all text-xs font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 ml-1">Tagline</label>
                <Input 
                  name="tagline" 
                  value={settings?.tagline || ''} 
                  onChange={handleChange} 
                  className="h-10 rounded-lg bg-slate-50/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-black/[0.04] focus:border-slate-400/80 transition-all text-xs font-medium"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-black/[0.02] transition-colors mt-4">
                <div className="pr-4">
                  <label className="text-xs font-bold text-slate-950 block">Promotional Banner</label>
                  <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug font-medium">Toggle the visibility of the site-wide promotional discount banner.</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_offer_active"
                    id="is_offer_active"
                    checked={settings?.is_offer_active || false}
                    onChange={(e) => {
                      if (settings) {
                        setSettings({
                          ...settings,
                          is_offer_active: e.target.checked
                        });
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-black/[0.03] shadow-sm rounded-[24px] bg-white transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-bold text-slate-950 tracking-tight text-base">
                <Phone className="h-4.5 w-4.5 text-zinc-500" />
                Contact Information
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs font-medium">Displayed on the contact page and footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 ml-1">Phone Number</label>
                <Input 
                  name="contact.phone" 
                  value={settings?.contact.phone || ''} 
                  onChange={handleChange} 
                  className="h-10 rounded-lg bg-slate-50/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-black/[0.04] focus:border-slate-400/80 transition-all text-xs font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 ml-1">Email Address</label>
                <Input 
                  name="contact.email" 
                  value={settings?.contact.email || ''} 
                  onChange={handleChange} 
                  className="h-10 rounded-lg bg-slate-50/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-black/[0.04] focus:border-slate-400/80 transition-all text-xs font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 ml-1">WhatsApp Number</label>
                <Input 
                  name="contact.whatsapp" 
                  value={settings?.contact.whatsapp || ''} 
                  onChange={handleChange} 
                  className="h-10 rounded-lg bg-slate-50/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-black/[0.04] focus:border-slate-400/80 transition-all text-xs font-medium"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-black/[0.03] shadow-sm rounded-[24px] bg-white transition-all duration-300 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-bold text-slate-950 tracking-tight text-base">
                <MapPin className="h-4.5 w-4.5 text-zinc-500" />
                Location & Hours
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs font-medium">Physical address and operational timings.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 ml-1">Address</label>
                <Input 
                  name="contact.address" 
                  value={settings?.contact.address || ''} 
                  onChange={handleChange} 
                  className="h-10 rounded-lg bg-slate-50/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-black/[0.04] focus:border-slate-400/80 transition-all text-xs font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 ml-1">Google Maps Link</label>
                <Input 
                  name="contact.googleMapsLink" 
                  value={settings?.contact.googleMapsLink || ''} 
                  onChange={handleChange} 
                  className="h-10 rounded-lg bg-slate-50/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-black/[0.04] focus:border-slate-400/80 transition-all text-xs font-medium"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 ml-1">Working Hours</label>
                <Input 
                  name="contact.hours" 
                  value={settings?.contact.hours || ''} 
                  onChange={handleChange} 
                  className="h-10 rounded-lg bg-slate-50/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-black/[0.04] focus:border-slate-400/80 transition-all text-xs font-medium"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={saving}
            className="h-10 px-6 bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs tracking-wider rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
