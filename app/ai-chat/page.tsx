import React from "react";

export default function AIChatPage() {
  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 p-6 hidden md:block">
        <div className="mb-8 text-cyan-400 font-bold text-2xl">EventScraper</div>
        <nav className="space-y-4">
          <a href="/dashboard" className="block text-gray-400 hover:text-cyan-400">Dashboard</a>
          <a href="/scrape" className="block text-gray-400 hover:text-cyan-400">Scrape Events</a>
          <a href="/events" className="block text-gray-400 hover:text-cyan-400">Events</a>
          <a href="/ai-chat" className="block text-white font-semibold">AI Chat</a>
          <a href="/knowledge" className="block text-gray-400 hover:text-cyan-400">Knowledge Base</a>
          <a href="/analytics" className="block text-gray-400 hover:text-cyan-400">Analytics</a>
          <a href="/settings" className="block text-gray-400 hover:text-cyan-400">Settings</a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-white h-[70vh] flex flex-col">
          <h1 className="text-3xl font-bold mb-4">AI Chat Assistant</h1>
          <div className="flex-1 flex items-center justify-center">[RAG Chat Interface Placeholder]</div>
        </div>
      </main>
    </div>
  );
} 