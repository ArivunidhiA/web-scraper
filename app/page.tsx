import React from "react";

// Placeholder components for advanced UI elements
const ParticleBackground = () => <div className="absolute inset-0 z-0" />;
const Logo = (props: any) => <span className={props.className || "text-2xl font-bold"}>EventScraper</span>;
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-gray-300 hover:text-cyan-400 transition-colors">{children}</a>
);
const Button = ({ children, className = "", variant = "solid", ...props }: any) => (
  <button
    className={`px-6 py-2 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
      variant === "ghost"
        ? "bg-transparent text-cyan-400 hover:bg-cyan-900/20"
        : "bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400"
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);
const FeatureCard = ({ icon, title, description, gradient }: any) => (
  <div className={`rounded-2xl p-8 shadow-lg bg-gradient-to-br ${gradient} text-white flex flex-col items-center`}> 
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-100 text-center">{description}</p>
  </div>
);
const InteractiveDemo = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-white text-center">
    <p className="mb-2">[Interactive Demo Placeholder]</p>
    <input className="bg-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-400 border border-white/20 focus:border-cyan-400 transition-colors w-full mb-4" placeholder="Try: 'Find all AI conferences in San Francisco next month'" />
    <Button>Search</Button>
  </div>
);

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      {/* Animated background with Three.js particles */}
      <ParticleBackground />

      {/* Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <Logo className="text-cyan-400 text-2xl font-bold" />
        <div className="flex items-center gap-8">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#demo">Demo</NavLink>
          <Button variant="ghost">Sign In</Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-24 text-center">
        <div>
          <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Scrape Events Intelligently
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
            AI-powered event scraping with RAG technology. Extract, analyze, and discover events from any platform with natural language queries.
          </p>

          {/* Interactive Demo */}
          <div className="mt-12 max-w-4xl mx-auto">
            <InteractiveDemo />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-8 py-24" id="features">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <FeatureCard
            icon={<span className="text-4xl">🤖</span>}
            title="AI-Powered Extraction"
            description="Intelligent scraping that understands context"
            gradient="from-cyan-500 to-blue-500"
          />
          <FeatureCard
            icon={<span className="text-4xl">🧠</span>}
            title="RAG Knowledge Base"
            description="Ask questions, get intelligent answers"
            gradient="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={<span className="text-4xl">⚡</span>}
            title="Real-time Processing"
            description="Bulk process thousands of URLs instantly"
            gradient="from-yellow-500 to-orange-500"
          />
        </div>
      </section>
    </div>
  );
} 