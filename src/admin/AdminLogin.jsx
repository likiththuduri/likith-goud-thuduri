import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.login(username, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-[#FAF9F6] border border-stone-300 rounded-sm max-w-md w-full p-8 shadow-2xl relative">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Lock size={20} />
          </div>
          <h2 className="font-editorial text-3xl text-stone-900 font-normal">Admin Studio</h2>
          <p className="text-stone-500 text-xs font-mono mt-1">Authenticate to manage your visual captures portfolio</p>
        </div>



        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded text-xs font-mono uppercase tracking-wider font-medium flex items-center justify-center space-x-2 transition-all shadow-subtle disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Studio'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-200 text-center">
          <button
            onClick={onCancel}
            className="text-xs font-mono text-stone-500 hover:text-stone-900 transition-colors"
          >
            ← Return to public website
          </button>
        </div>

      </div>
    </div>
  );
}
