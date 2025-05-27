import React, { useState } from "react";

export default function EventsPage() {
  const [view, setView] = useState<'grid' | 'list' | 'calendar'>('grid');

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 p-6 hidden md:block">
        <div className="mb-8 text-cyan-400 font-bold text-2xl">EventScraper</div>
        <nav className="space-y-4">
          <a href="/dashboard" className="block text-gray-400 hover:text-cyan-400">Dashboard</a>
          <a href="/scrape" className="block text-gray-400 hover:text-cyan-400">Scrape Events</a>
          <a href="/events" className="block text-white font-semibold">Events</a>
          <a href="/ai-chat" className="block text-gray-400 hover:text-cyan-400">AI Chat</a>
          <a href="/knowledge" className="block text-gray-400 hover:text-cyan-400">Knowledge Base</a>
          <a href="/analytics" className="block text-gray-400 hover:text-cyan-400">Analytics</a>
          <a href="/settings" className="block text-gray-400 hover:text-cyan-400">Settings</a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Events</h1>
            <p className="text-gray-400">Browse and manage your scraped events</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setView('grid')} className={`px-4 py-2 rounded-lg ${view === 'grid' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}`}>Grid</button>
            <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg ${view === 'list' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}`}>List</button>
            <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-lg ${view === 'calendar' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}`}>Calendar</button>
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold">Add Event</button>
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-white">[Events Display Placeholder: {view} view]</div>
      </main>
    </div>
  );
} 