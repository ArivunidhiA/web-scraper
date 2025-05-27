import React, { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 p-6 hidden md:block">
        <div className="mb-8 text-cyan-400 font-bold text-2xl">EventScraper</div>
        <nav className="space-y-4">
          <a href="/dashboard" className="block text-gray-400 hover:text-cyan-400">Dashboard</a>
          <a href="/scrape" className="block text-gray-400 hover:text-cyan-400">Scrape Events</a>
          <a href="/events" className="block text-gray-400 hover:text-cyan-400">Events</a>
          <a href="/ai-chat" className="block text-gray-400 hover:text-cyan-400">AI Chat</a>
          <a href="/knowledge" className="block text-gray-400 hover:text-cyan-400">Knowledge Base</a>
          <a href="/analytics" className="block text-gray-400 hover:text-cyan-400">Analytics</a>
          <a href="/settings" className="block text-white font-semibold">Settings</a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        <div className="flex gap-8">
          {/* Settings Navigation */}
          <div className="w-64">
            <nav className="space-y-1">
              <button onClick={() => setActiveTab('general')} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === 'general' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}`}>General</button>
              <button onClick={() => setActiveTab('notifications')} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === 'notifications' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}`}>Notifications</button>
              <button onClick={() => setActiveTab('ai')} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === 'ai' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}`}>AI & RAG</button>
              <button onClick={() => setActiveTab('api')} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === 'api' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}`}>API Keys</button>
              <button onClick={() => setActiveTab('security')} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === 'security' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}`}>Security</button>
              <button onClick={() => setActiveTab('billing')} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === 'billing' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}`}>Billing</button>
            </nav>
          </div>
          {/* Settings Content */}
          <div className="flex-1">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-white">[Settings Content Placeholder: {activeTab} tab]</div>
          </div>
        </div>
      </main>
    </div>
  );
} 