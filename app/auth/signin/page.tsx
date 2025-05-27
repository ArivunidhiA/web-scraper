import React from "react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-gray-400 mb-8">Sign in to continue to EventScraper</p>
        <div className="space-y-3 mb-8">
          <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-xl font-semibold">Sign in with Google</button>
          <button className="w-full bg-gray-800 text-gray-200 py-3 rounded-xl font-semibold">Sign in with GitHub</button>
        </div>
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
          </div>
        </div>
        <form>
          <input type="email" placeholder="Email address" className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-cyan-400" />
          <button className="w-full bg-cyan-500 text-white py-3 rounded-xl font-semibold">Send Magic Link</button>
        </form>
      </div>
    </div>
  );
} 