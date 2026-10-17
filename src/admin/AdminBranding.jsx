import React, { useState, useEffect } from 'react';
import { Save, Check, User, Type, AlignLeft, Sparkles, Eye, Camera, Plus, Trash2, Edit2, Share2 } from 'lucide-react';
import InstagramIcon from '../components/InstagramIcon';
import { api } from '../api';

export default function AdminBranding({ initialSettings, onSettingsUpdated }) {
  const [form, setForm] = useState({
    fullName: '',
    brandName: '',
    tagline: '',
    heroHeading: '',
    introText: '',
    instagramUsername: '',
    instagramUrl: '',
    email: '',
    location: '',
    bioHeading: '',
    aboutBio: '',
    footerText: '',
    autoApproveGuestbook: true,
    gearList: [],
    socialLinks: []
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState(null);

  // New gear item modal/inputs
  const [newGear, setNewGear] = useState({ item: '', category: 'Lens', detail: '' });
  const [showAddGear, setShowAddGear] = useState(false);

  // New social link input
  const [newSocial, setNewSocial] = useState({ platform: '', handle: '', url: '' });
  const [showAddSocial, setShowAddSocial] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setForm({
        fullName: initialSettings.fullName || 'Thuduri Likith Goud',
        brandName: initialSettings.brandName || 'likith.',
        tagline: initialSettings.tagline || 'into my captures',
        heroHeading: initialSettings.heroHeading || 'A little corner of my world.',
        introText: initialSettings.introText || 'Moments, places, people, and memories — collected one frame at a time.',
        instagramUsername: initialSettings.instagramUsername || 'likith_thuduri',
        instagramUrl: initialSettings.instagramUrl || 'https://www.instagram.com/likith_thuduri/',
        email: initialSettings.email || 'contact@likithgoud.com',
        location: initialSettings.location || 'Hyderabad, India',
        bioHeading: initialSettings.bioHeading || 'The human experience in 35mm and ambient light.',
        aboutBio: initialSettings.aboutBio || '',
        footerText: initialSettings.footerText || '',
        autoApproveGuestbook: initialSettings.autoApproveGuestbook !== false,
        gearList: initialSettings.gearList || [],
        socialLinks: initialSettings.socialLinks || []
      });
    }
  }, [initialSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await api.updateSettings(form);
      setSavedSuccess(true);
      if (onSettingsUpdated) {
        onSettingsUpdated(res.settings);
      }
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      setError(err.message || 'Failed to update branding settings');
    } finally {
      setSaving(false);
    }
  };

  // Gear Actions (Add, Edit, Delete)
  const handleAddGear = (e) => {
    e.preventDefault();
    if (!newGear.item.trim()) return;
    setForm(prev => ({
      ...prev,
      gearList: [...prev.gearList, { ...newGear }]
    }));
    setNewGear({ item: '', category: 'Lens', detail: '' });
    setShowAddGear(false);
  };

  const handleDeleteGear = (index) => {
    setForm(prev => ({
      ...prev,
      gearList: prev.gearList.filter((_, idx) => idx !== index)
    }));
  };

  const handleUpdateGearField = (index, field, value) => {
    setForm(prev => {
      const updated = [...prev.gearList];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, gearList: updated };
    });
  };

  // Social Links Actions (Add, Delete)
  const handleAddSocial = (e) => {
    e.preventDefault();
    if (!newSocial.platform.trim() || !newSocial.url.trim()) return;
    setForm(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { ...newSocial }]
    }));
    setNewSocial({ platform: '', handle: '', url: '' });
    setShowAddSocial(false);
  };

  const handleDeleteSocial = (index) => {
    setForm(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, idx) => idx !== index)
    }));
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-stone-900 font-normal">
            Identity & Branding Customization
          </h2>
          <p className="text-stone-500 text-xs font-mono mt-1">
            Edit all public text, headings, bios, gear equipment, and Instagram links without touching code.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded bg-stone-900 text-stone-100 hover:bg-stone-800 text-xs font-mono uppercase tracking-wider transition-all shadow-subtle disabled:opacity-50"
        >
          {savedSuccess ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded flex items-center space-x-2 animate-fadeIn">
          <Sparkles size={15} className="text-emerald-600" />
          <span>Branding and gear saved to database. All public pages now reflect your new identity!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono rounded">
          {error}
        </div>
      )}

      {/* Live Preview Box */}
      <div className="bg-white p-6 rounded-sm border border-stone-200/90 shadow-subtle">
        <div className="flex items-center space-x-2 text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
          <Eye size={14} className="text-stone-700" />
          <span>Live Hero Preview (Real-time)</span>
        </div>

        <div className="bg-[#FAF9F6] p-6 sm:p-8 rounded border border-stone-200 text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-stone-100 text-[11px] font-mono uppercase tracking-wider text-stone-700 border border-stone-200">
            <span className="font-bold text-stone-900">{form.fullName || 'THUDURI LIKITH GOUD'}</span>
            <span>•</span>
            <span>{form.location || 'Location'}</span>
          </div>

          <h3 className="font-editorial text-3xl sm:text-4xl text-stone-900">
            {form.heroHeading || 'Hero Heading'}
          </h3>

          <p className="text-stone-600 text-sm max-w-xl mx-auto font-light">
            {form.introText || 'Introductory text...'}
          </p>

          <div className="pt-2 flex items-center justify-center space-x-3 text-xs font-mono text-stone-500">
            <span>Brand: <strong className="text-stone-900">{form.brandName}</strong></span>
            <span>•</span>
            <span>Tagline: <strong className="text-stone-900">{form.tagline}</strong></span>
            <span>•</span>
            <span className="text-[#E1306C]">@{form.instagramUsername}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Branding Card */}
        <div className="bg-white p-6 rounded-sm border border-stone-200/90 shadow-subtle space-y-4">
          <h3 className="font-editorial text-lg text-stone-900 pb-2 border-b border-stone-100 flex items-center space-x-2">
            <Type size={16} className="text-stone-700" />
            <span>Brand & Identity</span>
          </h3>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Full Legal / Artist Name *
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={form.fullName}
              onChange={handleChange}
              placeholder="Thuduri Likith Goud"
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 font-semibold uppercase tracking-wide"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Website Brand Name *
            </label>
            <input
              type="text"
              name="brandName"
              required
              value={form.brandName}
              onChange={handleChange}
              placeholder="likith."
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 font-editorial text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Main Tagline *
            </label>
            <input
              type="text"
              name="tagline"
              required
              value={form.tagline}
              onChange={handleChange}
              placeholder="into my captures"
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Primary Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Hyderabad, India"
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
            />
          </div>
        </div>

        {/* Instagram & Social Card */}
        <div className="bg-white p-6 rounded-sm border border-stone-200/90 shadow-subtle space-y-4">
          <h3 className="font-editorial text-lg text-stone-900 pb-2 border-b border-stone-100 flex items-center space-x-2">
            <InstagramIcon size={16} className="text-[#E1306C]" />
            <span>Instagram Bio Links</span>
          </h3>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Instagram Username (Handle) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-sm">@</span>
              <input
                type="text"
                name="instagramUsername"
                required
                value={form.instagramUsername}
                onChange={handleChange}
                placeholder="likith_thuduri"
                className="w-full pl-8 pr-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Instagram Direct Profile URL *
            </label>
            <input
              type="url"
              name="instagramUrl"
              required
              value={form.instagramUrl}
              onChange={handleChange}
              placeholder="https://www.instagram.com/likith_thuduri/"
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Public Contact Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contact@likithgoud.com"
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 font-mono text-xs"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2.5 text-xs font-mono text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                name="autoApproveGuestbook"
                checked={form.autoApproveGuestbook}
                onChange={handleChange}
                className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900"
              />
              <span>Instantly publish guestbook entries without manual review</span>
            </label>
          </div>
        </div>

        {/* Hero & Intro Section Card */}
        <div className="bg-white p-6 rounded-sm border border-stone-200/90 shadow-subtle space-y-4 md:col-span-2">
          <h3 className="font-editorial text-lg text-stone-900 pb-2 border-b border-stone-100 flex items-center space-x-2">
            <AlignLeft size={16} className="text-stone-700" />
            <span>Hero Statements & Introduction</span>
          </h3>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Hero Heading (Serif Display) *
            </label>
            <input
              type="text"
              name="heroHeading"
              required
              value={form.heroHeading}
              onChange={handleChange}
              placeholder="A little corner of my world."
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 font-editorial text-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Hero Subtitle / Introductory Text *
            </label>
            <textarea
              name="introText"
              rows={2}
              required
              value={form.introText}
              onChange={handleChange}
              placeholder="Moments, places, people, and memories — collected one frame at a time."
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 resize-none font-normal"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              About Bio Headline
            </label>
            <input
              type="text"
              name="bioHeading"
              value={form.bioHeading}
              onChange={handleChange}
              placeholder="The human experience in 35mm and ambient light."
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 font-editorial"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Complete About Narrative / Artist Statement
            </label>
            <textarea
              name="aboutBio"
              rows={4}
              value={form.aboutBio}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 resize-none font-light leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Footer Copyright Text
            </label>
            <input
              type="text"
              name="footerText"
              value={form.footerText}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 font-mono"
            />
          </div>
        </div>

        {/* Camera Gear Manager (Add / Edit / Delete items in camera bag) */}
        <div className="bg-white p-6 rounded-sm border border-stone-200/90 shadow-subtle space-y-4 md:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-editorial text-lg text-stone-900 flex items-center space-x-2">
              <Camera size={16} className="text-stone-700" />
              <span>Camera Bag Equipment (Editable & Removable)</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddGear(!showAddGear)}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-mono"
            >
              <Plus size={13} />
              <span>Add Gear Item</span>
            </button>
          </div>

          {showAddGear && (
            <div className="p-4 bg-stone-50 rounded border border-stone-200 space-y-3 animate-fadeIn">
              <span className="text-xs font-mono uppercase text-stone-700 font-semibold block">Add New Gear</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Gear Item (e.g. Sony 35mm f/1.4 GM)"
                  value={newGear.item}
                  onChange={(e) => setNewGear({ ...newGear, item: e.target.value })}
                  className="px-3 py-1.5 rounded border border-stone-200 text-xs font-mono"
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Prime Lens, Body, Filter)"
                  value={newGear.category}
                  onChange={(e) => setNewGear({ ...newGear, category: e.target.value })}
                  className="px-3 py-1.5 rounded border border-stone-200 text-xs font-mono"
                />
                <input
                  type="text"
                  placeholder="Detail (e.g. Daily street & portrait lens)"
                  value={newGear.detail}
                  onChange={(e) => setNewGear({ ...newGear, detail: e.target.value })}
                  className="px-3 py-1.5 rounded border border-stone-200 text-xs font-mono"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddGear(false)}
                  className="px-3 py-1 text-xs font-mono text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddGear}
                  className="px-4 py-1 bg-stone-900 text-white rounded text-xs font-mono"
                >
                  Confirm Add
                </button>
              </div>
            </div>
          )}

          {/* List of Gear with In-place Edit & Delete */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {form.gearList.map((g, idx) => (
              <div key={idx} className="p-3 bg-stone-50 rounded border border-stone-200 flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={g.item}
                      onChange={(e) => handleUpdateGearField(idx, 'item', e.target.value)}
                      className="text-xs font-semibold text-stone-900 bg-transparent border-b border-stone-300 focus:border-stone-900 w-full"
                    />
                    <input
                      type="text"
                      value={g.category}
                      onChange={(e) => handleUpdateGearField(idx, 'category', e.target.value)}
                      className="text-[10px] font-mono text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200 uppercase w-28 text-center"
                    />
                  </div>
                  <input
                    type="text"
                    value={g.detail}
                    onChange={(e) => handleUpdateGearField(idx, 'detail', e.target.value)}
                    className="text-[11px] text-stone-500 bg-transparent border-b border-transparent focus:border-stone-300 w-full"
                    placeholder="Notes on gear..."
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteGear(idx)}
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                  title="Delete Gear Item"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </form>

    </div>
  );
}
