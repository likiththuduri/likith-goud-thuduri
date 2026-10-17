import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { api } from '../api';

export default function ContactSection({ settings }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      });

      setSuccessMsg(res.message || 'Thank you! Your message has been sent to Likith.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send message. Please try reaching out via Instagram.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#78716C] mb-2 block">
            04 / Communication
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#1C1917] font-normal">
            Get in Touch
          </h2>
        </div>
        <p className="text-stone-500 text-sm max-w-md mt-2 md:mt-0 font-normal">
          Available for collaborations, inquiries, or just saying hello from Instagram.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Information Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-stone-200/80 shadow-subtle space-y-6">
            <h3 className="font-editorial text-2xl text-stone-900 font-normal">
              Let's create something timeless.
            </h3>
            
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              Whether you want to discuss a photography assignment, inquire about archival fine-art prints, or simply say hi after finding this link in my bio, I'd love to hear from you.
            </p>

            <div className="space-y-4 pt-4 border-t border-stone-100 text-sm">
              <div className="flex items-start space-x-3 text-stone-700">
                <InstagramIcon size={17} className="text-[#E1306C] mt-0.5" />
                <div>
                  <span className="block font-medium text-stone-900">Direct Instagram Message</span>
                  <a
                    href={settings?.instagramUrl || 'https://www.instagram.com/likith_thuduri/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-500 hover:text-stone-900 text-xs font-mono"
                  >
                    @{settings?.instagramUsername || 'likith_thuduri'} ↗
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-stone-700">
                <Mail size={17} className="text-stone-600 mt-0.5" />
                <div>
                  <span className="block font-medium text-stone-900">Email Address</span>
                  <a
                    href={`mailto:${settings?.email || 'contact@likithgoud.com'}`}
                    className="text-stone-500 hover:text-stone-900 text-xs font-mono"
                  >
                    {settings?.email || 'contact@likithgoud.com'}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded border border-stone-100 text-xs font-mono text-stone-500">
              ⚡ Typical response time: Within 24-48 hours. For urgent requests, DM on Instagram.
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-sm border border-stone-200/80 shadow-subtle">
          
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Portrait Session / Archival Print Inquiry / Collaboration"
                className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                Message *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your vision, dates, or what you would like to collaborate on..."
                className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded text-xs font-mono uppercase tracking-wider font-medium flex items-center justify-center space-x-2 transition-all shadow-subtle disabled:opacity-50"
            >
              <Send size={13} />
              <span>{loading ? 'Transmitting...' : 'Send Message'}</span>
            </button>
          </form>

        </div>

      </div>

    </section>
  );
}
