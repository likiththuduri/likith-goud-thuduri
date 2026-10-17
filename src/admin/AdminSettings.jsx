import React, { useState } from 'react';
import { Key, User, ShieldAlert, RotateCcw, Check, Sparkles, HardDrive, Info, Lock } from 'lucide-react';
import { api } from '../api';

export default function AdminSettings({ onResetCompleted }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(null);

  const handleCredentialsChange = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setError('Current password is required to save credential changes');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.changeCredentials(currentPassword, newUsername, newPassword);
      setSuccess(res.message || 'Administrator username & password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message || 'Failed to update administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPortfolio = async () => {
    if (!window.confirm('Are you sure you want to restore the default photography portfolio dataset? Any custom uploads will remain in uploads folder, but data entries will reset to seed.')) {
      return;
    }

    setResetLoading(true);
    try {
      await api.resetDatabase();
      setResetSuccess('Portfolio successfully reset to curated seed dataset');
      if (onResetCompleted) onResetCompleted();
      setTimeout(() => setResetSuccess(null), 4000);
    } catch (err) {
      alert('Failed to reset database');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <h2 className="font-editorial text-2xl sm:text-3xl text-stone-900 font-normal">
          Security & Portfolio Maintenance
        </h2>
        <p className="text-stone-500 text-xs font-mono mt-1">
          Change administrator login username and password, manage storage, and reset defaults.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Change Username & Password Card */}
        <div className="bg-white p-6 rounded-sm border border-stone-200/90 shadow-subtle space-y-4">
          <h3 className="font-editorial text-lg text-stone-900 pb-2 border-b border-stone-100 flex items-center space-x-2">
            <Lock size={16} className="text-stone-700" />
            <span>Change Studio Login & Password</span>
          </h3>

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded flex items-center space-x-2 animate-fadeIn">
              <Check size={14} className="text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono rounded animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleCredentialsChange} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-mono uppercase text-stone-500 mb-1">
                Admin Username
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2 rounded border border-stone-200 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-stone-500 mb-1">
                Current Password * (to verify)
              </label>
              <div className="relative">
                <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-9 pr-3 py-2 rounded border border-stone-200 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-stone-500 mb-1">
                New Password (Optional, leave blank to keep unchanged)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full px-3 py-2 rounded border border-stone-200 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {newPassword && (
              <div>
                <label className="block text-[11px] font-mono uppercase text-stone-500 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 rounded border border-stone-200 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded text-xs font-mono uppercase tracking-wider disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? 'Saving...' : 'Update Login Credentials'}
            </button>
          </form>
        </div>

        {/* System & Maintenance Card */}
        <div className="bg-white p-6 rounded-sm border border-stone-200/90 shadow-subtle space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-editorial text-lg text-stone-900 pb-2 border-b border-stone-100 flex items-center space-x-2">
              <HardDrive size={16} className="text-stone-700" />
              <span>Storage & Architecture</span>
            </h3>

            <div className="text-xs font-mono space-y-2 text-stone-600">
              <div className="flex justify-between p-2 bg-stone-50 rounded border border-stone-100">
                <span className="text-stone-500">Database Engine:</span>
                <span className="font-semibold text-stone-800">JSON File Storage (ACID file sync)</span>
              </div>
              <div className="flex justify-between p-2 bg-stone-50 rounded border border-stone-100">
                <span className="text-stone-500">Image Uploads:</span>
                <span className="font-semibold text-stone-800">Static /uploads/ & Cloud URLs</span>
              </div>
              <div className="flex justify-between p-2 bg-stone-50 rounded border border-stone-100">
                <span className="text-stone-500">Security Layer:</span>
                <span className="font-semibold text-stone-800">Bcrypt Salt 10 & JWT Bearer</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs space-y-1">
              <span className="font-semibold block flex items-center">
                <ShieldAlert size={14} className="mr-1 text-amber-600" />
                Portfolio Reset Utility
              </span>
              <p className="font-light">
                If you ever want to re-seed the default albums, high-res photos, and sample guestbook notes, use the restore button below.
              </p>
            </div>
          </div>

          <div>
            {resetSuccess && (
              <div className="mb-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded">
                {resetSuccess}
              </div>
            )}

            <button
              onClick={handleResetPortfolio}
              disabled={resetLoading}
              className="w-full py-2.5 border border-amber-300 hover:border-amber-600 text-amber-900 bg-amber-50 hover:bg-amber-100 rounded text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCcw size={13} />
              <span>{resetLoading ? 'Resetting...' : 'Restore Curated Default Portfolio'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
