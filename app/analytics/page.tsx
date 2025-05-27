import React from "react";

export default function AnalyticsPage() {
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
          <a href="/analytics" className="block text-white font-semibold">Analytics</a>
          <a href="/settings" className="block text-gray-400 hover:text-cyan-400">Settings</a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <div className="bg-gray-800 text-gray-400 px-4 py-2 rounded-lg">[Date Range Picker Placeholder]</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-900/10 rounded-xl p-6 text-white">[Metric Card 1]</div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-900/10 rounded-xl p-6 text-white">[Metric Card 2]</div>
          <div className="bg-gradient-to-br from-pink-500/20 to-pink-900/10 rounded-xl p-6 text-white">[Metric Card 3]</div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-900/10 rounded-xl p-6 text-white">[Metric Card 4]</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-white">[Platform Distribution Chart Placeholder]</div>
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-white">[Query Topics Heatmap Placeholder]</div>
        </div>
        <div className="mb-8 bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-white">[RAG Evaluation Dashboard Placeholder]</div>
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-white">[Activity Timeline Placeholder]</div>
      </main>
    </div>
  );
} 