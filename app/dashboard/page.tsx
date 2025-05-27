import React from "react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 p-6 hidden md:block">
        <div className="mb-8 text-cyan-400 font-bold text-2xl">EventScraper</div>
        <nav className="space-y-4">
          <a href="/dashboard" className="block text-white font-semibold">Dashboard</a>
          <a href="/scrape" className="block text-gray-400 hover:text-cyan-400">Scrape Events</a>
          <a href="/events" className="block text-gray-400 hover:text-cyan-400">Events</a>
          <a href="/ai-chat" className="block text-gray-400 hover:text-cyan-400">AI Chat</a>
          <a href="/knowledge" className="block text-gray-400 hover:text-cyan-400">Knowledge Base</a>
          <a href="/analytics" className="block text-gray-400 hover:text-cyan-400">Analytics</a>
          <a href="/settings" className="block text-gray-400 hover:text-cyan-400">Settings</a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-900/10 rounded-xl p-6 text-white">
            <div className="text-lg font-bold">Total Events</div>
            <div className="text-3xl font-mono mt-2">2,847</div>
            <div className="text-green-400 mt-1">+12%</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-900/10 rounded-xl p-6 text-white">
            <div className="text-lg font-bold">Active Scrapes</div>
            <div className="text-3xl font-mono mt-2">23</div>
            <div className="text-green-400 mt-1">+5</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/20 to-pink-900/10 rounded-xl p-6 text-white">
            <div className="text-lg font-bold">Knowledge Base</div>
            <div className="text-3xl font-mono mt-2">156 docs</div>
            <div className="text-green-400 mt-1">+23</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-900/10 rounded-xl p-6 text-white">
            <div className="text-lg font-bold">AI Queries</div>
            <div className="text-3xl font-mono mt-2">1,234</div>
            <div className="text-green-400 mt-1">+34%</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-white">[Recent Events Table Placeholder]</div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl p-6 border border-cyan-500/20 text-white">[AI Insights Panel Placeholder]</div>
        </div>
        <div className="mt-8 bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-white">[Trending Topics Widget Placeholder]</div>
      </main>
    </div>
  );
} 