import React, { useState } from "react";

export default function ScrapingPage() {
  const [urls, setUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 p-6 hidden md:block">
        <div className="mb-8 text-cyan-400 font-bold text-2xl">EventScraper</div>
        <nav className="space-y-4">
          <a href="/dashboard" className="block text-gray-400 hover:text-cyan-400">Dashboard</a>
          <a href="/scrape" className="block text-white font-semibold">Scrape Events</a>
          <a href="/events" className="block text-gray-400 hover:text-cyan-400">Events</a>
          <a href="/ai-chat" className="block text-gray-400 hover:text-cyan-400">AI Chat</a>
          <a href="/knowledge" className="block text-gray-400 hover:text-cyan-400">Knowledge Base</a>
          <a href="/analytics" className="block text-gray-400 hover:text-cyan-400">Analytics</a>
          <a href="/settings" className="block text-gray-400 hover:text-cyan-400">Settings</a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
          <h1 className="text-3xl font-bold text-white mb-2">Scrape Events</h1>
          <p className="text-gray-400 mb-8">Extract event data from multiple platforms at once</p>
          <textarea
            className="w-full h-32 mb-4 px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-cyan-400"
            placeholder="Paste event URLs here, one per line..."
            value={urls.join("\n")}
            onChange={e => setUrls(e.target.value.split("\n"))}
          />
          <button
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-xl font-semibold mb-4"
            onClick={() => setIsProcessing(true)}
            disabled={isProcessing || urls.length === 0}
          >
            {isProcessing ? "Processing..." : "Start Scraping"}
          </button>
          {isProcessing && (
            <div className="mt-6 text-cyan-400">[Active Jobs Placeholder]</div>
          )}
        </div>
      </main>
    </div>
  );
} 