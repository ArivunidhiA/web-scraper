import React from "react";

export default function KnowledgeBasePage() {
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
          <a href="/knowledge" className="block text-white font-semibold">Knowledge Base</a>
          <a href="/analytics" className="block text-gray-400 hover:text-cyan-400">Analytics</a>
          <a href="/settings" className="block text-gray-400 hover:text-cyan-400">Settings</a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base</h1>
            <p className="text-gray-400">Upload documents to enhance AI responses</p>
          </div>
          <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold">Upload Document</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-white">[Upload Card Placeholder]</div>
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-white col-span-3">[Document Cards Placeholder]</div>
        </div>
      </main>
    </div>
  );
} 